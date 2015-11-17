{View, $, $$} = require "atom-space-pen-views"
ChildProcess = require "child_process"
path = require "path"

errorFormat = /^(.*?)\((\d+)(?:,(\d+))?\):/;

module.exports =
  class DubTestView extends View
    process: null
    projectRoot: null

    constructor: (projectRoot) ->
      super()
      @projectRoot = projectRoot

    @content: ->
      @div class: "atomize-d tests", =>
        @div class: "configs-container", =>
          @span class: "title", "Configurations"
          @div class: "configs", outlet: "testsList" # defines @testsList as jquery element
          @button class: "btn", click: "cancel", "Cancel Test"
        @div class: "output-container", outlet: "output"

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
        @process = ChildProcess.spawn atom.config.get("atomize-d.dubPath"), args, cwd: @projectRoot

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

    addClickEvent: (absPath, match, el) ->
      el.addEventListener "click", ->
        atom.workspace.open(absPath).then ->
          if match[3]
            atom.workspace.getActiveTextEditor().setCursorBufferPosition([parseInt(match[2]), parseInt(match[3])])
          else
            atom.workspace.getActiveTextEditor().setCursorBufferPosition([parseInt(match[2]), 0])

    appendOutput: (msg) ->
      msg = msg.toString("utf8")
      lines = msg.split("\n")
      for line in lines
        match = errorFormat.exec(line)
        if match
          absPath = ""
          if path.isAbsolute(match[1])
            absPath = path.normalize(match[1])
          else
            absPath = path.normalize(path.join(@projectRoot, match[1]))

          if absPath.indexOf(path.normalize(@projectRoot)) == 0
            el = document.createElement("a")
            el.setAttribute("class", "dub-test-link")
            el.textContent = line
            @addClickEvent(absPath, match, el)
            @output.append(el)
          else
            el = document.createElement("span")
            el.textContent = line
            @output.append(el)
        else
          el = document.createElement("span")
          el.textContent = line
          @output.append(el)

    destroy: ->

    getTitle: ->
      "atomize-d:tests"
