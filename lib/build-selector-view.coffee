{SelectListView} = require 'atom-space-pen-views'

module.exports =
  class BuildSelectorView extends SelectListView
    constructor: (dub) ->
      super
      @addClass('overlay from-top')
      @setItems(dub.getConfigs().map (config) -> config.name)
      @panel ?= atom.workspace.addModalPanel(item: this)
      @panel.show()
      @focusFilterEditor()

    viewForItem: (item) ->
      "<li>#{item}</li>"

    cancelled: ->
      @hide()

    confirmed: (item) ->
      global.buildName = item
      @cancel()
