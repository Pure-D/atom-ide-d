ChildProcess = require "child_process"

String::endsWith   ?= (s) -> s is "" or @[-s.length..] is s
String::capitalize = -> @replace /^./, (match) -> match.toUpperCase()

currentPort = 9166

module.exports =
class AtomizeDDCD
  dcdServer: null
  dcdClientPath: null
  dcdServerPath: null
  dub: null
  projectRoot: null
  port: 0

  selector: ".source.d, .source.di"
  disableForSelector: ".source.d .comment, .source.d .string"

  inclusionPriority: 1
  excludeLowerPriority: true

  getDocumentation: (editor) ->
    self = this

    new Promise (resolve) ->
      buffer = editor.getBuffer();
      dcdClient = ChildProcess.spawn(self.dcdClientPath, ["-p", self.port, "--doc", "-c", buffer.characterIndexForPosition(editor.getSelectedBufferRange().start)],
        cwd: self.projectRoot,
        env: process.env
      )
      dcdClient.stdin.write(buffer.getText())
      dcdClient.stdin.end()

      data = ""

      dcdClient.stdout.on("data", (out) ->
        data += "" + out
      )

      dcdClient.stderr.on("data", (data) ->
        if (data.indexOf("Unable to connect socket: Connection refused") != -1 or
            data.indexOf("Server closed the connection") != -1)
          atom.notifications.addWarning("DCD currently starting up. Try again in a few moments...");
          self.startServer()
        else
          atom.notifications.addError("DCD: " + data);
      )

      dcdClient.on("exit", (code) ->
        doc = data.trim()
        return resolve [] if doc.length == 0
        doc = doc.replace(/\\n/g, "\n")
        resolve doc
      )

  getDeclaration: (editor) ->
    self = this

    new Promise (resolve) ->
      buffer = editor.getBuffer();
      dcdClient = ChildProcess.spawn(self.dcdClientPath, ["-p", self.port, "--symbolLocation", "-c", buffer.characterIndexForPosition(editor.getSelectedBufferRange().end)],
        cwd: self.projectRoot,
        env: process.env
      )
      dcdClient.stdin.write(buffer.getText())
      dcdClient.stdin.end()

      data = ""

      dcdClient.stdout.on("data", (out) ->
        data += "" + out
      )

      dcdClient.stderr.on("data", (data) ->
        if (data.indexOf("Unable to connect socket: Connection refused") != -1 or
            data.indexOf("Server closed the connection") != -1)
          atom.notifications.addWarning("DCD currently starting up. Try again in a few moments...");
          self.startServer()
        else
          atom.notifications.addError("DCD: " + data);
      )

      dcdClient.on("exit", (code) ->
        resolve data.trim()
      )


  searchSymbol: (symbol) ->
    self = this

    new Promise (resolve) ->
      dcdClient = ChildProcess.spawn(self.dcdClientPath, ["-p", self.port, "--search", symbol],
        cwd: self.projectRoot,
        env: process.env
      )
      dcdClient.stdin.end()

      data = ""

      dcdClient.stdout.on("data", (out) ->
        data += "" + out
      )

      dcdClient.stderr.on("data", (data) ->
        if (data.indexOf("Unable to connect socket: Connection refused") != -1 or
            data.indexOf("Server closed the connection") != -1)
          atom.notifications.addWarning("DCD currently starting up. Try again in a few moments...");
          self.startServer()
        else
          atom.notifications.addError("DCD: " + data);
      )

      dcdClient.on("exit", (code) ->
        lines = data.trim().split("\n")
        return if lines.length == 0
        resolve lines
      )

  getSuggestions: ({editor, bufferPosition, scopeDescriptor, prefix}) ->
    self = this

    new Promise (resolve) ->
      buffer = editor.getBuffer();
      dcdClient = ChildProcess.spawn(self.dcdClientPath, ["-p", self.port, "-c", buffer.characterIndexForPosition(bufferPosition)],
        cwd: self.projectRoot,
        env: process.env
      )
      dcdClient.stdin.write(buffer.getText())
      dcdClient.stdin.end()

      data = ""

      dcdClient.stdout.on("data", (out) ->
        data += "" + out
      )

      dcdClient.stderr.on("data", (data) ->
        #atom.notifications.addError("DCD: " + data);
        if (data.indexOf("Unable to connect socket: Connection refused") != -1 or
            data.indexOf("Server closed the connection") != -1)
          self.startServer()
        else
          atom.notifications.addError("DCD: " + data);
      )

      dcdClient.on("exit", (code) ->
        return resolve([]) if data.trim().length == 0
        lines = data.trim().split("\n")
        if lines[0].trim() == "identifiers"
          suggestions = []
          for i in [1 .. lines.length]
            if !lines[i] || lines[i].trim().length == 0
              continue
            splits = lines[i].trim().split(/\s+/)
            suggestions.push
              text: splits[0]
              type: self.getType(splits[1])
              rightLabel: self.getType(splits[1])?.capitalize()
          resolve(suggestions)
        else if lines[0].trim() == "calltips"
          lines.shift()
          hint = []
          for line in lines
            hint.push
              rightLabel: line,
              text: line,
              snippet: "",
              replacementPrefix: "",
              className: "d-autocomplete-suggestion-type-hint"
          resolve(hint)
        else
          atom.notifications.addError("Invalid data:\n" + data);
          resolve([])
      )

  getType: (c) ->
    types[c]

  types =
    c: "class"
    i: "interface"
    s: "struct"
    u: "union"
    v: "variable"
    m: "member variable"
    k: "keyword"
    f: "function"
    g: "enum"
    e: "enum member"
    P: "package"
    M: "module"
    a: "array"
    A: "associative array"
    l: "alias"
    t: "template"
    T: "mixin template"

  constructor: (dub) ->
    @dcdClientPath = atom.config.get("atomize-d.dcdClientPath")
    @dcdServerPath = atom.config.get("atomize-d.dcdServerPath")
    @dub = dub
    @projectRoot = dub.projectRoot

    parent = this

    atom.config.onDidChange("atomize-d.dcdClientPath", ({newValue, oldValue}) ->
      parent.dcdClientPath = newValue
    )

    atom.config.onDidChange("atomize-d.dcdServerPath", ({newValue, oldValue}) ->
      parent.dcdServerPath = newValue
    )

  start: ->
    @port = currentPort
    currentPort++

    checkDCD = ChildProcess.spawn(@dcdClientPath, ["-q", "-p", @port],
      cwd: @projectRoot,
      env: process.env
    )

    parent = this

    checkDCD.stdout.on('data', (data) -> return)
    checkDCD.on('exit', (code) ->
      parent.startServer() if code == 1
    )

    atom.config.onDidChange("atomize-d.dImportPaths", ({newValue, oldValue}) =>
      @updateImports()
    )

  updateImports: ->
    @dub.getImports undefined, (importPaths) =>
      args = []
      args.push "-I" + importPath for importPath in importPaths
      args.push "-p"
      args.push @port

      dcdAddImports = ChildProcess.spawn(@dcdClientPath, args,
        cwd: @projectRoot,
        env: process.env
      )
      dcdAddImports.stdout.on('data', (data) -> return)
      dcdAddImports.stderr.on('data', (data) -> return)
      dcdAddImports.on('exit', (code) -> return)

  startServer: ->
    parent = this

    @dub.getImports(undefined, (importPaths) =>
      args = []
      args.push "-I#{importPath}" for importPath in importPaths
      args.push "-p"
      args.push @port

      @dcdServer = ChildProcess.spawn(@dcdServerPath, args,
        cwd: @projectRoot,
        env: process.env
      )

      @dcdServer.stdout.on 'data', (data) ->
        console.log("[dcdServer][ ] " + data);

      @dcdServer.stderr.on "data", (data) ->
        console.log("[dcdServer][!] " + data);

      @dcdServer.on('exit', (code) ->
        console.log("[dcdServer] Stopped with code: " + code + "\nRestarting!");
        parent.startServer()
      )
      console.log("DCD Ready")
    )

  dispose: ->
    ChildProcess.spawn(@dcdClientPath, ["--shutdown", "-p", @port])
