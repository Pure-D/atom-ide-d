import * as ChildProcess from "child_process"
import * as path from "path"
import * as fs from "fs"
import { EventEmitter } from "events"
import type { TextEditor } from "atom"

const TARGET_VERSION = [2, 6, 0]

interface SuggestionRequest {
  editor: TextEditor
  bufferPosition: [number, number]
  scopeDescriptor: string[]
}

interface Suggestion {
  text?: string
  snippet?: string
  displayText?: string
  replacementPrefix?: string
  type?: string
  leftLabel?: string
  leftLabelHTML?: string
  rightLabel?: string
  rightLabelHTML?: string
  className?: string
  iconHTML?: string
  description?: string
  descriptionMoreURL?: string
}

interface Trace {
  type: string
  text?: string
  html?: string
  name?: string // Only specify this if you want the name to be something other than your linterProvider.name
  filePath: string
  range?: [[number, number], [number, number]]
  class?: string
}

interface LintResult {
  type: string
  text?: string
  html?: string
  name?: string
  filePath?: string
  range?: [[number, number], [number, number]]
  trace?: Array<Trace>
}

interface Thenable<T> {
  then<TP>(successCB?: Function, errorCB?: Function): Thenable<TP>
}

export class WorkspaceD extends EventEmitter {
  constructor(public projectRoot: string) {
    super()
    let self = this
    this.on("error", function (err) {
      console.error(err)
      if (this.shouldRestart) self.ensureDCDRunning()
    })
    this.startWorkspaceD()
  }

  startWorkspaceD() {
    if (!this.shouldRestart) return
    let self = this
    this.workspaced = true
    let path = atom.config.get("atomize-d.workspacedPath") || "workspace-d"
    console.log("spawning " + path + " with cwd " + this.projectRoot)
    this.instance = ChildProcess.spawn(path, [], { cwd: this.projectRoot })
    this.totalData = new Buffer(0)
    this.instance.stderr.on("data", function (chunk) {
      console.log("WorkspaceD Debug: " + chunk)
      if (chunk.toString().indexOf("DCD-Server stopped with code") != -1) self.ensureDCDRunning()
    })
    this.instance.stdout.on("data", function (chunk) {
      self.handleData.call(self, chunk)
    })
    this.instance.on("error", function (err) {
      console.log("WorkspaceD ended with an error:")
      console.log(err)
      if (err && (<any>err).code == "ENOENT") {
        atom.notifications.addError(
          "'" +
            path +
            "' is not a valid executable. Please check your user settings and make sure workspace-d is installed!"
        )
        self.workspaced = false
      }
    })
    this.instance.on("exit", function (code) {
      console.log("WorkspaceD ended with code " + code)
      atom.notifications.addError("Workspace-D crashed. Please kill dcd-server if neccessary!")
      self.workspaced = false
    })
    this.checkVersion()
  }

  getSuggestions(options: SuggestionRequest): Thenable<Suggestion[]> {
    let self = this
    console.log("provideCompletionItems")
    return new Promise((resolve, reject) => {
      if (!self.dcdReady) return resolve([])
      let offset = options.editor.getBuffer().characterIndexForPosition(options.editor.getSelectedBufferRange().start)
      self
        .request({ cmd: "dcd", subcmd: "list-completion", code: options.editor.getBuffer().getText(), pos: offset })
        .then((completions) => {
          if (completions.type == "identifiers") {
            let items = []
            if (completions.identifiers && completions.identifiers.length)
              completions.identifiers.forEach((element) => {
                let item: Suggestion = {
                  text: element.identifier,
                  type: self.types[element.type] || "unknown",
                }
                items.push(item)
              })
            console.log("resolve identifiers")
            console.log(items)
            resolve(items)
          } else if (completions.type == "calltips") {
            let items = []
            if (completions.calltips && completions.calltips.length)
              completions.calltips.forEach((element) => {
                let item: Suggestion = {
                  text: element,
                }
                items.push(item)
              })
            console.log("resolve calltips")
            console.log(items)
            resolve(items)
          } else {
            console.log("resolve null")
            resolve([])
          }
        }, reject)
    })
  }

