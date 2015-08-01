ChildProcess = require 'child_process'

String::endsWith   ?= (s) -> s is '' or @[-s.length..] is s
String::capitalize = -> @replace /^./, (match) -> match.toUpperCase()

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
      buffer = editor.getBuffer();
      dcdClient = ChildProcess.spawn(self.dcdClientPath, ["-c", buffer.characterIndexForPosition(bufferPosition)],
        cwd: atom.project.getPaths()[0],
        env: process.env
      )
      dcdClient.stdin.write(buffer.getText())
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
        if lines[0].trim() == "identifiers"
          suggestions = []
          for i in [1 .. lines.length]
            if !lines[i] || lines[i].trim().length == 0
              continue
            splits = lines[i].trim().split(/\s+/)
            console.log("Lines: " + lines);
            console.log("Splits: " + splits);
            suggestions.push
              text: splits[0]
              type: self.getType(splits[1])
              rightLabel: self.getType(splits[1]).capitalize()
          resolve(suggestions)
        else if lines[0].trim() == "calltips"
          #Need another autocompleting thingy, that doesn't auto insert when
          #there is only one symbol and the thingy can show the current args
          resolve([])
        else
          atom.notifications.addError("Invalid data:\n"+data);
          resolve([])
  		)

  getType: (c) ->
    return "class" if c == "c"
    return "interface" if c == "i"
    return "struct" if c == "s"
    return "union" if c == "u"
    return "variable" if c == "v"
    return "member variable" if c == "m"
    return "keyword" if c == "k"
    return "function" if c == "f"
    return "enum" if c == "g"
    return "enum member" if c == "e"
    return "package" if c == "P"
    return "module" if c == "M"
    return "array" if c == "a"
    return "associative array" if c == "A"
    return "alias" if c == "l"
    return "template" if c == "t"
    return "mixin template" if c == "T"

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

    checkDCD.stdout.on('data', (data) -> return)

    checkDCD.stderr.on('data', (data) -> return)
    checkDCD.on('exit', (code) ->
      parent.startServer() if code == 1
    )

    atom.config.onDidChange("atomize-d.dImportPaths", ({newValue, oldValue}) ->
      importPaths = atom.config.get("atomize-d.dImportPaths")
      args = []
      args.push "-I" + importPath for importPath in importPaths

      dcdAddImports = ChildProcess.spawn(parent.dcdClientPath, args,
        cwd: atom.project.getPaths()[0],
        env: process.env
      )
      dcdAddImports.stdout.on('data', (data) -> return)
      dcdAddImports.stderr.on('data', (data) -> return)
      dcdAddImports.on('exit', (code) -> return)
    )

  startServer: ->
    importPaths = atom.config.get("atomize-d.dImportPaths")
    args = []
    args.push "-I" + importPath for importPath in importPaths

    @dcdServer = ChildProcess.spawn(@dcdServerPath, args,
      cwd: atom.project.getPaths()[0],
      env: process.env
    )

    @dcdServer.stdout.on('data', (data) -> return)

    @dcdServer.stderr.on('data', (data) ->
      atom.notifications.addError("DCD-Server error: " + data);
    )

    @dcdServer.on('exit', (code) -> return)
    @dcdServerRunning = true

  stop: ->
    #Will stop in the future, when we have one dcd-server for each project
    #ChildProcess.spawn(@dcdClientPath, ["--shutdown"])
