Template = require("./template")

module.exports =
	class HelloWorld extends Template
		create: ->
			@name = "hello-world"
			new Promise (resolve) =>
				@createDefault().then =>
					@createFile("source/app.d", """import std.stdio;

void main() {
	writeln("Hello World!");
}""").then resolve
