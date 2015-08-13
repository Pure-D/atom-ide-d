{BufferedProcess} = require "atom"
fs = require "fs"
path = require "path"

# path(lineNumber): (Deprecation|Warning|Error): <message>
dubErrorFormat = /(.*?)\((\d+)\): (Deprecation|Warning|Error): (.*)/g;

module.exports =
  class DubLinter
    grammarScopes: ["source.d"]
    scope: "file"
    lintOnFly: false

    dubPath: null

    constructor: ->

      @dubPath = atom.config.get("atomize-d.dubPath")
      atom.config.onDidChange "atomize-d.dubPath", ({newValue, oldValue}) =>
        @dubPath = newValue

    lint: (textEditor) =>
      return new Promise (resolve, reject) =>
        output = ""
        args = ["build", "--nodeps", "--combined", "--root=" + atom.project.getPaths()[0]]
        # --root= instead of cwd for absolute file paths

        if global.buildName?
          args.push "--config=" + global.buildName

        env = Object.create(process.env)
        env.DFLAGS = "-o-"

        proc = new BufferedProcess
          command: @dubPath
          args: args
          options:
            env: env
          stdout: (data) ->
            output += data
          stderr: (data) ->
            output += data
          exit: (code) ->
            console.log output
            lines = output.split("\n");
            obj = []
            for line in lines
              console.log line
              match = dubErrorFormat.exec(line)
              if match? && match.length >= 5
                obj.push
                  type: match[3],
                  text: match[4],
                  filePath: match[1],
                  range: [
                    [parseInt(match[2]) - 1, 0],
                    [parseInt(match[2]) - 1, 1000] # Whole line
                  ]
            console.log obj
            resolve obj

        proc.onWillThrowError ({error,handle}) ->
          atom.notifications.addError "Failed to run #{@executablePath}",
            detail: "#{error.message}"
            dismissable: true
          handle()
          resolve []
