{CompositeDisposable} = require 'atom'
AtomizeDDCD = require './atomize-d-dcd'

module.exports = AtomizeD =
  subscriptions: null
  dcd: null

  activate: (state) ->
    @dcd = new AtomizeDDCD

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atomize-d:toggle': => @toggle()

  deactivate: ->
    @subscriptions.dispose()
    @dcd = null

  serialize: ->


  toggle: ->
    @dcd.test()