  /*provideWorkspaceSymbols(query: string, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        let self = this;
        console.log("provideWorkspaceSymbols");
        return new Promise((resolve, reject) => {
            if (!self.dcdReady)
                return resolve([]);
            self.request({ cmd: "dcd", subcmd: "search-symbol", query: query }).then((symbols) => {
                let found = [];
                if (symbols && symbols.length)
                    symbols.forEach(element => {
                        let type = self.types[element.type] || vscode.CompletionItemKind.Text;
                        let range = new vscode.Range(1, 1, 1, 1);
                        let uri = vscode.Uri.file(element.file);
                        vscode.workspace.textDocuments.forEach(doc => {
                            if (doc.uri.fsPath == uri.fsPath) {
                                range = doc.getWordRangeAtPosition(doc.positionAt(element.position));
                            }
                        });
                        let entry = new vscode.SymbolInformation(query, type, range, uri);
                        if (entry && range)
                            found.push(entry);
                    });
                console.log("resolve");
                console.log(found);
                resolve(found);
            }, reject);
        });
    }

    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): Thenable<vscode.SymbolInformation[]> {
        let self = this;
        console.log("provideDocumentSymbols");
        return new Promise((resolve, reject) => {
            if (!self.dscannerReady)
                return resolve([]);
            self.request({ cmd: "dscanner", subcmd: "list-definitions", file: document.uri.fsPath }).then(definitions => {
                let informations: vscode.SymbolInformation[] = [];
                if (definitions && definitions.length)
                    definitions.forEach(element => {
                        let container = undefined;
                        let range = new vscode.Range(element.line - 1, 0, element.line - 1, 0);
                        let type = self.scanTypes[element.type];
                        if (element.type == "f" && element.name == "this")
                            type = vscode.SymbolKind.Constructor;
                        if (element.attributes.struct)
                            container = element.attributes.struct;
                        if (element.attributes.class)
                            container = element.attributes.class;
                        if (element.attributes.enum)
                            container = element.attributes.enum;
                        if (element.attributes.union)
                            container = element.attributes.union;
                        informations.push(new vscode.SymbolInformation(element.name, type, range, document.uri, container));
                    });
                console.log("resolve");
                console.log(informations);
                resolve(informations);
            }, reject);
        });
    }

    provideHover(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Hover> {
        let self = this;
        console.log("provideHover");
        return new Promise((resolve, reject) => {
            if (!self.dcdReady)
                return resolve(null);
            let offset = document.offsetAt(position);
            self.request({ cmd: "dcd", subcmd: "get-documentation", code: document.getText(), pos: offset }).then((documentation) => {
                if (!documentation || documentation.trim().length == 0) {
                    console.log("resolve null");
                    return resolve(null);
                }
                console.log("resolve");
                console.log(new vscode.Hover({ language: "ddoc", value: documentation.trim() }));
                resolve(new vscode.Hover({ language: "ddoc", value: documentation.trim() }));
            }, reject);
        });
    }

    provideDefinition(document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken): Thenable<vscode.Definition> {
        let self = this;
        console.log("provideDefinition");
        return new Promise((resolve, reject) => {
            if (!self.dcdReady)
                return resolve(null);
            let offset = document.offsetAt(position);
            self.request({ cmd: "dcd", subcmd: "find-declaration", code: document.getText(), pos: offset }).then((declaration) => {
                if (!declaration) {
                    console.log("Resolve null");
                    return resolve(null);
                }
                let range = new vscode.Range(1, 1, 1, 1);
                let uri = document.uri;
                if (declaration[0] != "stdin")
                    uri = vscode.Uri.file(declaration[0]);
                vscode.workspace.textDocuments.forEach(doc => {
                    if (doc.uri.fsPath == uri.fsPath) {
                        range = doc.getWordRangeAtPosition(doc.positionAt(declaration[1]));
                    }
                });
                console.log("resolve");
                console.log(new vscode.Location(uri, range));
                resolve(new vscode.Location(uri, range));
            }, reject);
        });
    }*/

  lint(document: TextEditor): Thenable<LintResult[]> {
    let self = this
    console.log("lint")
    return new Promise((resolve, reject) => {
      if (!self.dscannerReady) return resolve([])
      let useProjectIni = fs.existsSync(path.join(self.projectRoot, "dscanner.ini"))
      self
        .request({
          cmd: "dscanner",
          subcmd: "lint",
          file: document.getPath(),
          ini: useProjectIni ? path.join(self.projectRoot, "dscanner.ini") : "",
        })
        .then((issues) => {
          let diagnostics = []
          if (issues && issues.length)
            issues.forEach((element) => {
              let range = [
                [Math.max(0, element.line - 1), element.column - 1],
                [Math.max(0, element.line - 1), element.column + 300],
              ]
              console.log(range)
              diagnostics.push({
                type: this.lintTypes[element.type] || element.type,
                text: element.description,
                range: range,
                filePath: document.getPath(),
              })
            })
          console.log("Resolve")
          console.log(diagnostics)
          resolve(diagnostics)
        }, reject)
    })
  }

