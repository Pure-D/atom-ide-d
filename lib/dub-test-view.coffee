{View, $, $$} = require "atom-space-pen-views"
ChildProcess = require "child_process"

module.exports =
  class DubTestView extends View
    process: null

    @content: ->
      @div class: "atomize-d tests", =>
        @div class: "configs-container", =>
          @span class: "title", "Configurations"
          @div class: "configs", outlet: "testsList" # defines @testsList as jquery element
          @button class: "btn", click: "cancel", "Cancel Test"
        @pre class: "output-container", outlet: "output"

    serialize: ->

    initialize: ->

    update: (dub) ->
      @testsList.empty()
      configs = dub.getConfigs()
      for config in configs
        button = document.createElement("button")
        button.setAttribute("class", "icon-question untested btn btn-default")
        button.setAttribute("config", config.name)
        button.textContent = config.name
        button.onclick = (e) => @build(e)
        @testsList.append(button)
      button = document.createElement("button")
      button.setAttribute("class", "icon-question untested btn btn-default")
      button.setAttribute("config", "Default")
      button.textContent = "Default"
      button.onclick = (e) => @build(e)
      @testsList.append(button)

    build: (event) ->
      if @process?
        atom.notifications.addWarning "Already testing, press kill first!"
        return

      config = event.target.getAttribute("config")

      @clearOutput()
      @appendOutput("Starting build of #{config}...\n\n")
      command = "#{atom.config.get("atomize-d.dubPath")} test"
      if config != "Default"
        command += "--config=#{config}"
      @appendOutput("#{command}\n\n")

      args = ["test"]
      if config != "Default"
        args.push "--config=#{config}"

      try
        @process = ChildProcess.spawn atom.config.get("atomize-d.dubPath"), args, cwd: atom.project.getPaths()[0]

      catch error
        atom.notifications.addError "Failed to run #{@executablePath}",
          detail: "#{error.message}"
          dismissable: true
        @process = null
        return

      @process.stdout.on "data", (data) =>
        @appendOutput data
      @process.stderr.on "data", (data) =>
        @appendOutput data
      @process.on "close", (code, signal) =>
        if code == 0
          event.target.setAttribute("class", "icon-check success btn btn-default")
        else
          event.target.setAttribute("class", "icon-x fail btn btn-default")
        @appendOutput "\n\nTests " + (if code == 0 then "successfully " else "") + "exited with code #{code}" + (if signal? then " (#{signal})" else "") + "."
        @process = null

    cancel: ->
      if @process?
        @process.kill()
        @process = null
        @appendOutput("\n\nKilled test.")

    clearOutput: ->
      @output.text("")

    appendOutput: (msg) ->
      @output.get(0).textContent += msg

    destroy: ->

    getTitle: ->
      "atomize-d:tests"
