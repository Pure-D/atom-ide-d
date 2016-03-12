"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var ChildProcess = require("child_process");
var path = require("path");
var fs = require("fs");
var events_1 = require("events");
var TARGET_VERSION = [2, 6, 0];
var WorkspaceD = (function (_super) {
    __extends(WorkspaceD, _super);
    function WorkspaceD(projectRoot) {
        _super.call(this);
        this.projectRoot = projectRoot;
        this.runCheckTimeout = -1;
        this.workspaced = true;
        this.dubReady = false;
        this.dcdReady = false;
        this.dlanguiReady = false;
        this.dscannerReady = false;
        this.shouldRestart = true;
        this.requestNum = 0;
        this.lintTypes = {
            warn: "Warning",
            error: "Error"
        };
        this.types = {
            c: "class",
            i: "interface",
            s: "struct",
            u: "union",
            v: "variable",
            m: "member",
            k: "keyword",
            f: "function",
            g: "class",
            e: "constant",
            P: "import",
            M: "import",
            a: "variable",
            A: "variable",
            l: "alias",
            t: "class",
            T: "class",
        };
        var self = this;
        this.on("error", function (err) {
            console.error(err);
            if (this.shouldRestart)
                self.ensureDCDRunning();
        });
        this.startWorkspaceD();
    }
    WorkspaceD.prototype.startWorkspaceD = function () {
        if (!this.shouldRestart)
            return;
        var self = this;
        this.workspaced = true;
        var path = atom.config.get("atomize-d.workspacedPath") || "workspace-d";
        console.log("spawning " + path + " with cwd " + this.projectRoot);
        this.instance = ChildProcess.spawn(path, [], { cwd: this.projectRoot });
        this.totalData = new Buffer(0);
        this.instance.stderr.on("data", function (chunk) {
            console.log("WorkspaceD Debug: " + chunk);
            if (chunk.toString().indexOf("DCD-Server stopped with code") != -1)
                self.ensureDCDRunning();
        });
        this.instance.stdout.on("data", function (chunk) {
            self.handleData.call(self, chunk);
        });
        this.instance.on("error", function (err) {
            console.log("WorkspaceD ended with an error:");
            console.log(err);
            if (err && err.code == "ENOENT") {
                atom.notifications.addError("'" + path + "' is not a valid executable. Please check your user settings and make sure workspace-d is installed!");
                self.workspaced = false;
            }
        });
        this.instance.on("exit", function (code) {
            console.log("WorkspaceD ended with code " + code);
            atom.notifications.addError("Workspace-D crashed. Please kill dcd-server if neccessary!");
            self.workspaced = false;
        });
        this.checkVersion();
    };
    WorkspaceD.prototype.getSuggestions = function (options) {
        var self = this;
        console.log("provideCompletionItems");
        return new Promise(function (resolve, reject) {
            if (!self.dcdReady)
                return resolve([]);
            var offset = options.editor.buffer.characterIndexForPosition(options.editor.getSelectedBufferRange().start);
            self.request({ cmd: "dcd", subcmd: "list-completion", code: options.editor.buffer.getText(), pos: offset }).then(function (completions) {
                if (completions.type == "identifiers") {
                    var items_1 = [];
                    if (completions.identifiers && completions.identifiers.length)
                        completions.identifiers.forEach(function (element) {
                            var item = {
                                text: element.identifier,
                                type: self.types[element.type] || "unknown"
                            };
                            items_1.push(item);
                        });
                    console.log("resolve identifiers");
                    console.log(items_1);
                    resolve(items_1);
                }
                else if (completions.type == "calltips") {
                    var items_2 = [];
                    if (completions.calltips && completions.calltips.length)
                        completions.calltips.forEach(function (element) {
                            var item = {
                                text: element
                            };
                            items_2.push(item);
                        });
                    console.log("resolve calltips");
                    console.log(items_2);
                    resolve(items_2);
                }
                else {
                    console.log("resolve null");
                    resolve([]);
                }
            }, reject);
        });
    };
    WorkspaceD.prototype.lint = function (document) {
        var _this = this;
        var self = this;
        console.log("lint");
        return new Promise(function (resolve, reject) {
            if (!self.dscannerReady)
                return resolve([]);
            var useProjectIni = fs.existsSync(path.join(self.projectRoot, "dscanner.ini"));
            self.request({ cmd: "dscanner", subcmd: "lint", file: document.getPath(), ini: useProjectIni ? path.join(self.projectRoot, "dscanner.ini") : "" }).then(function (issues) {
                var diagnostics = [];
                if (issues && issues.length)
                    issues.forEach(function (element) {
                        var range = [[Math.max(0, element.line - 1), element.column - 1], [Math.max(0, element.line - 1), element.column + 300]];
                        console.log(range);
                        diagnostics.push({
                            type: _this.lintTypes[element.type] || element.type,
                            text: element.description,
                            range: range,
                            filePath: document.getPath()
                        });
                    });
                console.log("Resolve");
                console.log(diagnostics);
                resolve(diagnostics);
            }, reject);
        });
    };
    WorkspaceD.prototype.dispose = function () {
        var _this = this;
        this.shouldRestart = false;
        console.log("Disposing");
        var to = setTimeout(this.instance.kill, 150);
        this.request({ cmd: "unload", components: "*" }).then(function (data) {
            console.log("Unloaded");
            _this.instance.kill();
            clearTimeout(to);
        });
    };
    WorkspaceD.prototype.listConfigurations = function () {
        return this.request({ cmd: "dub", subcmd: "list:configurations" });
    };
    WorkspaceD.prototype.getConfiguration = function () {
        return this.request({ cmd: "dub", subcmd: "get:configuration" });
    };
    WorkspaceD.prototype.setConfiguration = function (config) {
        var _this = this;
        this.request({ cmd: "dub", subcmd: "set:configuration", configuration: config }).then(function (success) {
            if (success) {
                _this.listImports().then(console.log);
                _this.emit("configuration-change", config);
            }
            else
                atom.notifications.addInfo("No import paths available for this project. Autocompletion could be broken!");
        });
    };
    WorkspaceD.prototype.listBuildTypes = function () {
        return this.request({ cmd: "dub", subcmd: "list:build-types" });
    };
    WorkspaceD.prototype.getBuildType = function () {
        return this.request({ cmd: "dub", subcmd: "get:build-type" });
    };
    WorkspaceD.prototype.setBuildType = function (config) {
        var _this = this;
        this.request({ cmd: "dub", subcmd: "set:build-type", "build-type": config }).then(function (success) {
            if (success) {
                _this.request({ cmd: "dub", subcmd: "list:import" }).then(console.log);
                _this.emit("build-type-change", config);
            }
            else
                atom.notifications.addInfo("No import paths available for this build type. Autocompletion could be broken!");
        });
    };
    WorkspaceD.prototype.killServer = function () {
        if (!this.dcdReady)
            return new Promise(function (resolve, reject) { reject(); });
        return this.request({ cmd: "dcd", subcmd: "kill-server" });
    };
    WorkspaceD.prototype.restartServer = function () {
        if (!this.dcdReady)
            return new Promise(function (resolve, reject) { reject(); });
        return this.request({ cmd: "dcd", subcmd: "restart-server" });
    };
    WorkspaceD.prototype.updateImports = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (!_this.dubReady)
                reject();
            _this.request({ cmd: "dub", subcmd: "update" }).then(function (success) {
                if (!success)
                    return resolve(success);
                if (_this.dcdReady) {
                    _this.request({ cmd: "dcd", subcmd: "refresh-imports" }).then(function () {
                        resolve(true);
                        _this.listImports().then(console.log);
                    });
                }
                else {
                    atom.notifications.addWarning("Could not update DCD. Please restart DCD if its not working properly");
                    resolve(true);
                }
            });
        });
    };
    WorkspaceD.prototype.listImports = function () {
        if (!this.dubReady)
            return new Promise(function (resolve, reject) { resolve([]); });
        return this.request({ cmd: "dub", subcmd: "list:import" });
    };
    WorkspaceD.prototype.checkVersion = function () {
        var _this = this;
        this.request({ cmd: "version" }).then(function (version) {
            if (version.major < TARGET_VERSION[0])
                return atom.notifications.addError("workspace-d is outdated! Please update to continue using this plugin. (target=" + formatVersion(TARGET_VERSION) + ", workspaced=" + formatVersion([version.major, version.minor, version.patch]) + ")");
            if (version.major == TARGET_VERSION[0] && version.minor < TARGET_VERSION[1])
                atom.notifications.addWarning("workspace-d might be outdated! Please update if things are not working as expected. (target=" + formatVersion(TARGET_VERSION) + ", workspaced=" + formatVersion([version.major, version.minor, version.patch]) + ")");
            if (version.major == TARGET_VERSION[0] && version.minor == TARGET_VERSION[1] && version.path < TARGET_VERSION[2])
                atom.notifications.addInfo("workspace-d has a new optional update! Please update before submitting a bug report. (target=" + formatVersion(TARGET_VERSION) + ", workspaced=" + formatVersion([version.major, version.minor, version.patch]) + ")");
            _this.setupDub();
        }, function () {
            atom.notifications.addError("Could not identify workspace-d version. Please update workspace-d!");
        });
    };
    WorkspaceD.prototype.dubPackageDescriptorExists = function () {
        return fs.existsSync(path.join(this.projectRoot, "dub.json")) ||
            fs.existsSync(path.join(this.projectRoot, "dub.sdl")) ||
            fs.existsSync(path.join(this.projectRoot, "package.json"));
    };
    WorkspaceD.prototype.setupDub = function () {
        var _this = this;
        if (atom.config.get("atomize-d.neverUseDub")) {
            this.setupCustomWorkspace();
            return;
        }
        if (this.dubPackageDescriptorExists()) {
            this.request({ cmd: "load", components: ["dub"], dir: this.projectRoot }).then(function (data) {
                console.log("dub is ready");
                _this.dubReady = true;
                _this.emit("dub-ready");
                _this.setupDCD();
                _this.setupDScanner();
                _this.setupDlangUI();
                _this.listConfigurations().then(function (configs) {
                    if (configs.length == 0) {
                        atom.notifications.addInfo("No configurations available for this project. Autocompletion could be broken!");
                    }
                    else {
                        _this.setConfiguration(configs[0]);
                    }
                });
            }, function (err) {
                atom.notifications.addWarning("Could not initialize dub. Falling back to limited functionality!");
                _this.setupCustomWorkspace();
            });
        }
        else
            this.setupCustomWorkspace();
    };
    WorkspaceD.prototype.getPossibleSourceRoots = function () {
        var _this = this;
        var confPaths = atom.config.get("atomize-d.projectImportPaths") || [];
        if (confPaths && confPaths.length) {
            var roots_1 = [];
            confPaths.forEach(function (p) {
                if (path.isAbsolute(p))
                    roots_1.push(p);
                else
                    roots_1.push(path.join(_this.projectRoot, p));
            });
            return roots_1;
        }
        if (fs.existsSync(path.join(this.projectRoot, "source")))
            return [path.join(this.projectRoot, "source")];
        if (fs.existsSync(path.join(this.projectRoot, "src")))
            return [path.join(this.projectRoot, "src")];
        return [this.projectRoot];
    };
    WorkspaceD.prototype.setupCustomWorkspace = function () {
        var _this = this;
        var paths = this.getPossibleSourceRoots();
        var rootDir = paths[0];
        var addPaths = [];
        if (paths.length > 1)
            addPaths = paths.slice(1);
        this.request({ cmd: "load", components: ["fsworkspace"], dir: rootDir, additionalPaths: addPaths }).then(function (data) {
            console.log("fsworkspace is ready");
            _this.setupDCD();
            _this.setupDScanner();
            _this.setupDlangUI();
        }, function (err) {
            atom.notifications.addError("Could not initialize fsworkspace. See console for details!");
        });
    };
    WorkspaceD.prototype.setupDScanner = function () {
        var _this = this;
        this.request({ cmd: "load", components: ["dscanner"], dir: this.projectRoot, dscannerPath: atom.config.get("atomize-d.dscannerPath") || "dscanner" }).then(function (data) {
            console.log("DScanner is ready");
            _this.emit("dscanner-ready");
            _this.dscannerReady = true;
        });
    };
    WorkspaceD.prototype.setupDCD = function () {
        var _this = this;
        if (atom.config.get("atomize-d.enableAutoComplete") === false ? false : true)
            this.request({
                cmd: "load",
                components: ["dcd"],
                dir: this.projectRoot,
                autoStart: false,
                clientPath: atom.config.get("atomize-d.dcdClientPath") || "dcd-client",
                serverPath: atom.config.get("atomize-d.dcdServerPath") || "dcd-server"
            }).then(function (data) {
                _this.startDCD();
            }, function (err) {
                atom.notifications.addError("Could not initialize DCD. See console for details!");
            });
    };
    WorkspaceD.prototype.setupDlangUI = function () {
        var _this = this;
        this.request({ cmd: "load", components: ["dlangui"] }).then(function (data) {
            console.log("DlangUI is ready");
            _this.emit("dlangui-ready");
            _this.dlanguiReady = true;
        });
    };
    WorkspaceD.prototype.ensureDCDRunning = function () {
        var _this = this;
        if (!this.dcdReady)
            return;
        if (!this.shouldRestart)
            return;
        clearTimeout(this.runCheckTimeout);
        this.runCheckTimeout = setTimeout((function () {
            console.log("Checking status...");
            _this.request({ cmd: "dcd", subcmd: "status" }).then(function (status) {
                console.log("Status:");
                console.log(status);
                if (!status.isRunning) {
                    console.error("Restarting DCD");
                    _this.startDCD();
                }
            });
        }).bind(this), 500);
    };
    WorkspaceD.prototype.startDCD = function () {
        var _this = this;
        this.request({
            cmd: "dcd",
            subcmd: "find-and-select-port",
            port: 9166
        }).then(function (data) {
            _this.request({ cmd: "dcd", subcmd: "setup-server", additionalImports: atom.config.get("atomize-d.stdlibPath") || ["/usr/include/dmd/druntime/import", "/usr/include/dmd/phobos"] }).then(function (data) {
                console.log("DCD is ready");
                _this.emit("dcd-ready");
                _this.dcdReady = true;
            }, function (err) {
                atom.notifications.addError("Could not initialize DCD. See console for details!");
            });
        }, function (err) {
            atom.notifications.addError("Could not initialize DCD. See console for details!");
        });
    };
    WorkspaceD.prototype.request = function (data) {
        var _this = this;
        var lengthBuffer = new Buffer(4);
        var idBuffer = new Buffer(4);
        var dataStr = JSON.stringify(data);
        lengthBuffer.writeInt32BE(Buffer.byteLength(dataStr, "utf8") + 4, 0);
        var reqID = this.requestNum++;
        idBuffer.writeInt32BE(reqID, 0);
        var buf = Buffer.concat([lengthBuffer, idBuffer, new Buffer(dataStr, "utf8")]);
        this.instance.stdin.write(buf);
        return new Promise(function (resolve, reject) {
            _this.once("res-" + reqID, function (error, data) {
                if (error)
                    reject(error);
                else
                    resolve(data);
            });
        });
    };
    WorkspaceD.prototype.handleData = function (chunk) {
        this.totalData = Buffer.concat([this.totalData, chunk]);
        while (this.handleChunks())
            ;
    };
    WorkspaceD.prototype.handleChunks = function () {
        if (this.totalData.length < 8)
            return false;
        var len = this.totalData.readInt32BE(0);
        if (this.totalData.length >= len + 4) {
            var id = this.totalData.readInt32BE(4);
            var buf = new Buffer(len - 4);
            this.totalData.copy(buf, 0, 8, 4 + len);
            var newBuf = new Buffer(this.totalData.length - 4 - len);
            this.totalData.copy(newBuf, 0, 4 + len);
            this.totalData = newBuf;
            var obj = JSON.parse(buf.toString());
            if (typeof obj == "object" && obj && obj["error"]) {
                this.emit("error", obj);
                this.emit("res-" + id, obj);
            }
            else
                this.emit("res-" + id, null, obj);
            return true;
        }
        return false;
    };
    return WorkspaceD;
}(events_1.EventEmitter));
exports.WorkspaceD = WorkspaceD;
function formatVersion(version) {
    return version[0] + "." + version[1] + "." + version[2];
}
//# sourceMappingURL=workspace-d.js.map