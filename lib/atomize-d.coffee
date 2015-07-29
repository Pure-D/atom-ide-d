AtomizeDView = require './atomize-d-view'
{CompositeDisposable} = require 'atom'

module.exports = AtomizeD =
  atomizeDView: null
  modalPanel: null
  subscriptions: null

  activate: (state) ->
    @atomizeDView = new AtomizeDView(state.atomizeDViewState)
    @modalPanel = atom.workspace.addModalPanel(item: @atomizeDView.getElement(), visible: false)

    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    @subscriptions.add atom.commands.add 'atom-workspace', 'atomize-d:toggle': => @toggle()

  deactivate: ->
    @modalPanel.destroy()
    @subscriptions.dispose()
    @atomizeDView.destroy()

  serialize: ->
    atomizeDViewState: @atomizeDView.serialize()

  toggle: ->
    console.log 'AtomizeD was toggled!'

    if @modalPanel.isVisible()
      @modalPanel.hide()
    else
      @modalPanel.show()
