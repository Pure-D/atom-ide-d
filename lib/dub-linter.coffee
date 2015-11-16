{BufferedProcess} = require "atom"
fs = require "fs"
path = require "path"

# path(lineNumber): (Deprecation|Warning|Error): <message>
dubErrorFormat = /(.*?)\((\d+),(\d+)\): (Deprecation|Warning|Error): (.*)/g;
dubErrorFormatRel = /(.*?)\((\d+),(\d+)\): (.*)/g;

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
        args = ["build", "--nodeps", "--combined", "-q"]

        if global.buildName?
          args.push "--config=" + global.buildName

        env = Object.create(process.env)
        env.DFLAGS = "-vcolumns -o-"

        proc = new BufferedProcess
          command: @dubPath
          args: args
          options:
            env: env
            cwd: atom.project.getPaths()[0]
          stdout: (data) ->
            output += data
          stderr: (data) ->
            output += data
          exit: (code) ->
            lines = output.split("\n");
            obj = []
            for line in lines
              match = dubErrorFormat.exec(line)
              if match
                obj.push
                  type: match[4],
                  text: match[5],
                  filePath: path.join(atom.project.getPaths()[0], match[1]),
                  range: [
                    [parseInt(match[2]) - 1, parseInt(match[3]) - 1],
                    [parseInt(match[2]) - 1, parseInt(match[3]) + 300]
                  ]
              else
                if line.indexOf("from here") != -1 or line.indexOf("from argument types") != -1
                  match = dubErrorFormatRel.exec(line)
                  if match
                    obj.push
                      type: "error",
                      text: match[4],
                      filePath: path.join(atom.project.getPaths()[0], match[1]),
                      range: [
                        [parseInt(match[2]) - 1, parseInt(match[3]) - 1],
                        [parseInt(match[2]) - 1, parseInt(match[3]) + 300]
                      ]
            resolve obj

        proc.onWillThrowError ({error,handle}) ->
          atom.notifications.addError "Failed to run #{@executablePath}",
            detail: "#{error.message}"
            dismissable: true
          handle()
          resolve []
