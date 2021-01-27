import { WorkspaceD } from "./workspace-d"
import { CompositeDisposable } from "atom"

class AtomizeD {
  subscriptions: CompositeDisposable = null
  projects: { [key: string]: WorkspaceD } = {}

  config = {
    workspacedPath: {
      type: "string",
      default: "workspace-d",
      description: "Path of the workspace-d executable. Path can be omitted if in $PATH",
    },
    stdlibPath: {
      type: "array",
      items: {
        type: "string",
      },
      default: ["/usr/include/dmd/druntime/import", "/usr/include/dmd/phobos"],
      description: "Array of paths to phobos and D runtime for automatic inclusion for auto completion",
    },
    dcdClientPath: {
      type: "string",
      default: "dcd-client",
      description: "Path of the dcd-client executable. Path can be omitted if in $PATH",
    },
    dcdServerPath: {
      type: "string",
      default: "dcd-server",
      description: "Path of the dcd-server executable. Path can be omitted if in $PATH",
    },
    dscannerPath: {
      type: "string",
      default: "dscanner",
      description: "Path of the dscanner executable. Path can be omitted if in $PATH",
    },
    dfmtPath: {
      type: "string",
      default: "dfmt",
      description: "Path of the dfmt executable. Path can be omitted if in $PATH",
    },
    enableLinting: {
      type: "boolean",
      default: true,
      description:
        "If code-d should watch for file saves and report static analysis. Might interfere with other lint plugins or settings.",
    },
    enableDubLinting: {
      type: "boolean",
      default: true,
      description: "If code-d should build on save to check for compile errors.",
    },
    enableAutoComplete: {
      type: "boolean",
      default: true,
      description: "Start dcd-server at startup and complete using dcd-client.",
    },
    neverUseDub: {
      type: "boolean",
      default: false,
      description:
        "If this is true then a custom workspace where you manually provide the import paths will always be used instead of dub. See d.projectImportPaths for setting import paths then. This is discouraged as it will remove most features like packages, building & compiler linting. If this is a standalone project with no external dependencies with a custom build system then this should be true.",
    },
    projectImportPaths: {
      type: "array",
      items: {
        type: "string",
      },
      default: [],
      description:
        "Setting for import paths in your workspace if not using dub. This will replace other paths. Its recommended to set this in your workspace settings instead of your user settings to keep it separate for each project.",
    },
  }

  activate(state) {
    this.subscriptions = new CompositeDisposable()

    console.log("Started atomize-d")
    this.subscriptions.add(
      atom.project.onDidChangePaths((list) => {
        this.projectListUpdate(list)
      })
    )
    this.projectListUpdate(atom.project.getPaths())
  }

  projectListUpdate(list) {
    list.forEach((projectPath) => {
      if (typeof projectPath !== "string") return
      if (this.projects[projectPath]) return
      console.log("Created new workspace-d instance on " + projectPath)
      this.projects[projectPath] = new WorkspaceD(projectPath)
    })
  }

  getCurrentProject() {
    let editor = atom.workspace.getActiveTextEditor()
    if (!editor) throw "Could not identify Project root"
    let path = atom.project.relativizePath(editor.getPath())[0]
    if (!path) throw "Could not identify Project root"
    let project = this.projects[path]
    if (!project) throw "Not a valid D project (or not identified)"
    return project
  }

  provideAutocomplete() {
    return {
      selector: ".source.d, .source.di",
      disableForSelector: ".source.d .comment, .source.d .string",
      inclusionPriority: 1,
      excludeLowerPriority: true,
      getSuggestions: (options) => {
        return this.getCurrentProject().getSuggestions(options)
      },
    }
  }

  provideLinter() {
    return {
      grammarScopes: ["source.d"],
      scope: "file",
      lintOnFly: false,
      inclusionPriority: 1,
      excludeLowerPriority: true,
      lint: (editor) => {
        return this.getCurrentProject().lint(editor)
      },
    }
  }

  deactivate() {
    this.subscriptions.dispose()
  }
}

module.exports = new AtomizeD()
