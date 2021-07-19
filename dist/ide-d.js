var $aa30k$atomlanguageclient = require("atom-languageclient");

var $parcel$global =
typeof globalThis !== 'undefined'
  ? globalThis
  : typeof self !== 'undefined'
  ? self
  : typeof window !== 'undefined'
  ? window
  : typeof global !== 'undefined'
  ? global
  : {};
var $parcel$modules = {};
var $parcel$inits = {};

var parcelRequire = $parcel$global["parcelRequireaf25"];
if (parcelRequire == null) {
  parcelRequire = function(id) {
    if (id in $parcel$modules) {
      return $parcel$modules[id].exports;
    }
    if (id in $parcel$inits) {
      let init = $parcel$inits[id];
      delete $parcel$inits[id];
      let module = {id: id, exports: {}};
      $parcel$modules[id] = module;
      init.call(module.exports, module, module.exports);
      return module.exports;
    }
    var err = new Error("Cannot find module '" + id + "'");
    err.code = 'MODULE_NOT_FOUND';
    throw err;
  };

  parcelRequire.register = function register(id, init) {
    $parcel$inits[id] = init;
  };

  $parcel$global["parcelRequireaf25"] = parcelRequire;
}

parcelRequire.register("a8LAl", function(module, exports) {
module.exports = Promise.resolve(require("./atom-package-deps.7b276538.js")).then(()=>parcelRequire('lLugl')
);

});


parcelRequire.register("4lHpq", function(module, exports) {
module.exports = Promise.resolve(require("./installation.6c1a001e.js")).then(()=>parcelRequire('k0amS')
);

});


class $ac7603b3a1549a05$var$DLanguageClient extends $aa30k$atomlanguageclient.AutoLanguageClient {
    async activate() {
        super.activate();
        if (!atom.packages.isPackageLoaded("atom-ide-base")) {
            // install if not installed
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            await (await (parcelRequire("a8LAl"))).install("ide-d", true);
            // enable if disabled
            atom.packages.enablePackage("atom-ide-base");
            atom.notifications.addSuccess("ide-d: atom-ide-base was installed and enabled...");
        }
    }
    /* eslint-disable class-methods-use-this */ getGrammarScopes() {
        return [
            "source.d",
            "D"
        ];
    }
    getLanguageName() {
        return "D";
    }
    getServerName() {
        return "serve-d";
    }
    getConnectionType() {
        return "stdio";
    }
    /* eslint-enable class-methods-use-this */ async startServerProcess(projectPath) {
        // import only when a D file is opened.
        const { installServeD: installServeD  } = await (parcelRequire("4lHpq"));
        const serveDPath = await installServeD();
        const serveD = super.spawn(serveDPath, [
            "--require",
            "workspaces"
        ], {
            cwd: projectPath
        });
        return serveD;
    }
}
module.exports = new $ac7603b3a1549a05$var$DLanguageClient();


//# sourceMappingURL=ide-d.js.map
