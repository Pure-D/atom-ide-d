fs = require "fs"
path = require "path"
{EventEmitter} = require 'events'

module.exports =
class DubConfig extends EventEmitter
	config: {}

	parse: ->
		self = this
		fs.readdir(atom.project.getPaths()[0], (err, files) ->
			if(err)
				console.error err
				self.emit "done"
			else
				file = ""
				if files.indexOf("dub.json") != -1
					file = "dub.json"
				else if files.indexOf(".d-project.json") != -1
					file = ".d-project.json"
				else
					console.log "No project file found"
					self.emit "done"
					return
				fs.readFile(path.join(atom.project.getPaths()[0], file), (err, data) ->
					self.config = data
					console.log "Found project file "
					self.emit "done"
				)
		)

	getImports: (config) ->
		imports = atom.config.get("atomize-d.dImportPaths")

		imports.push.apply imports, @config?.importPaths or ["source/"]
		if config?
			imports.push.apply imports, @config.configurations[config].importPaths if @config?.configurations?[config]?.importPaths

		console.log("Imports: ")
		console.log(imports)
		return imports
