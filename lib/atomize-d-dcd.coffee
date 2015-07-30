ChildProcess = require 'child_process'

String::endsWith   ?= (s) -> s is '' or @[-s.length..] is s

module.exports =
class AtomizeDDCD
  dcdServer: null
  dcdClientPath: null
  dcdServerPath: null

  selector: ".source.d, .source.di"
  disableForSelector: ".source.d .comment, .source.d .string"

  inclusionPriority: 1
  excludeLowerPriority: true

  getSuggestions: ({editor, bufferPosition, scopeDescriptor, prefix}) ->
    self = this

    new Promise (resolve) ->
      dcdClient = ChildProcess.spawn(self.dcdClientPath, ["-c", editor.getBuffer().characterIndexForPosition(bufferPosition).toString()],
        cwd: atom.project.getPaths()[0],
        env: process.env
      )
      dcdClient.stdin.write(editor.getBuffer().getText())
      dcdClient.stdin.end()

      data = ""

      dcdClient.stdout.on('data', (out) ->
        data += "" + out
      )

      dcdClient.stderr.on('data', (data) ->
        atom.notifications.addError("DCD: " + data);
  		)

      dcdClient.on('exit', (code) ->
        return resolve([]) if data.trim().length == 0
        lines = data.trim().split("\n")
        if lines[0].trim() != "identifiers"
          atom.notifications.addError("Invalid data:\n"+data);
          resolve([])
        else
          suggestions = []
          for i in [1 .. lines.length]
            if !lines[i] || lines[i].trim().length == 0
              continue
            splits = lines[i].trim().split(/\s+/)
            suggestions.push
              text: splits[0]
              leftLabel: splits[1]
          console.log suggestions
          resolve(suggestions)
  		)

  constructor: ->
    @dcdClientPath = atom.config.get("atomize-d.dcdClientPath")
    @dcdServerPath = atom.config.get("atomize-d.dcdServerPath")

    parent = this

    atom.config.onDidChange("atomize-d.dcdClientPath", ({newValue, oldValue}) ->
      parent.dcdClientPath = newValue
    )

    atom.config.onDidChange("atomize-d.dcdServerPath", ({newValue, oldValue}) ->
      parent.dcdServerPath = newValue
    )

  start: ->
    checkDCD = ChildProcess.spawn(@dcdClientPath, ["-q"],
      cwd: atom.project.getPaths()[0],
      env: process.env
    )

    parent = this

    checkDCD.stdout.on('data', (data) ->
      parent.startServer() unless data == "Server is running\n"
    )

    checkDCD.stderr.on('data', (data) -> return)
    checkDCD.on('exit', (code) -> return)

    console.log("DCD: ready")

  startServer: ->
    @dcdServer = ChildProcess.spawn(@dcdServerPath, [],
      cwd: atom.project.getPaths()[0],
      env: process.env
    )

    @dcdServer.stdout.on('data', (data) ->
      console.log("[dcdServer][ ] " + data);
    )

    @dcdServer.stderr.on('data', (data) ->
      console.log("[dcdServer][!] " + data);
		)

    @dcdServer.on('exit', (code) ->
      console.log("[dcdServer] Stopped with code: " + code);
		)

  destroy: ->
    ChildProcess.spawn(@dcdClientPath, "--shutdown")