  /*dubBuild(document: vscode.TextDocument): Thenable<[vscode.Uri, vscode.Diagnostic[]][]> {
        console.log("dubBuild");
        return new Promise((resolve, reject) => {
            if (!this.dubReady)
                return resolve([]);
            this.request({ cmd: "dub", subcmd: "build" }).then((issues: { line: number, column: number, file: string, type: number, text: string }[]) => {
                let diagnostics: [vscode.Uri, vscode.Diagnostic[]][] = [];
                if (issues && issues.length)
                    issues.forEach(element => {
                        let range = new vscode.Range(Math.max(0, element.line - 1), element.column - 1, Math.max(0, element.line - 1), element.column + 500);
                        let uri = vscode.Uri.file(path.join(this.projectRoot, element.file));
                        let error = new vscode.Diagnostic(range, element.text, this.mapDubLintType(element.type));
                        let found = false;
                        diagnostics.forEach(element => {
                            if (element[0].fsPath == uri.fsPath) {
                                found = true;
                                element[1].push(error);
                            }
                        });
                        if (!found)
                            diagnostics.push([uri, [error]]);
                    });
                console.log("Resolve");
                console.log(diagnostics);
                resolve(diagnostics);
            });
        });
    }*/

  dispose() {
    this.shouldRestart = false
    console.log("Disposing")
    let to = setTimeout(this.instance.kill, 150)
    this.request({ cmd: "unload", components: "*" }).then((data) => {
      console.log("Unloaded")
      this.instance.kill()
      clearTimeout(to)
    })
  }

  listConfigurations(): Thenable<string[]> {
    return this.request({ cmd: "dub", subcmd: "list:configurations" })
  }

  getConfiguration(): Thenable<string> {
    return this.request({ cmd: "dub", subcmd: "get:configuration" })
  }

  setConfiguration(config: string) {
    this.request({ cmd: "dub", subcmd: "set:configuration", configuration: config }).then((success) => {
      if (success) {
        this.listImports().then(console.log)
        this.emit("configuration-change", config)
      } else atom.notifications.addInfo("No import paths available for this project. Autocompletion could be broken!")
    })
  }

  listBuildTypes(): Thenable<string[]> {
    return this.request({ cmd: "dub", subcmd: "list:build-types" })
  }

  getBuildType(): Thenable<string> {
    return this.request({ cmd: "dub", subcmd: "get:build-type" })
  }

  setBuildType(config: string) {
    this.request({ cmd: "dub", subcmd: "set:build-type", "build-type": config }).then((success) => {
      if (success) {
        this.request({ cmd: "dub", subcmd: "list:import" }).then(console.log)
        this.emit("build-type-change", config)
      } else
        atom.notifications.addInfo("No import paths available for this build type. Autocompletion could be broken!")
    })
  }

  killServer(): Thenable<any> {
    if (!this.dcdReady)
      return new Promise((resolve, reject) => {
        reject()
      })
    return this.request({ cmd: "dcd", subcmd: "kill-server" })
  }

  restartServer(): Thenable<any> {
    if (!this.dcdReady)
      return new Promise((resolve, reject) => {
        reject()
      })
    return this.request({ cmd: "dcd", subcmd: "restart-server" })
  }

  updateImports(): Thenable<boolean> {
    return new Promise((resolve, reject) => {
      if (!this.dubReady) reject()
      this.request({ cmd: "dub", subcmd: "update" }).then((success) => {
        if (!success) return resolve(success)
        if (this.dcdReady) {
          this.request({ cmd: "dcd", subcmd: "refresh-imports" }).then(() => {
            resolve(true)
            this.listImports().then(console.log)
          })
        } else {
          atom.notifications.addWarning("Could not update DCD. Please restart DCD if its not working properly")
          resolve(true)
        }
      })
    })
  }

  listImports(): Thenable<string[]> {
    if (!this.dubReady)
      return new Promise((resolve, reject) => {
        resolve([])
      })
    return this.request({ cmd: "dub", subcmd: "list:import" })
  }

  /*getDlangUI(): DlangUIHandler {
        return new DlangUIHandler(this);
    }*/

