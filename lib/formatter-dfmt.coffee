ChildProcess = require "child_process"

module.exports =
class FormatterDFMT
	format: (text, callback) ->
		formatter = ChildProcess.spawn(atom.config.get("atomize-d.dfmtPath"), [], {
			cwd: atom.project.getPaths()[0],
			env: process.env
		})
		formatted = ""
		attachedCallback = false
		formatter.stdout.on "data", (data) ->
			formatted += data.toString("utf8")
			if not attachedCallback
				attachedCallback = true
				formatter.once "exit", (code) ->
					callback formatted
		formatter.stdin.end text
