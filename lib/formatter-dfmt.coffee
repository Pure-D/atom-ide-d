ChildProcess = require "child_process"

module.exports =
class FormatterDFMT
	projectRoot: null

	constructor: (projectRoot) ->
		@projectRoot = projectRoot

	format: (text, callback) ->
		formatter = ChildProcess.spawn(atom.config.get("atomize-d.dfmtPath"), [], {
			cwd: @projectRoot,
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
