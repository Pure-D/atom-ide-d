fs = require "fs"
path = require "path"

module.exports =
	class Template
		path: null
		dub:
			name: "dproject"
			description: "A minimal D application."
			copyright: "Copyright © 2015"
			authors: []
			dependencies: {}
		name: null

		constructor: (path) ->
			@path = path

		create: ->
			throw "Override Template.create!";

		createDefault: ->
			new Promise (resolve) =>
				@createFolder("").then =>
					@createGitIgnore().then =>
						@createDubJson().then =>
							@createAtomBuild().then =>
								@createFolder("source").then resolve

		createGitIgnore: ->
			@createFile(".gitignore", """.dub
docs.json
__dummy.html
*.o
*.obj""")

		createDubJson: ->
			@createFile("dub.json", JSON.stringify(@dub, null, "\t"))

		createAtomBuild: ->
			@createFile(".atom-build.json", JSON.stringify(
				cmd: "dub"
				args: ["build"]
				name: "Build Default"
				sh: false
				targets:
					"Run Default":
						cmd: "dub"
						sh: false,
						args: ["run"]
			, null, "\t"))

		createFolder: (name) ->
			new Promise (resolve) =>
				throw "Name not set." if not @name?
				fs.mkdir(path.join(@path, @name, name), (err) ->
					throw err if err? and err.code != "EEXIST"
					resolve()
				)

		createFile: (name, data) ->
			new Promise (resolve) =>
				throw "Name not set." if not @name?
				fs.writeFile(path.join(@path, @name, name), data, (err) ->
					throw err if err?
					resolve()
				)
