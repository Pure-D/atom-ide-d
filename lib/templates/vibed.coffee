Template = require("./template")

module.exports =
	class VibeD extends Template
		create: ->
			@name = "vibe-d"
			@dub.description = "A simple vibe.d server application."
			@dub.dependencies =
				"vibe-d": "~>0.7.24"
			@dub.versions = ["VibeDefaultMain"]

			new Promise (resolve) =>
				@createDefault().then =>
					@createFolder("public").then =>
						@createFolder("views").then =>
							@createFile("source/app.d", """import vibe.d;

shared static this() {
	auto settings = new HTTPServerSettings;
	settings.port = 8080;
	settings.bindAddresses = ["::1", "127.0.0.1"];
	listenHTTP(settings, &hello);

	logInfo("Please open http://127.0.0.1:8080/ in your browser.");
}

void hello(HTTPServerRequest req, HTTPServerResponse res)
{
	res.writeBody("Hello, World!");
}""").then resolve
