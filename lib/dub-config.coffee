fs = require "fs"
path = require "path"
semver = require "semver"
async = require "async"

module.exports =
class DubConfig
	config: null
	systemPath: ""
	userPath: ""

	constructor: ->
		if process.platform == "win32"
			@systemPath = path.join(process.env.ProgramData, "dub")
			@userPath = path.join(process.env.APPDATA, "dub")
		else
			@systemPath = "/var/lib/dub"
			@userPath = path.join(process.env.HOME, ".dub")
			if !path.isAbsolute(@userPath)
				@userPath = process.cwd() + @userPath

	parse: (callback, cwd = atom.project.getPaths()[0]) ->
		self = this
		fs.readdir(cwd, (err, files) ->
			if(err)
				console.error err
				callback(err)
			else
				file = ""
				if files.indexOf("dub.json") != -1
					file = "dub.json"
				else if files.indexOf("package.json") != -1
					file = "package.json"
				else
					callback("No project file found")
					return
				fs.readFile(path.join(cwd, "dub.json"), (err, data) ->
					self.config = JSON.parse(data.toString())
					callback(err)
				)
		)

	getDependencies: ->
		return @config?.dependencies or {}

	getConfigs: ->
		return @config?.configurations or []

	getConfig: (name) ->
		for config in @config.configurations
			return config if config?.name == name
		return undefined

	getImports: (config, actualCallback, imports = atom.config.get("atomize-d.dImportPaths"), cwd = atom.project.getPaths()[0]) ->

		callback = (imports) ->
			found = []
			for imp in imports
				imp = path.normalize(imp)
				if !path.isAbsolute(imp)
					imp = path.join cwd, imp
				if found.indexOf(imp) != -1
					continue
				found.push path.normalize(imp)

			imports = found

			actualCallback(imports)

		imports.push.apply imports, @config?.importPaths or []
		imports.push.apply imports, @config?.sourcePaths or ["source/"]
		imports.push.apply imports, @getConfig(config).importPaths if config? and @getConfig(config)?.importPaths

		dependencies = @getDependencies()

		self = this

		if dependencies?
			fs.readdir path.join(@userPath, "packages"), (err, files) ->
				return callback() if err

				allFound = []

				for dependency, version of dependencies
					cleanName = dependency.replace(/\+/g, "_")

					found =
						name: cleanName
						target: version
						entries: []
					found.entries.push file for file in files when file.indexOf(cleanName) == 0

					allFound.push(found)

				async.each allFound, ((found, cb) ->
					versions = []
					versions.push entry.substr(found.name.length + 1) for entry in found.entries
					max = semver.maxSatisfying(versions, found.target)
					if !max
						return cb() # not found
					maxPath = path.join(self.userPath, "packages", "#{found.name}-#{max}")

					for imp in imports
						if imp.indexOf(maxPath) == 0
							return cb() # already imported


					cfg = new DubConfig
					cfg.parse.call self, (() ->
						cfg.getImports.call(self, undefined, ((newImports) ->
							imports.push.apply imports, newImports
							cb()
							), imports, maxPath)
						), maxPath

					), ((err) ->
						if(err)
							console.error(err)

						callback(imports)
					)
		else
			callback(imports)
