module.exports =
class MultiDubLinter
	grammarScopes: ["source.d"]
	scope: "file"
	lintOnFly: false

	base: null

	constructor: (base) ->
		@base = base

	lint: (textEditor) ->
		@base.getCurrentProject().dubLinter.lint(textEditor)
