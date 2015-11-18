{ScrollView, $, $$} = require "atom-space-pen-views"
{Disposable, CompositeDisposable} = require 'atom'

module.exports =
class ResultsView extends ScrollView
	results: null
	query: null
	disposables: null

	@content: ->
		@div class: "atomize-d", =>
			@p outlet: "title"
			@ol outlet: "list", class: "result-list"

	showResults: (query, results) ->
		@query = query
		@results = results
		@attach()

	destroy: ->
		@detach()

	detach: ->
		@disposables?.dispose()

	attach: ->
		@detach() if @panel?.isVisible()

		@disposables = new CompositeDisposable()
		@panel = atom.workspace.addBottomPanel(item: this)
		@disposables.add new Disposable =>
			@panel.destroy()
			@panel = null

		@update()

	initialize: ->
		super
		@update()

	update: ->
		results = @results
		query = @query
		return if not results
		query = "" if not query
		@title.text("Found #{results.length} result#{if results.length == 1 then '' else 's'} for query '#{query}'");
		@list.empty()
		for result in results
			splits = result.split("\t")
			li = document.createElement("li")
			a = document.createElement("a")
			a.onclick = ((splits) -> ->
				atom.workspace.open(splits[0])
				byteOff = parseInt(splits[2])
				didOpenListener = atom.workspace.onDidOpen (event) ->
					editor = atom.workspace.getActiveTextEditor()
					console.log editor
					if editor and editor.getPath() == splits[0]
						editor.setCursorBufferPosition(editor.getBuffer().positionForCharacterIndex(byteOff))
						didOpenListener.dispose()
			)(splits)
			a.textContent = splits[0]
			li.appendChild(a)
			@list.append(li)
