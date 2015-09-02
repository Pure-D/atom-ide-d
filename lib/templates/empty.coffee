Template = require("./template")

module.exports =
	class Empty extends Template
		create: ->
			@name = "empty"
			@dub.description = "An empty project."

			new Promise (resolve) =>
				@createDefault().then =>
					@createFile("source/app.d", "").then resolve
