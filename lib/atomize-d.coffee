{CompositeDisposable} = require "atom"
AtomizeDDCD = require "./atomize-d-dcd"
DubConfig = require "./dub-config"

module.exports = AtomizeD =
  subscriptions: null
  dcd: null
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

  activate: (state) ->
    @config = new DubConfig

    @dcd = new AtomizeDDCD(@config)

    self = this

    @config.on "done", () ->
      self.dcd.start self.config

    @config.parse()

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

  getProvider: ->
    @dcd

  deactivate: ->
    @subscriptions.dispose()
    @dcd = null
