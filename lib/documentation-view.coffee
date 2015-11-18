{ScrollView, $, $$} = require "atom-space-pen-views"
{Disposable, CompositeDisposable} = require 'atom'

module.exports =
class DocumentationView extends ScrollView
	docContent: null
	disposables: null

	@content: ->
		@div outlet: "rootElem", class: "atomize-d resizer", =>
			@div outlet: "resizeHandle", class: "resize-handle"
			@div outlet: "doc", class: "documentation-content"

	showDocs: (content) ->
		@docContent = content
		@attach()

	destroy: ->
		@detach()

	detach: ->
		@disposables?.dispose()

	attach: ->
		@detach() if @panel?.isVisible()

		@disposables = new CompositeDisposable()
		@panel = atom.workspace.addRightPanel(item: this)
		@disposables.add new Disposable =>
			@panel.destroy()
			@panel = null

		@update()

	initialize: ->
		super
		this.width 400
		@resizeHandle.on("mousedown", @resizeStarted)
		@update()

	resizeStarted: =>
		$(document).on('mousemove', @resizeView)
		$(document).on('mouseup', @resizeStopped)

	resizeStopped: =>
		$(document).off('mousemove', @resizeView)
		$(document).off('mouseup', @resizeStopped)

	resizeView: ({pageX}) =>
		this.width $(document.body).width() - pageX

	update: ->
		return if not @docContent
		@doc.empty()
		div = document.createElement("div")
		div.setAttribute("class", "entry")
		div.textContent = @docContent
		@doc.append(div)
