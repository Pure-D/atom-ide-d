{CompositeDisposable} = require 'atom'
AtomizeDDCD = require './atomize-d-dcd'

module.exports = AtomizeD =
  subscriptions: null
  dcd: null

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

  activate: (state) ->
    @dcd = new AtomizeDDCD
    @dcd.start()

    @subscriptions = new CompositeDisposable

  getProvider: ->
    @dcd

  deactivate: ->
    @subscriptions.dispose()
    @dcd.stop()