  public checkVersion() {
    this.request({ cmd: "version" }).then(
      (version) => {
        if (version.major < TARGET_VERSION[0])
          return atom.notifications.addError(
            "workspace-d is outdated! Please update to continue using this plugin. (target=" +
              formatVersion(TARGET_VERSION) +
              ", workspaced=" +
              formatVersion([version.major, version.minor, version.patch]) +
              ")"
          )
        if (version.major == TARGET_VERSION[0] && version.minor < TARGET_VERSION[1])
          atom.notifications.addWarning(
            "workspace-d might be outdated! Please update if things are not working as expected. (target=" +
              formatVersion(TARGET_VERSION) +
              ", workspaced=" +
              formatVersion([version.major, version.minor, version.patch]) +
              ")"
          )
        if (
          version.major == TARGET_VERSION[0] &&
          version.minor == TARGET_VERSION[1] &&
          version.path < TARGET_VERSION[2]
        )
          atom.notifications.addInfo(
            "workspace-d has a new optional update! Please update before submitting a bug report. (target=" +
              formatVersion(TARGET_VERSION) +
              ", workspaced=" +
              formatVersion([version.major, version.minor, version.patch]) +
              ")"
          )
        this.setupDub()
      },
      () => {
        atom.notifications.addError("Could not identify workspace-d version. Please update workspace-d!")
      }
    )
  }

  private dubPackageDescriptorExists() {
    return (
      fs.existsSync(path.join(this.projectRoot, "dub.json")) ||
      fs.existsSync(path.join(this.projectRoot, "dub.sdl")) ||
      fs.existsSync(path.join(this.projectRoot, "package.json"))
    )
  }

  public setupDub() {
    if (atom.config.get("atomize-d.neverUseDub")) {
      this.setupCustomWorkspace()
      return
    }
    if (this.dubPackageDescriptorExists()) {
      this.request({ cmd: "load", components: ["dub"], dir: this.projectRoot }).then(
        (data) => {
          console.log("dub is ready")
          this.dubReady = true
          this.emit("dub-ready")
          this.setupDCD()
          this.setupDScanner()
          this.setupDlangUI()
          this.listConfigurations().then((configs) => {
            if (configs.length == 0) {
              atom.notifications.addInfo(
                "No configurations available for this project. Autocompletion could be broken!"
              )
            } else {
              this.setConfiguration(configs[0])
            }
          })
        },
        (err) => {
          atom.notifications.addWarning("Could not initialize dub. Falling back to limited functionality!")
          this.setupCustomWorkspace()
        }
      )
    } else this.setupCustomWorkspace()
  }

  private getPossibleSourceRoots(): string[] {
    let confPaths = atom.config.get("atomize-d.projectImportPaths") || []
    if (confPaths && confPaths.length) {
      let roots = []
      confPaths.forEach((p) => {
        if (path.isAbsolute(p)) roots.push(p)
        else roots.push(path.join(this.projectRoot, p))
      })
      return roots
    }
    if (fs.existsSync(path.join(this.projectRoot, "source"))) return [path.join(this.projectRoot, "source")]
    if (fs.existsSync(path.join(this.projectRoot, "src"))) return [path.join(this.projectRoot, "src")]
    return [this.projectRoot]
  }

  public setupCustomWorkspace() {
    let paths = this.getPossibleSourceRoots()
    let rootDir = paths[0]
    let addPaths = []
    if (paths.length > 1) addPaths = paths.slice(1)
    this.request({ cmd: "load", components: ["fsworkspace"], dir: rootDir, additionalPaths: addPaths }).then(
      (data) => {
        console.log("fsworkspace is ready")
        this.setupDCD()
        this.setupDScanner()
        this.setupDlangUI()
      },
      (err) => {
        atom.notifications.addError("Could not initialize fsworkspace. See console for details!")
      }
    )
  }

  public setupDScanner() {
    this.request({
      cmd: "load",
      components: ["dscanner"],
      dir: this.projectRoot,
      dscannerPath: atom.config.get("atomize-d.dscannerPath") || "dscanner",
    }).then((data) => {
      console.log("DScanner is ready")
      this.emit("dscanner-ready")
      this.dscannerReady = true
    })
  }

  public setupDCD() {
    if (atom.config.get("atomize-d.enableAutoComplete") === false ? false : true)
      this.request({
        cmd: "load",
        components: ["dcd"],
        dir: this.projectRoot,
        autoStart: false,
        clientPath: atom.config.get("atomize-d.dcdClientPath") || "dcd-client",
        serverPath: atom.config.get("atomize-d.dcdServerPath") || "dcd-server",
      }).then(
        (data) => {
          this.startDCD()
        },
        (err) => {
          atom.notifications.addError("Could not initialize DCD. See console for details!")
        }
      )
  }

