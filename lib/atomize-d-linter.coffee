{BufferedProcess} = require "atom"
fs = require "fs"
path = require "path"

module.exports =
  class AtomizeDLinter
    grammarScopes: ["source.d"]
    scope: "file"
    lintOnFly: false

    dscannerPath: null
    dscannerConfig: null

    constructor: ->
      @dscannerPath = atom.config.get("atomize-d.dscannerPath")
      if atom.project.getPaths()[0]
        @dscannerConfig = path.join(atom.project.getPaths()[0], "d-linter.ini")
      else
        @dscannerConfig = "d-linter.ini" # XXX: Needs to be reloaded on a new project

      parent = this
      atom.config.onDidChange("atomize-d.dscannerPath", ({newValue, oldValue}) ->
        parent.dscannerPath = newValue
      )

    generateConfig: ->
      plat = process.platform
      if (plat == "win32")
        @generateConfigImpl("dscanner.ini")
      else
        @generateConfigImpl(path.join(process.env.HOME, ".config/dscanner/dscanner.ini"))

    generateConfigImpl: (file) ->
      copy = (from, to, cb) ->
          r = fs.createReadStream(from)
          w = fs.createWriteStream(to)
          r.on("error", (error) ->
            throw error;
          )
          w.on("error", (error) ->
            throw error;
          )
          w.on("finish", cb)
          r.pipe(w)

      fs.exists(file, (exists) =>
        if (exists)
          copy(file, @dscannerConfig, (error) =>
            if (error)
              throw error

            atom.notifications.addSuccess("Generated default config to " + @dscannerConfig)
          )
        else
          new BufferedProcess
            command: @dscannerPath
            args: ["--defaultConfig"]
            stdout: (data) ->
              return
            exit: (code) =>
              fs.rename(file, @dscannerConfig, () -> return)
              atom.notifications.addSuccess("Generated default config to " + @dscannerConfig)

      )

    lint: (textEditor) =>
      self = this
      return new Promise (resolve, reject) =>
        filePath = textEditor.getPath().replace(/\\/g, "\\\\") # Fix for windows and filenames on linux containing \ (invalid JSON when path is C:\something because of escaped character)
        json = ""
        args = ["--report", filePath]

        if atom.project.contains(@dscannerConfig)
          args.push "--config"
          args.push @dscannerConfig

        process = new BufferedProcess
          command: @dscannerPath
          args: args
          stdout: (data) ->
            json += data
          exit: (code) ->
            return resolve [] unless code is 0
            info = try JSON.parse json
            return resolve [] unless info?
            return resolve [] if info.passed
            # Hopefully fixes the other file error line not being removed
            issues = (issue for issue in info.issues when issue.fileName == filePath)
            obj = issues.map (issue) ->
              type: self.getLevel(issue.key),
              text: issue.message,
              filePath: issue.fileName,
              range: [
                # Atom expects ranges to be 0-based
                [issue.line, issue.column],
                [issue.line, issue.column]
              ]
            resolve obj

        process.onWillThrowError ({error,handle}) ->
          atom.notifications.addError "Failed to run #{@executablePath}",
            detail: "#{error.message}"
            dismissable: true
          handle()
          resolve []

    getLevel: (key) ->
      return levels[key] if key of levels
      return key

    ###
    Run: grep -o -R "\"dscanner.*\"" | cut -d: -f2 | sed s/\"//g | sort
    to get all the level keys. Then you common sense if they should be an error
    or a warning.
    ###
    levels =
      "dscanner.bugs.backwards_slices": "error"
      "dscanner.bugs.if_else_same": "warn"
      "dscanner.bugs.logic_operator_operands": "error"
      "dscanner.bugs.logic_operator_operands": "error"
      "dscanner.bugs.self_assignment": "error"
      "dscanner.confusing.brexp": "warn"
      "dscanner.confusing.builtin_property_names": "warn"
      "dscanner.confusing.constructor_args": "warn"
      "dscanner.confusing.function_attributes": "warn"
      "dscanner.confusing.logical_precedence": "warn"
      "dscanner.confusing.struct_constructor_default_args": "warn"
      "dscanner.deprecated.delete_keyword": "error"
      "dscanner.deprecated.floating_point_operators": "error"
      "dscanner.if_statement": "warn"
      "dscanner.performance.enum_array_literal": "error"
      "dscanner.style.number_literals": "warn"
      "dscanner.style.phobos_naming_convention": "warn"
      "dscanner.style.undocumented_declaration": "warn"
      "dscanner.suspicious.catch_em_all": "warn"
      "dscanner.suspicious.comma_expression": "warn"
      "dscanner.suspicious.incomplete_operator_overloading": "warn"
      "dscanner.suspicious.label_var_same_name": "warn"
      "dscanner.suspicious.length_subtraction": "warn"
      "dscanner.suspicious.local_imports, Local imports should specify": "warn"
      "dscanner.suspicious.object_const": "warn"
      "dscanner.suspicious.redundant_parens": "warn"
      "dscanner.suspicious.unmodified": "warn"
      "dscanner.suspicious.unused_label": "warn"
      "dscanner.suspicious.unused_parameter": "warn"
      "dscanner.suspicious.unused_variable": "warn"
      "dscanner.syntax": "error"
      "dscanner.unnecessary.duplicate_attribute": "error"
