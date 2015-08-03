{CompositeDisposable} = require "atom"
AtomizeDDCD = require "./atomize-d-dcd"
AtomizeDLinter = require "./atomize-d-linter"

module.exports = AtomizeD =
  subscriptions: null
  dcd: null
  linter: null

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

  activate: (state) ->
    @dcd = new AtomizeDDCD
    @dcd.start()

    @linter = new AtomizeDLinter

    @subscriptions = new CompositeDisposable
    @subscriptions.add atom.commands.add 'atom-workspace',
      'atomize-d:generateConfig': => @generateConfig()

  generateConfig: ->
    console.log("1")
    @linter.generateConfig()
    console.log("2")

  getProvider: ->
    @dcd

  provideLinter: ->
    @linter

  deactivate: ->
    @subscriptions.dispose()
    @dcd.stop()
