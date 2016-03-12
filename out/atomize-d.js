"use strict";
var workspace_d_1 = require("./workspace-d");
var atom_1 = require("atom");
var AtomizeD = (function () {
    function AtomizeD() {
        this.subscriptions = null;
        this.projects = {};
        this.config = {
            workspacedPath: {
                type: "string",
                default: "workspace-d",
                description: "Path of the workspace-d executable. Path can be omitted if in $PATH"
            },
            stdlibPath: {
                type: "array",
                items: {
                    type: "string"
                },
                default: [
                    "/usr/include/dmd/druntime/import",
                    "/usr/include/dmd/phobos"
                ],
                description: "Array of paths to phobos and D runtime for automatic inclusion for auto completion"
            },
            dcdClientPath: {
                type: "string",
                default: "dcd-client",
                description: "Path of the dcd-client executable. Path can be omitted if in $PATH"
            },
            dcdServerPath: {
                type: "string",
                default: "dcd-server",
                description: "Path of the dcd-server executable. Path can be omitted if in $PATH"
            },
            dscannerPath: {
                type: "string",
                default: "dscanner",
                description: "Path of the dscanner executable. Path can be omitted if in $PATH"
            },
            dfmtPath: {
                type: "string",
                default: "dfmt",
                description: "Path of the dfmt executable. Path can be omitted if in $PATH"
            },
            enableLinting: {
                type: "boolean",
                default: true,
                description: "If code-d should watch for file saves and report static analysis. Might interfere with other lint plugins or settings."
            },
            enableDubLinting: {
                type: "boolean",
                default: true,
                description: "If code-d should build on save to check for compile errors."
            },
            enableAutoComplete: {
                type: "boolean",
                default: true,
                description: "Start dcd-server at startup and complete using dcd-client."
            },
            neverUseDub: {
                type: "boolean",
                default: false,
                description: "If this is true then a custom workspace where you manually provide the import paths will always be used instead of dub. See d.projectImportPaths for setting import paths then. This is discouraged as it will remove most features like packages, building & compiler linting. If this is a standalone project with no external dependencies with a custom build system then this should be true."
            },
            projectImportPaths: {
                type: "array",
                items: {
                    type: "string"
                },
                default: [],
                description: "Setting for import paths in your workspace if not using dub. This will replace other paths. Its recommended to set this in your workspace settings instead of your user settings to keep it separate for each project."
            }
        };
    }
    AtomizeD.prototype.activate = function (state) {
        var _this = this;
        this.subscriptions = new atom_1.CompositeDisposable();
        console.log("Started atomize-d");
        this.subscriptions.add(atom.project.onDidChangePaths(function (list) {
            _this.projectListUpdate(list);
        }));
        this.projectListUpdate(atom.project.getPaths());
    };
    AtomizeD.prototype.projectListUpdate = function (list) {
        var _this = this;
        list.forEach(function (projectPath) {
            if (typeof projectPath !== "string")
                return;
            if (_this.projects[projectPath])
                return;
            console.log("Created new workspace-d instance on " + projectPath);
            _this.projects[projectPath] = new workspace_d_1.WorkspaceD(projectPath);
        });
    };
    AtomizeD.prototype.getCurrentProject = function () {
        var editor = atom.workspace.getActiveTextEditor();
        if (!editor)
            throw "Could not identify Project root";
        var path = atom.project.relativizePath(editor.getPath())[0];
        if (!path)
            throw "Could not identify Project root";
        var project = this.projects[path];
        if (!project)
            throw "Not a valid D project (or not identified)";
        return project;
    };
    AtomizeD.prototype.provideAutocomplete = function () {
        var _this = this;
        return {
            selector: ".source.d, .source.di",
            disableForSelector: ".source.d .comment, .source.d .string",
            inclusionPriority: 1,
            excludeLowerPriority: true,
            getSuggestions: function (options) {
                return _this.getCurrentProject().getSuggestions(options);
            }
        };
    };
    AtomizeD.prototype.provideLinter = function () {
        var _this = this;
        return {
            grammarScopes: ["source.d"],
            scope: "file",
            lintOnFly: false,
            inclusionPriority: 1,
            excludeLowerPriority: true,
            lint: function (editor) {
                return _this.getCurrentProject().lint(editor);
            }
        };
    };
    AtomizeD.prototype.deactivate = function () {
        this.subscriptions.dispose();
    };
    return AtomizeD;
}());
module.exports = new AtomizeD();
//# sourceMappingURL=atomize-d.js.map