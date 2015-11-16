{CompositeDisposable, Directory, File} = require "atom"
AtomizeDDCD = require "./atomize-d-dcd"
FormatterDFMT = require "./formatter-dfmt"
AtomizeDLinter = require "./atomize-d-linter"
DubConfig = require "./dub-config"
DubLinter = require "./dub-linter"
DubTestView = require "./dub-test-view"
BuildSelectorView = require "./build-selector-view"
TemplateSelectorView = require "./template-selector-view"
async = require "async"
path = require "path"
fs = require "fs"

module.exports = AtomizeD =
  subscriptions: null
  dcd: null
  dfmt: null
  linter: null
  dubLinter: null
  config: null
  testView: null
  testViewTab: null
  templateDir: null
  dubWatchTimeout: -1

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

    @config = new DubConfig
    config = @config

    @testView = new DubTestView()

    @dcd = new AtomizeDDCD(@config)
    @dfmt = new FormatterDFMT()

    @config.parse () =>
      @dcd.start @config
      @testView.update @config

      @subscriptions.add new Directory(@config.getPackageDirectory()).onDidChange(@dubChange.bind(this))
      @subscriptions.add new File(@config.getDubJson()).onDidChange(@dubChange.bind(this))
      console.log @config.getDubJson()

    @linter = new AtomizeDLinter
    @dubLinter = new DubLinter

    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:generate-config': => @generateConfig()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:format-code': => @formatCode()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:regenerate-atom-build-file': => @generateBuildFile()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:select-build-target': => new BuildSelectorView(config)
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:toggle-test-view': => @toggleTestView()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:create-project-from-template': => @createProject()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:create-template-directory': => @createTemplates(true)
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:create-empty-template-directory': => @createTemplates(false)

  toggleTestView: ->
    pane = atom.workspace.getActivePane()
    if @testViewTab?
      if @testViewTab.active
        pane.destroyItem @testViewTab
      else
        pane.activateItem @testViewTab
    else
      @testViewTab = pane.addItem @testView
      pane.activateItem @testViewTab

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

        console.log names

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
      @dfmt.format buf.getText(), (text) =>
        buf.setText text
        editor.setCursorBufferPosition pos

  generateConfig: ->
    @linter.generateConfig()

  generateBuildFile: ->
    @config.generateBuildFile()

  provideAutocomplete: ->
    @dcd

  provideLinter: ->
    [@linter, @dubLinter]

  deactivate: ->
    @subscriptions.dispose()
    @dcd.stop()