  public setupDlangUI() {
    this.request({ cmd: "load", components: ["dlangui"] }).then((data) => {
      console.log("DlangUI is ready")
      this.emit("dlangui-ready")
      this.dlanguiReady = true
    })
  }

  public ensureDCDRunning() {
    if (!this.dcdReady) return
    if (!this.shouldRestart) return
    clearTimeout(this.runCheckTimeout)
    this.runCheckTimeout = setTimeout(
      (() => {
        console.log("Checking status...")
        this.request({ cmd: "dcd", subcmd: "status" }).then((status) => {
          console.log("Status:")
          console.log(status)
          if (!status.isRunning) {
            console.error("Restarting DCD")
            this.startDCD()
          }
        })
      }).bind(this),
      500
    )
  }

  public startDCD() {
    this.request({
      cmd: "dcd",
      subcmd: "find-and-select-port",
      port: 9166,
    }).then(
      (data) => {
        this.request({
          cmd: "dcd",
          subcmd: "setup-server",
          additionalImports: atom.config.get("atomize-d.stdlibPath") || [
            "/usr/include/dmd/druntime/import",
            "/usr/include/dmd/phobos",
          ],
        }).then(
          (data) => {
            console.log("DCD is ready")
            this.emit("dcd-ready")
            this.dcdReady = true
          },
          (err) => {
            atom.notifications.addError("Could not initialize DCD. See console for details!")
          }
        )
      },
      (err) => {
        atom.notifications.addError("Could not initialize DCD. See console for details!")
      }
    )
  }

  public request(data): Thenable<any> {
    let lengthBuffer = new Buffer(4)
    let idBuffer = new Buffer(4)
    let dataStr = JSON.stringify(data)
    lengthBuffer.writeInt32BE(Buffer.byteLength(dataStr, "utf8") + 4, 0)
    let reqID = this.requestNum++
    idBuffer.writeInt32BE(reqID, 0)
    let buf = Buffer.concat([lengthBuffer, idBuffer, new Buffer(dataStr, "utf8")])
    this.instance.stdin.write(buf)
    return new Promise((resolve, reject) => {
      this.once("res-" + reqID, function (error, data) {
        if (error) reject(error)
        else resolve(data)
      })
    })
  }

  public handleData(chunk) {
    this.totalData = Buffer.concat([this.totalData, chunk])
    while (this.handleChunks());
  }

  public handleChunks() {
    if (this.totalData.length < 8) return false
    let len = this.totalData.readInt32BE(0)
    if (this.totalData.length >= len + 4) {
      let id = this.totalData.readInt32BE(4)
      let buf = new Buffer(len - 4)
      this.totalData.copy(buf, 0, 8, 4 + len)
      let newBuf = new Buffer(this.totalData.length - 4 - len)
      this.totalData.copy(newBuf, 0, 4 + len)
      this.totalData = newBuf
      let obj = JSON.parse(buf.toString())
      if (typeof obj == "object" && obj && obj["error"]) {
        this.emit("error", obj)
        this.emit("res-" + id, obj)
      } else this.emit("res-" + id, null, obj)
      return true
    }
    return false
  }

  public runCheckTimeout: NodeJS.Timeout = -1
  public workspaced: boolean = true
  public dubReady: boolean = false
  public dcdReady: boolean = false
  public dlanguiReady: boolean = false
  public dscannerReady: boolean = false
  public shouldRestart: boolean = true
  public totalData: Buffer
  public requestNum = 0
  public instance: ChildProcess.ChildProcess
  /*
    public scanTypes = {
        g: vscode.SymbolKind.Enum,
        e: vscode.SymbolKind.Field,
        v: vscode.SymbolKind.Variable,
        i: vscode.SymbolKind.Interface,
        c: vscode.SymbolKind.Class,
        s: vscode.SymbolKind.Class,
        f: vscode.SymbolKind.Function,
        u: vscode.SymbolKind.Class,
        T: vscode.SymbolKind.Property,
        a: vscode.SymbolKind.Field
    };*/
  public lintTypes = {
    warn: "Warning",
    error: "Error",
  }
  public types = {
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
  }
}

function formatVersion(version: number[]): string {
  return version[0] + "." + version[1] + "." + version[2]
}
