module.exports =
class MultiDLinter
	grammarScopes: ["source.d"]
	scope: "file"
	lintOnFly: false

	inclusionPriority: 1
	excludeLowerPriority: true

	base: null

	constructor: (base) ->
		@base = base

	lint: (textEditor) ->
		@base.getCurrentProject().linter.lint(textEditor)
