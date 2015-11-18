{CompositeDisposable, Directory, File} = require "atom"
AtomizeDDCD = require "./atomize-d-dcd"
FormatterDFMT = require "./formatter-dfmt"
AtomizeDLinter = require "./atomize-d-linter"
DubConfig = require "./dub-config"
DubLinter = require "./dub-linter"
DubBuildView = require "./dub-build-view"
BuildSelectorView = require "./build-selector-view"
TemplateSelectorView = require "./template-selector-view"
MultiDCD = require "./multi-d-dcd"
MultiDLinter = require "./multi-d-linter"
MultiDubLinter = require "./multi-dub-linter"
ResultsView = require "./results-view"
DocumentationView = require "./documentation-view"
async = require "async"
path = require "path"
fs = require "fs"

module.exports = AtomizeD =
  subscriptions: null
  templateDir: null
  activatedProjects: null
  resultsView: null
  docsView: null

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
        @buildView.update @config
      , 1000)

  activate: (state) ->
    @subscriptions = new CompositeDisposable

    @templateDir = path.join(atom.getConfigDirPath(), "d-templates");

    @activatedProjects = {}
    @subscriptions.add atom.project.onDidChangePaths (list) =>
      @projectListUpdate list
    @projectListUpdate atom.project.getPaths()

    @subscriptions.add atom.commands.add "atom-workspace",
      "core:cancel": => @createResultsView().detach()
      "core:close": => @createResultsView().detach()
    @subscriptions.add atom.commands.add "atom-workspace",
      "core:cancel": => @createDocsView().detach()
      "core:close": => @createDocsView().detach()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:lookup-documentation": => @showDocumentation()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:goto-declaration": => @gotoDeclaration()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:search-for-selected-symbol": => @searchSelectedSymbol()
    #@subscriptions.add atom.commands.add "atom-workspace",
    #  "atomize-d:search-for-symbol": => @searchSymbol()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:generate-linter-config": => @generateLinterConfig()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:generate-dfmt-config": => @generateDfmtConfig()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:format-code": => @formatCode()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:regenerate-atom-build-file": => @generateBuildFile()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:select-build-target": => @selectBuildTarget()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:toggle-build-view": => @toggleBuildView()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:create-project-from-template": => @createProject()
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:create-template-directory": => @createTemplates(true)
    @subscriptions.add atom.commands.add "atom-workspace",
      "atomize-d:create-empty-template-directory": => @createTemplates(false)

  projectListUpdate: (list) ->
    for projectPath in list
      continue if typeof projectPath is not "string"
      continue if @activatedProjects[projectPath]
      project = {}
      project.subscriptions = new CompositeDisposable
      project.config = new DubConfig

      project.buildView = new DubBuildView(projectPath)
      project.dfmt = new FormatterDFMT(projectPath)
      project.dcd = new AtomizeDDCD(project.config)

      ((project, projectPath) =>
        project.config.parse(() =>
          project.dcd.start project.config
          project.buildView.update project.config

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
      return atom.notifications.addError "Template directory could not be created!", detail: err.toString() if err && err.code != "EEXIST"
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
      @getCurrentProject().dfmt.format editor, buf.getText(), (text) =>
        buf.setText text
        editor.setCursorBufferPosition pos

  isDEditor: ->
    editor = atom.workspace.getActivePaneItem()
    return editor and editor.getGrammar().scopeName == "source.d"

  getCurrentProject: ->
    editor = atom.workspace.getActiveTextEditor()
    throw "Could not identify Project root" if not editor
    path = atom.project.relativizePath(editor.getPath())[0]
    throw "Could not identify Project root" if not path
    project = @activatedProjects[path]
    throw "Not a valid D project (or not identified)" if not project
    return project

  toggleBuildView: ->
    project = @getCurrentProject()
    pane = atom.workspace.getActivePane()
    if project.buildViewTab?
      if project.buildViewTab.active
        pane.destroyItem project.buildViewTab
      else
        pane.activateItem project.buildViewTab
    else
      project.buildViewTab = pane.addItem project.buildView
      pane.activateItem project.buildViewTab

  generateLinterConfig: ->
    @getCurrentProject().linter.generateConfig()

  generateDfmtConfig: ->
    @getCurrentProject().dfmt.generateConfig()

  generateBuildFile: ->
    @getCurrentProject().config.generateBuildFile()

  provideAutocomplete: ->
    new MultiDCD(this)

  provideLinter: ->
    [new MultiDLinter(this), new MultiDubLinter(this)]

  provideHyperclick: ->
    new MultiDCD(this)

  selectBuildTarget: ->
    new BuildSelectorView(@getCurrentProject().config)

  showDocumentation: ->
    return if not @isDEditor()
    editor = atom.workspace.getActiveTextEditor()
    return if not editor
    @getCurrentProject().dcd.getDocumentation(editor).then (docs) =>
      if docs.length == 0
        atom.notifications.addError("No documentation found!")
        return
      @createDocsView().showDocs(docs)

  gotoDeclaration: ->
    return if not @isDEditor()
    editor = atom.workspace.getActiveTextEditor()
    return if not editor
    @getCurrentProject().dcd.getDeclaration(editor).then (result) ->
      if result.length == 0 or result.toLowerCase() == "not found"
        atom.notifications.addError("Could not find declaration. Try symbol search instead!")
        return
      splits = result.split("\t")
      byteOff = parseInt(splits[1])
      file = splits[0]
      if file == "stdin"
        editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(byteOff))
      else
        atom.workspace.open(file)
        didOpenListener = atom.workspace.onDidOpen (event) ->
          editor = atom.workspace.getActiveTextEditor()
          if editor and editor.getPath() == splits[0]
            editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(byteOff))
            didOpenListener.dispose()

  searchSelectedSymbol: ->
    return if not @isDEditor()
    editor = atom.workspace.getActiveTextEditor()
    return if not editor
    if editor.getSelectedText().length == 0
      editor.selectWordsContainingCursors()
    @searchSymbol(editor.getSelectedText())

  searchSymbol: (symbol) ->
    return if not @isDEditor()
    @getCurrentProject().dcd.searchSymbol(symbol).then (result) =>
      if result.length == 0 or result[0].length == 0
        atom.notifications.addError("No symbol called '#{symbol}' found!")
        return
      @createResultsView().showResults(symbol, result)

  createResultsView: ->
    unless @resultsView?
      @resultsView = new ResultsView()
    @resultsView

  createDocsView: ->
    unless @docsView?
      @docsView = new DocumentationView()
    @docsView

  deactivate: ->
    @subscriptions.dispose()
    project.subscriptions.dispose() for project in @activatedProjects
    project.dcd.stop() for project in @activatedProjects
