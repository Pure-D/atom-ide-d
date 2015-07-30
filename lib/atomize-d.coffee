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

  activate: (state) ->
    @dcd = new AtomizeDDCD
    @dcd.start()

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

  getProvider: ->
    @dcd

  deactivate: ->
    @subscriptions.dispose()
    @dcd = null
