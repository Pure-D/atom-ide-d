{SelectListView} = require "atom-space-pen-views"
{Directory} = require "atom"
remote = require "remote"
dialog = remote.require "dialog"
ncp = require "ncp"
replace = require "replace"

module.exports =
  class TemplateSelectorView extends SelectListView
    dirs: null

    constructor: (dirs, names) ->
      super
      @dirs = dirs
      @addClass('overlay from-top')
      @setItems(names)
      @panel ?= atom.workspace.addModalPanel(item: this)
      @panel.show()
      @focusFilterEditor()

    viewForItem: (item) ->
      "<li>#{item}</li>"

    cancelled: ->
      @hide()

    confirmed: (item) ->
      dir = (dir for dir in @dirs when dir.getBaseName() == item)[0]

      @hide()

      output = dialog.showOpenDialog
        title: "Select Project Folder"
        properties:["openDirectory"]

      if output? # User has choosen something
        console.log "Copying '#{dir.getPath()}' to '#{output}'"
        ncp.ncp dir.getPath().toString(), output.toString(), (err) ->
          return atom.notifications.addError "Could not create project!", detail: err if err
          atom.open pathsToOpen: output
