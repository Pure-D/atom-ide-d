ChildProcess = require 'child_process'

String::endsWith   ?= (s) -> s is '' or @[-s.length..] is s

module.exports =
class AtomizeDDCD
  dcdClient: null
  dcdServer: null
  dcdClientPath: null
  dcdServerPath: null

  constructor: ->
    @dcdClientPath = atom.config.get("atomize-d.dcdClientPath")
    @dcdServerPath = atom.config.get("atomize-d.dcdServerPath")
    checkDCD = ChildProcess.spawn(@dcdClientPath, ["-q"],
      cwd: atom.project.getPaths()[0],
      env: process.env
    )

    parent = this

    atom.config.onDidChange "atomize-d.dcdClientPath", ({newValue, oldValue}) ->
      parent.dcdClientPath = newValue

    atom.config.onDidChange "atomize-d.dcdServerPath", ({newValue, oldValue}) ->
      parent.dcdServerPath = newValue

    checkDCD.stdout.on('data', (data) ->
      parent.startServer() if data != "Server is running\n"
    )
    checkDCD.stderr.on('data', (data) -> return)
    checkDCD.on('exit', (code) -> return)

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
  test: ->
    editor = atom.workspace.getActiveTextEditor()
    grammar = editor.getGrammar()
    return if grammar.name != "D"

    buffer = editor.getBuffer()
    pos = editor.getCursorBufferPosition()

    data = buffer.getText()
    cursorPos = buffer.characterIndexForPosition(pos)

    atom.notifications.addSuccess("Starting dcd");

    @dcdClient = ChildProcess.spawn(@dcdClientPath, ["-c", "" + cursorPos],
      cwd: atom.project.getPaths()[0],
      env: process.env
    )
    @dcdClient.stdin.write(data)
    @dcdClient.stdin.end()

    @dcdClient.stdout.on('data', (data) ->
      atom.notifications.addSuccess(""+data);
    )

    @dcdClient.stderr.on('data', (data) ->
      atom.notifications.addError(""+data);
		)

    @dcdClient.on('exit', (code) ->
      atom.notifications.addSuccess("End of DCD: " + code);
		)
