fs = require "fs"
path = require "path"
semver = require "semver"
async = require "async"

module.exports =
class DubConfig
	config: null
	configPath: ""
	systemPath: ""
	userPath: ""
	projectRoot: ""

	constructor: ->
		if process.platform == "win32"
			@systemPath = path.join(process.env.ProgramData, "dub")
			@userPath = path.join(process.env.APPDATA, "dub")
		else
			@systemPath = "/var/lib/dub"
			@userPath = path.join(process.env.HOME, ".dub")
			if !path.isAbsolute(@userPath)
				@userPath = path.join(process.cwd(), @userPath)

	parse: (callback, cwd = null) ->
		throw "Invalid path" if typeof cwd != "string"
		@projectRoot = cwd
		fs.readdir(cwd, (err, files) =>
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
				fs.readFile(path.join(cwd, file), (err, data) =>
					@configPath = path.join(cwd, file)
					@config = JSON.parse(data.toString())
					callback(err)
				)
		)

	getPackageDirectory: ->
		path.join(@userPath, "packages")

	getDubJson: ->
		@configPath

	getDependencies: ->
		return @config?.dependencies or {}

	getConfigs: ->
		configs = @config?.configurations or []
		return configs

	getConfig: (name) ->
		for config in @config.configurations
			return config if config?.name == name
		return undefined

	getImports: (config, actualCallback, imports = atom.config.get("atomize-d.dImportPaths")) =>
		cwd = @projectRoot

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
		imports.push.apply imports, @getConfig(config).sourcePaths if config? and @getConfig(config)?.sourcePaths
		imports.push.apply imports, @getConfig(config).importPaths if config? and @getConfig(config)?.importPaths

		for sub in @config?.subPackages or []
			imports.push.apply imports, sub.importPaths or []
			imports.push.apply imports, sub.sourcePaths or []

		found = []
		for imp in imports
			imp = path.normalize(imp)
			if !path.isAbsolute(imp)
				imp = path.join cwd, imp
			if found.indexOf(imp) != -1
				continue
			found.push path.normalize(imp)
		imports = found

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
					versions.push entry.substr(found.name.length + 1).replace(/_/g, "+") for entry in found.entries when entry.substr(found.name.length + 1) != "master"
					max = semver.maxSatisfying(versions, found.target)
					if !max
						return cb() # not found
					bestPathMatch = path.join(self.userPath, "packages", "#{found.name}-#{max}")

					for imp in imports
						if imp.indexOf(bestPathMatch) == 0
							return cb() # already imported


					cfg = new DubConfig
					cfg.parse (() ->
						cfg.getImports(undefined, ((newImports) ->
							imports.push.apply imports, newImports
							cb()
						), imports, bestPathMatch)
					), bestPathMatch

					), ((err) ->
						if(err)
							console.error(err)

						callback(imports)
					)
		else
			callback(imports)

	generateBuildFile: =>
		file = path.join(@projectRoot, ".atom-build.json")
		dub = atom.config.get("atomize-d.dubPath")
		json =
			cmd: dub
			args: ["build"]
			name: "Build Default"
			sh: false
			targets:
				"Run Default":
					cmd: dub
					sh: false
					args: ["run"]
		configs = @getConfigs()
		for config in configs
			json.targets["Build #{config.name}"] =
				cmd: dub
				sh: false
				args: ["build", "--config=#{config.name}"]
			if config.targetType == "library"
				continue
			json.targets["Run #{config.name}"] =
				cmd: dub
				sh: false
				args: ["run", "--config=#{config.name}"]
		fs.writeFile file, JSON.stringify(json, null, "\t"), (err) ->
			if err
				atom.notifications.addError "Failed to generate atom-build file",
					detail: err
					dismissable: true
