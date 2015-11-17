ChildProcess = require "child_process"
path = require "path"
fs = require "fs"

module.exports =
class FormatterDFMT
	projectRoot: null

	constructor: (projectRoot) ->
		@projectRoot = projectRoot

	format: (editor, text, callback) ->
		args = []
		if not editor.usesSoftTabs()
			args.push("--indent_style=tab")
		else
			args.push("--indent_style=space")
		args.push("--tab_width=" + editor.getTabLength())
		formatter = ChildProcess.spawn(atom.config.get("atomize-d.dfmtPath"), args, {
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

	generateConfig: () ->
		config = [
			"[*.d]",
			"# allman, otbs or stroustrup - see https://en.wikipedia.org/wiki/Indent_style",
			"dfmt_brace_style = allman",
			"# The formatting process will usually keep lines below this length, but they may be up to max_line_length columns long.",
			"dfmt_soft_max_line_length = 80",
			"# Place operators on the end of the previous line when splitting lines",
			"dfmt_split_operator_at_line_end = false",
			"# Insert space after the closing paren of a cast expression",
			"dfmt_space_after_cast = true",
			"# Insert space after the module name and before the : for selective imports",
			"dfmt_selective_import_space = true",
			"# Place labels on the same line as the labeled switch, for, foreach, or while statement",
			"dfmt_compact_labeled_statements = true",
			"#",
			"# Not yet implemented:",
			"#",
			"# Align labels, cases, and defaults with their enclosing switch",
			"dfmt_align_switch_statements = true",
			"# Decrease the indentation level of attributes",
			"dfmt_outdent_attributes = true",
			"# Insert space after if, while, foreach, etc, and before the (",
			"dfmt_space_after_keywords = true"
		]
		file = path.join(@projectRoot, ".editorconfig")
		fs.exists file, (exists) =>
			if exists
				atom.notifications.addError(".editorconfig already exists!")
			else
				fs.writeFile file, config.join("\n"), (err) =>
					if(err)
						atom.notifications.addError("Could not write config", detail: err)
					else
						atom.notifications.addSuccess("Generated default config to .editorconfig")
