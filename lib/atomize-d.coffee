{CompositeDisposable} = require "atom"
AtomizeDDCD = require "./atomize-d-dcd"
AtomizeDLinter = require "./atomize-d-linter"
DubConfig = require "./dub-config"
DubLinter = require "./dub-linter"
BuildSelectorView = require "./build-selector-view"

module.exports = AtomizeD =
  subscriptions: null
  dcd: null
  linter: null
  dubLinter: null
  config: null

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
    @config = new DubConfig
    config = @config

    @dcd = new AtomizeDDCD(@config)

    @config.parse () =>
      @dcd.start @config

    @linter = new AtomizeDLinter
    @dubLinter = new DubLinter

    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:generate-config': => @generateConfig()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:regenerate-atom-build-file': => @generateBuildFile()
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:select-build-target': => new BuildSelectorView(config)

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
