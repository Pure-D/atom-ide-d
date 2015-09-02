{CompositeDisposable, Directory} = require "atom"
AtomizeDDCD = require "./atomize-d-dcd"
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
  linter: null
  dubLinter: null
  config: null
  testView: null
  testViewTab: null
  templateDir: null

  config:
    dcdClientPath:
      type: "string"
      default: "dcd-client"
    dcdServerPath:
      type: "string"
      default: "dcd-server"
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

  activate: (state) ->
    @templateDir = path.join(atom.getConfigDirPath(), "d-templates");

    @config = new DubConfig
    config = @config

    @testView = new DubTestView()

    @dcd = new AtomizeDDCD(@config)

    @config.parse () =>
      @dcd.start @config
      @testView.update @config

    @linter = new AtomizeDLinter
    @dubLinter = new DubLinter

    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:generate-config': => @generateConfig()
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
