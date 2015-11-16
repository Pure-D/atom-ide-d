ChildProcess = require "child_process"

module.exports =
class FormatterDFMT
	format: (text, callback) ->
		formatter = ChildProcess.spawn(atom.config.get("atomize-d.dfmtPath"), [], {
			cwd: atom.project.getPaths()[0],
			env: process.env
		})
		formatted = ""
		formatter.stdout.on "data", (data) ->
			formatted += data.toString("utf8")
		formatter.once "exit", (code) ->
			callback formatted
		formatter.stdin.end text
