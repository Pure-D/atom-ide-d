{CompositeDisposable, Directory, File} = require "atom"
AtomizeDDCD = require "./atomize-d-dcd"
FormatterDFMT = require "./formatter-dfmt"
AtomizeDLinter = require "./atomize-d-linter"
DubConfig = require "./dub-config"
DubLinter = require "./dub-linter"
DubTestView = require "./dub-test-view"
BuildSelectorView = require "./build-selector-view"
TemplateSelectorView = require "./template-selector-view"
MultiDCD = require "./multi-d-dcd"
MultiDLinter = require "./multi-d-linter"
MultiDubLinter = require "./multi-dub-linter"
async = require "async"
path = require "path"
fs = require "fs"

module.exports = AtomizeD =
  subscriptions: null
  templateDir: null
  activatedProjects: null

  config:
    dcdClientPath:
      type: "string"
      default: "dcd-client"
    dcdServerPath:
      type: "string"
      default: "dcd-server"
    dfmtPath:
      type: "string"
      default: "dfmt"
    dImportPaths:
      type: "array"
      default: ["/usr/include/dmd/druntime/import", "/usr/include/dmd/phobos"]
      items:
        type: "string"
    dscannerPath:
      type: "string"
      default: "dscanner"
    dubPath:
      type: "string"
      default: "dub"

  dubChange: ->
    @config.parse () =>
      clearTimeout(@dubWatchTimeout)
      @dubWatchTimeout = setTimeout(=>
        @dcd.updateImports()
        @testView.update @config
      , 1000)

  activate: (state) ->
    @subscriptions = new CompositeDisposable

    @templateDir = path.join(atom.getConfigDirPath(), "d-templates");

    @activatedProjects = {}
    @subscriptions.add atom.project.onDidChangePaths (list) =>
      @projectListUpdate list
    @projectListUpdate atom.project.getPaths()

    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:generate-config': => @generateConfig()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:format-code': => @formatCode()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:regenerate-atom-build-file': => @generateBuildFile()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:select-build-target': => @selectBuildTarget()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:toggle-test-view': => @toggleTestView()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:create-project-from-template': => @createProject()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:create-template-directory': => @createTemplates(true)
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:create-empty-template-directory': => @createTemplates(false)

  projectListUpdate: (list) ->
    for projectPath in list
      continue if typeof projectPath is not "string"
      continue if @activatedProjects[projectPath]
      project = {}
      project.subscriptions = new CompositeDisposable
      project.config = new DubConfig

      project.testView = new DubTestView(projectPath)
      project.dfmt = new FormatterDFMT(projectPath)
      project.dcd = new AtomizeDDCD(project.config)

      ((project, projectPath) =>
        project.config.parse(() =>
          project.dcd.start project.config
          project.testView.update project.config

          project.subscriptions.add new Directory(project.config.getPackageDirectory()).onDidChange(@dubChange.bind(project))
          project.subscriptions.add new File(project.config.getDubJson()).onDidChange(@dubChange.bind(project))

          project.linter = new AtomizeDLinter(projectPath)
          project.dubLinter = new DubLinter(projectPath)

          console.log "Registered #{projectPath}"
        , projectPath)
      )(project, projectPath)

      @activatedProjects[projectPath] = project

  createProject: ->
    dir = new Directory(@templateDir);
    dir.exists().then (exists) =>
      return atom.notifications.addError "Template directory not found", detail: "Run atomize-d:create-template-directory to fix" unless exists
      # Magic coffeescript one liners

      dir.getEntries (err, entries) =>
        dirs = []
        names = []
        for entry in entries
          continue if entry.isFile()
          dirs.push entry
          names.push entry.getBaseName()
          new TemplateSelectorView(dirs, names)

  createTemplates: (insertPresets) ->
    fs.mkdir @templateDir, (err) =>
      return atom.notifications.addError "Template directory could not be created!", detail: err.toString() if err && err.code != 'EEXIST'
      if insertPresets
        templates = [
          require("./templates/empty"),
          require("./templates/helloworld"),
          require("./templates/vibed"),
        ]
        async.each templates, (Template, callback) =>
          new Template(@templateDir).create().then callback
        , (err) ->
          atom.notifications.addSuccess "Successfully created template directory and added #{templates.length} preset templates."
      else
        atom.notifications.addSuccess "Successfully created empty template directory."

  formatCode: ->
    editor = atom.workspace.getActivePaneItem()
    if editor?.getBuffer?()? and editor?.getGrammar?().scopeName == "source.d"
      buf = editor.getBuffer()
      pos = editor.getCursorBufferPosition()
      @getCurrentProject().dfmt.format buf.getText(), (text) =>
        buf.setText text
        editor.setCursorBufferPosition pos

  getCurrentProject: ->
    editor = atom.workspace.getActiveTextEditor()
    throw "Could not identify Project root" if not editor
    path = atom.project.relativizePath(editor.getPath())[0]
    throw "Could not identify Project root" if not path
    project = @activatedProjects[path]
    throw "Not a valid D project (or not identified)" if not project
    return project

  toggleTestView: ->
    project = @getCurrentProject()
    pane = atom.workspace.getActivePane()
    if project.testViewTab?
      if project.testViewTab.active
        pane.destroyItem project.testViewTab
      else
        pane.activateItem project.testViewTab
    else
      project.testViewTab = pane.addItem project.testView
      pane.activateItem project.testViewTab

  generateConfig: ->
    @getCurrentProject().linter.generateConfig()

  generateBuildFile: ->
    @getCurrentProject().config.generateBuildFile()

  provideAutocomplete: ->
    new MultiDCD(this)

  provideLinter: ->
    [new MultiDLinter(this), new MultiDubLinter(this)]

  selectBuildTarget: ->
    new BuildSelectorView(@getCurrentProject().config)

  deactivate: ->
    @subscriptions.dispose()
    project.subscriptions.dispose() for project in @activatedProjects
    project.dcd.stop() for project in @activatedProjects
