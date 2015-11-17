module.exports =
class MultiDCD
	selector: ".source.d, .source.di"
	disableForSelector: ".source.d .comment, .source.d .string"

	inclusionPriority: 1
	excludeLowerPriority: true

	base: null

	constructor: (base) ->
		@base = base

	getSuggestions: ({editor, bufferPosition, scopeDescriptor, prefix}) ->
		@base.getCurrentProject().dcd.getSuggestions({editor, bufferPosition, scopeDescriptor, prefix})
