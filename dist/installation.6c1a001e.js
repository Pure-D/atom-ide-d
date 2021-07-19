var $h8yOX$path = require("path");
var $h8yOX$child_process = require("child_process");
var $h8yOX$util = require("util");
var $h8yOX$fs = require("fs");
var $h8yOX$assert = require("assert");
var $h8yOX$constants = require("constants");
var $h8yOX$stream = require("stream");

function $parcel$export(e, n, v, s) {
  Object.defineProperty(e, n, {get: v, set: s, enumerable: true, configurable: true});
}
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
var parcelRequire = $parcel$global["parcelRequireaf25"];
parcelRequire.register("k0amS", function(module, exports) {

$parcel$export(module.exports, "installServeD", () => $908aa6dcbfe54cf9$export$5109a6445e36b1c);

var $5WtqB = parcelRequire("5WtqB");



const $908aa6dcbfe54cf9$var$execFile = $h8yOX$util.promisify($h8yOX$child_process.execFile);
async function $908aa6dcbfe54cf9$var$getCodeDBinFolder() {
    const home = process.env.HOME;
    if (typeof home === "string" && home !== "" && process.platform === "linux") {
        if (await $5WtqB.pathExists($h8yOX$path.join(home, ".local", "share"))) return $h8yOX$path.join(home, ".local", "share", "code-d", "bin");
        else return $h8yOX$path.join(home, ".code-d", "bin");
    } else if (process.platform === "win32") {
        const appdata = process.env.APPDATA;
        if (typeof appdata === "string" && appdata !== "") return $h8yOX$path.join(appdata, "code-d", "bin");
    } else if (typeof home === "string" && home !== "") return $h8yOX$path.join(home, ".code-d", "bin");
    return "";
}
function $908aa6dcbfe54cf9$var$isServeDInstalled(serveDPath) {
    return $5WtqB.pathExists(serveDPath);
}
/** Get the version of serve-d */ async function $908aa6dcbfe54cf9$var$getServeDVersion(file) {
    try {
        var ref;
        const output = (await $908aa6dcbfe54cf9$var$execFile(file, [
            "--version"
        ])).stderr;
        const version = (ref = output.match(/v(\d\S*)\s/)) === null || ref === void 0 ? void 0 : ref[1];
        return version;
    } catch (e) {
        console.error(e);
        return undefined;
    }
}

/** Check if the given serve-d is up to date against the target version */ async function $908aa6dcbfe54cf9$var$isServeDUpToDate(givenFile, targetFile) {
    const semverCompare = (await (parcelRequire("8SceC"))).default;
    const [givenVersion, targetVersion] = await Promise.all([
        $908aa6dcbfe54cf9$var$getServeDVersion(givenFile),
        $908aa6dcbfe54cf9$var$getServeDVersion(targetFile)
    ]);
    if (typeof givenVersion === "string" && typeof targetVersion === "string" && givenVersion !== "" && targetVersion !== "") return semverCompare(givenVersion, targetVersion) !== -1;
    else // assume given version is old
    return false;
}

async function $908aa6dcbfe54cf9$var$copyServeD(bundledServerFolder, codeDBinFolder) {
    const { copy: copy  } = await Promise.resolve((parcelRequire("5WtqB")));
    atom.notifications.addInfo("Installing/Updating D servers...");
    // copy the whole served folder
    await copy(bundledServerFolder, codeDBinFolder, {
        overwrite: true
    });
    atom.notifications.addSuccess("D servers was installed/updated");
}
async function $908aa6dcbfe54cf9$export$5109a6445e36b1c() {
    const distFolder = $h8yOX$path.join($h8yOX$path.dirname(__dirname), "dist");
    const exeExtention = process.platform === "win32" ? ".exe" : "";
    const serveDExeFileName = `serve-d${exeExtention}`;
    const bundledServerFolder = $h8yOX$path.join(distFolder, `${process.platform}-${process.arch}`);
    const codeDBinFolder = await $908aa6dcbfe54cf9$var$getCodeDBinFolder();
    const serveDPath = $h8yOX$path.join(codeDBinFolder, serveDExeFileName);
    if (bundledServerFolder) {
        const bundledServeDPath = $h8yOX$path.join(bundledServerFolder, serveDExeFileName);
        if (!await $908aa6dcbfe54cf9$var$isServeDInstalled(serveDPath) || !await $908aa6dcbfe54cf9$var$isServeDUpToDate(serveDPath, bundledServeDPath)) await $908aa6dcbfe54cf9$var$copyServeD(bundledServerFolder, codeDBinFolder);
    } else if (!await $908aa6dcbfe54cf9$var$isServeDInstalled(serveDPath)) atom.notifications.addError(`serve-d binary is not available for ${process.platform}.\n        Please built it from the source, place it under ${codeDBinFolder}, and restart Atom.`);
    return serveDPath;
}

});
parcelRequire.register("5WtqB", function(module, exports) {
'use strict';












module.exports = {
    // Export promiseified graceful-fs:
    ...(parcelRequire("h7EPZ")),
    // Export extra methods:
    ...(parcelRequire("gySiv")),
    ...(parcelRequire("6GZp3")),
    ...(parcelRequire("lEyvM")),
    ...(parcelRequire("6bgEx")),
    ...(parcelRequire("hXbg4")),
    ...(parcelRequire("7xD7Q")),
    ...(parcelRequire("28kQ1")),
    ...(parcelRequire("fX234")),
    ...(parcelRequire("6rjNo")),
    ...(parcelRequire("gNg0Y")),
    ...(parcelRequire("608Ux"))
};

});
parcelRequire.register("h7EPZ", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $c772c49bda0ab61b$require$u = $faHg1.fromCallback;

var $9f6yx = parcelRequire("9f6yx");
const $c772c49bda0ab61b$var$api = [
    'access',
    'appendFile',
    'chmod',
    'chown',
    'close',
    'copyFile',
    'fchmod',
    'fchown',
    'fdatasync',
    'fstat',
    'fsync',
    'ftruncate',
    'futimes',
    'lchmod',
    'lchown',
    'link',
    'lstat',
    'mkdir',
    'mkdtemp',
    'open',
    'opendir',
    'readdir',
    'readFile',
    'readlink',
    'realpath',
    'rename',
    'rm',
    'rmdir',
    'stat',
    'symlink',
    'truncate',
    'unlink',
    'utimes',
    'writeFile'
].filter((key)=>{
    // Some commands are not available on some systems. Ex:
    // fs.opendir was added in Node.js v12.12.0
    // fs.rm was added in Node.js v14.14.0
    // fs.lchown is not available on at least some Linux
    return typeof $9f6yx[key] === 'function';
});
// Export cloned fs:
Object.assign(module.exports, $9f6yx);
// Universalify async methods:
$c772c49bda0ab61b$var$api.forEach((method)=>{
    module.exports[method] = $c772c49bda0ab61b$require$u($9f6yx[method]);
});
module.exports.realpath.native = $c772c49bda0ab61b$require$u($9f6yx.realpath.native);
// We differ from mz/fs in that we still ship the old, broken, fs.exists()
// since we are a drop-in replacement for the native module
module.exports.exists = function(filename, callback) {
    if (typeof callback === 'function') return $9f6yx.exists(filename, callback);
    return new Promise((resolve)=>{
        return $9f6yx.exists(filename, resolve);
    });
};
// fs.read(), fs.write(), & fs.writev() need special treatment due to multiple callback args
module.exports.read = function(fd, buffer, offset, length, position, callback) {
    if (typeof callback === 'function') return $9f6yx.read(fd, buffer, offset, length, position, callback);
    return new Promise((resolve, reject)=>{
        $9f6yx.read(fd, buffer, offset, length, position, (err, bytesRead, buffer1)=>{
            if (err) return reject(err);
            resolve({
                bytesRead: bytesRead,
                buffer: buffer1
            });
        });
    });
};
// Function signature can be
// fs.write(fd, buffer[, offset[, length[, position]]], callback)
// OR
// fs.write(fd, string[, position[, encoding]], callback)
// We need to handle both cases, so we use ...args
module.exports.write = function(fd, buffer, ...args) {
    if (typeof args[args.length - 1] === 'function') return $9f6yx.write(fd, buffer, ...args);
    return new Promise((resolve, reject)=>{
        $9f6yx.write(fd, buffer, ...args, (err, bytesWritten, buffer1)=>{
            if (err) return reject(err);
            resolve({
                bytesWritten: bytesWritten,
                buffer: buffer1
            });
        });
    });
};
// fs.writev only available in Node v12.9.0+
if (typeof $9f6yx.writev === 'function') // Function signature is
// s.writev(fd, buffers[, position], callback)
// We need to handle the optional arg, so we use ...args
module.exports.writev = function(fd, buffers, ...args) {
    if (typeof args[args.length - 1] === 'function') return $9f6yx.writev(fd, buffers, ...args);
    return new Promise((resolve, reject)=>{
        $9f6yx.writev(fd, buffers, ...args, (err, bytesWritten, buffers1)=>{
            if (err) return reject(err);
            resolve({
                bytesWritten: bytesWritten,
                buffers: buffers1
            });
        });
    });
};

});
parcelRequire.register("faHg1", function(module, exports) {

$parcel$export(module.exports, "fromCallback", () => $b0b95839bd782608$export$d438632cc166431c, (v) => $b0b95839bd782608$export$d438632cc166431c = v);
$parcel$export(module.exports, "fromPromise", () => $b0b95839bd782608$export$f280bca05896a427, (v) => $b0b95839bd782608$export$f280bca05896a427 = v);
var $b0b95839bd782608$export$f280bca05896a427;
var $b0b95839bd782608$export$d438632cc166431c;
'use strict';
$b0b95839bd782608$export$d438632cc166431c = function(fn) {
    return Object.defineProperty(function(...args) {
        if (typeof args[args.length - 1] === 'function') fn.apply(this, args);
        else return new Promise((resolve, reject)=>{
            fn.call(this, ...args, (err, res)=>err != null ? reject(err) : resolve(res)
            );
        });
    }, 'name', {
        value: fn.name
    });
};
$b0b95839bd782608$export$f280bca05896a427 = function(fn) {
    return Object.defineProperty(function(...args) {
        const cb = args[args.length - 1];
        if (typeof cb !== 'function') return fn.apply(this, args);
        else fn.apply(this, args.slice(0, -1)).then((r)=>cb(null, r)
        , cb);
    }, 'name', {
        value: fn.name
    });
};

});

parcelRequire.register("9f6yx", function(module, exports) {


var $2CPKD = parcelRequire("2CPKD");

var $94I5P = parcelRequire("94I5P");

var $cyORG = parcelRequire("cyORG");

/* istanbul ignore next - node 0.x polyfill */ var $6baa99a533e6f947$var$gracefulQueue;
var $6baa99a533e6f947$var$previousSymbol;
/* istanbul ignore else - node 0.x polyfill */ if (typeof Symbol === 'function' && typeof Symbol.for === 'function') {
    $6baa99a533e6f947$var$gracefulQueue = Symbol.for('graceful-fs.queue');
    // This is used in testing by future versions
    $6baa99a533e6f947$var$previousSymbol = Symbol.for('graceful-fs.previous');
} else {
    $6baa99a533e6f947$var$gracefulQueue = '___graceful-fs.queue';
    $6baa99a533e6f947$var$previousSymbol = '___graceful-fs.previous';
}
function $6baa99a533e6f947$var$noop() {
}
function $6baa99a533e6f947$var$publishQueue(context, queue) {
    Object.defineProperty(context, $6baa99a533e6f947$var$gracefulQueue, {
        get: function() {
            return queue;
        }
    });
}
var $6baa99a533e6f947$var$debug = $6baa99a533e6f947$var$noop;
if ($h8yOX$util.debuglog) $6baa99a533e6f947$var$debug = $h8yOX$util.debuglog('gfs4');
else if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) $6baa99a533e6f947$var$debug = function() {
    var m = $h8yOX$util.format.apply($h8yOX$util, arguments);
    m = 'GFS4: ' + m.split(/\n/).join('\nGFS4: ');
    console.error(m);
};

// Once time initialization
if (!$h8yOX$fs[$6baa99a533e6f947$var$gracefulQueue]) {
    // This queue can be shared by multiple loaded instances
    var $6baa99a533e6f947$var$queue = $parcel$global[$6baa99a533e6f947$var$gracefulQueue] || [];
    $6baa99a533e6f947$var$publishQueue($h8yOX$fs, $6baa99a533e6f947$var$queue);
    // Patch fs.close/closeSync to shared queue version, because we need
    // to retry() whenever a close happens *anywhere* in the program.
    // This is essential when multiple graceful-fs instances are
    // in play at the same time.
    $h8yOX$fs.close = (function(fs$close) {
        function close(fd, cb) {
            return fs$close.call($h8yOX$fs, fd, function(err) {
                // This function uses the graceful-fs shared queue
                if (!err) $6baa99a533e6f947$var$retry();
                if (typeof cb === 'function') cb.apply(this, arguments);
            });
        }
        Object.defineProperty(close, $6baa99a533e6f947$var$previousSymbol, {
            value: fs$close
        });
        return close;
    })($h8yOX$fs.close);
    $h8yOX$fs.closeSync = (function(fs$closeSync) {
        function closeSync(fd) {
            // This function uses the graceful-fs shared queue
            fs$closeSync.apply($h8yOX$fs, arguments);
            $6baa99a533e6f947$var$retry();
        }
        Object.defineProperty(closeSync, $6baa99a533e6f947$var$previousSymbol, {
            value: fs$closeSync
        });
        return closeSync;
    })($h8yOX$fs.closeSync);
    if (/\bgfs4\b/i.test(process.env.NODE_DEBUG || '')) process.on('exit', function() {
        $6baa99a533e6f947$var$debug($h8yOX$fs[$6baa99a533e6f947$var$gracefulQueue]);
        $h8yOX$assert.equal($h8yOX$fs[$6baa99a533e6f947$var$gracefulQueue].length, 0);
    });
}
if (!$parcel$global[$6baa99a533e6f947$var$gracefulQueue]) $6baa99a533e6f947$var$publishQueue($parcel$global, $h8yOX$fs[$6baa99a533e6f947$var$gracefulQueue]);
module.exports = $6baa99a533e6f947$var$patch($cyORG($h8yOX$fs));
if (process.env.TEST_GRACEFUL_FS_GLOBAL_PATCH && !$h8yOX$fs.__patched) {
    module.exports = $6baa99a533e6f947$var$patch($h8yOX$fs);
    $h8yOX$fs.__patched = true;
}
function $6baa99a533e6f947$var$patch(fs) {
    // Everything that references the open() function needs to be in here
    $2CPKD(fs);
    fs.gracefulify = $6baa99a533e6f947$var$patch;
    fs.createReadStream = createReadStream;
    fs.createWriteStream = createWriteStream;
    var fs$readFile = fs.readFile;
    fs.readFile = readFile;
    function readFile(path, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        function go$readFile(path1, options1, cb1) {
            return fs$readFile(path1, options1, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $6baa99a533e6f947$var$enqueue([
                    go$readFile,
                    [
                        path1,
                        options1,
                        cb1
                    ]
                ]);
                else {
                    if (typeof cb1 === 'function') cb1.apply(this, arguments);
                    $6baa99a533e6f947$var$retry();
                }
            });
        }
        return go$readFile(path, options, cb);
    }
    var fs$writeFile = fs.writeFile;
    fs.writeFile = writeFile;
    function writeFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        function go$writeFile(path1, data1, options1, cb1) {
            return fs$writeFile(path1, data1, options1, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $6baa99a533e6f947$var$enqueue([
                    go$writeFile,
                    [
                        path1,
                        data1,
                        options1,
                        cb1
                    ]
                ]);
                else {
                    if (typeof cb1 === 'function') cb1.apply(this, arguments);
                    $6baa99a533e6f947$var$retry();
                }
            });
        }
        return go$writeFile(path, data, options, cb);
    }
    var fs$appendFile = fs.appendFile;
    if (fs$appendFile) fs.appendFile = appendFile;
    function appendFile(path, data, options, cb) {
        if (typeof options === 'function') cb = options, options = null;
        function go$appendFile(path1, data1, options1, cb1) {
            return fs$appendFile(path1, data1, options1, function(err) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $6baa99a533e6f947$var$enqueue([
                    go$appendFile,
                    [
                        path1,
                        data1,
                        options1,
                        cb1
                    ]
                ]);
                else {
                    if (typeof cb1 === 'function') cb1.apply(this, arguments);
                    $6baa99a533e6f947$var$retry();
                }
            });
        }
        return go$appendFile(path, data, options, cb);
    }
    var fs$copyFile = fs.copyFile;
    if (fs$copyFile) fs.copyFile = copyFile;
    function copyFile(src, dest, flags, cb) {
        if (typeof flags === 'function') {
            cb = flags;
            flags = 0;
        }
        return fs$copyFile(src, dest, flags, function(err) {
            if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $6baa99a533e6f947$var$enqueue([
                fs$copyFile,
                [
                    src,
                    dest,
                    flags,
                    cb
                ]
            ]);
            else {
                if (typeof cb === 'function') cb.apply(this, arguments);
                $6baa99a533e6f947$var$retry();
            }
        });
    }
    var fs$readdir = fs.readdir;
    fs.readdir = readdir;
    function readdir(path, options, cb) {
        var args = [
            path
        ];
        if (typeof options !== 'function') args.push(options);
        else cb = options;
        args.push(go$readdir$cb);
        function go$readdir$cb(err, files) {
            if (files && files.sort) files.sort();
            if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $6baa99a533e6f947$var$enqueue([
                go$readdir,
                [
                    args
                ]
            ]);
            else {
                if (typeof cb === 'function') cb.apply(this, arguments);
                $6baa99a533e6f947$var$retry();
            }
        }
        return go$readdir(args);
    }
    function go$readdir(args) {
        return fs$readdir.apply(fs, args);
    }
    if (process.version.substr(0, 4) === 'v0.8') {
        var legStreams = $94I5P(fs);
        ReadStream = legStreams.ReadStream;
        WriteStream = legStreams.WriteStream;
    }
    var fs$ReadStream = fs.ReadStream;
    if (fs$ReadStream) {
        ReadStream.prototype = Object.create(fs$ReadStream.prototype);
        ReadStream.prototype.open = ReadStream$open;
    }
    var fs$WriteStream = fs.WriteStream;
    if (fs$WriteStream) {
        WriteStream.prototype = Object.create(fs$WriteStream.prototype);
        WriteStream.prototype.open = WriteStream$open;
    }
    Object.defineProperty(fs, 'ReadStream', {
        get: function() {
            return ReadStream;
        },
        set: function(val) {
            ReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(fs, 'WriteStream', {
        get: function() {
            return WriteStream;
        },
        set: function(val) {
            WriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    // legacy names
    var FileReadStream = ReadStream;
    Object.defineProperty(fs, 'FileReadStream', {
        get: function() {
            return FileReadStream;
        },
        set: function(val) {
            FileReadStream = val;
        },
        enumerable: true,
        configurable: true
    });
    var FileWriteStream = WriteStream;
    Object.defineProperty(fs, 'FileWriteStream', {
        get: function() {
            return FileWriteStream;
        },
        set: function(val) {
            FileWriteStream = val;
        },
        enumerable: true,
        configurable: true
    });
    function ReadStream(path, options) {
        if (this instanceof ReadStream) return fs$ReadStream.apply(this, arguments), this;
        else return ReadStream.apply(Object.create(ReadStream.prototype), arguments);
    }
    function ReadStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                if (that.autoClose) that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
                that.read();
            }
        });
    }
    function WriteStream(path, options) {
        if (this instanceof WriteStream) return fs$WriteStream.apply(this, arguments), this;
        else return WriteStream.apply(Object.create(WriteStream.prototype), arguments);
    }
    function WriteStream$open() {
        var that = this;
        open(that.path, that.flags, that.mode, function(err, fd) {
            if (err) {
                that.destroy();
                that.emit('error', err);
            } else {
                that.fd = fd;
                that.emit('open', fd);
            }
        });
    }
    function createReadStream(path, options) {
        return new fs.ReadStream(path, options);
    }
    function createWriteStream(path, options) {
        return new fs.WriteStream(path, options);
    }
    var fs$open = fs.open;
    fs.open = open;
    function open(path, flags, mode, cb) {
        if (typeof mode === 'function') cb = mode, mode = null;
        function go$open(path1, flags1, mode1, cb1) {
            return fs$open(path1, flags1, mode1, function(err, fd) {
                if (err && (err.code === 'EMFILE' || err.code === 'ENFILE')) $6baa99a533e6f947$var$enqueue([
                    go$open,
                    [
                        path1,
                        flags1,
                        mode1,
                        cb1
                    ]
                ]);
                else {
                    if (typeof cb1 === 'function') cb1.apply(this, arguments);
                    $6baa99a533e6f947$var$retry();
                }
            });
        }
        return go$open(path, flags, mode, cb);
    }
    return fs;
}
function $6baa99a533e6f947$var$enqueue(elem) {
    $6baa99a533e6f947$var$debug('ENQUEUE', elem[0].name, elem[1]);
    $h8yOX$fs[$6baa99a533e6f947$var$gracefulQueue].push(elem);
}
function $6baa99a533e6f947$var$retry() {
    var elem = $h8yOX$fs[$6baa99a533e6f947$var$gracefulQueue].shift();
    if (elem) {
        $6baa99a533e6f947$var$debug('RETRY', elem[0].name, elem[1]);
        elem[0].apply(null, elem[1]);
    }
}

});
parcelRequire.register("2CPKD", function(module, exports) {

var $1e97461496ea8a27$var$origCwd = process.cwd;
var $1e97461496ea8a27$var$cwd = null;
var $1e97461496ea8a27$var$platform = process.env.GRACEFUL_FS_PLATFORM || process.platform;
process.cwd = function() {
    if (!$1e97461496ea8a27$var$cwd) $1e97461496ea8a27$var$cwd = $1e97461496ea8a27$var$origCwd.call(process);
    return $1e97461496ea8a27$var$cwd;
};
try {
    process.cwd();
} catch (er) {
}
// This check is needed until node.js 12 is required
if (typeof process.chdir === 'function') {
    var $1e97461496ea8a27$var$chdir = process.chdir;
    process.chdir = function(d) {
        $1e97461496ea8a27$var$cwd = null;
        $1e97461496ea8a27$var$chdir.call(process, d);
    };
    if (Object.setPrototypeOf) Object.setPrototypeOf(process.chdir, $1e97461496ea8a27$var$chdir);
}
module.exports = $1e97461496ea8a27$var$patch;
function $1e97461496ea8a27$var$patch(fs) {
    // (re-)implement some things that are known busted or missing.
    // lchmod, broken prior to 0.6.2
    // back-port the fix here.
    if ($h8yOX$constants.hasOwnProperty('O_SYMLINK') && process.version.match(/^v0\.6\.[0-2]|^v0\.5\./)) patchLchmod(fs);
    // lutimes implementation, or no-op
    if (!fs.lutimes) patchLutimes(fs);
    // https://github.com/isaacs/node-graceful-fs/issues/4
    // Chown should not fail on einval or eperm if non-root.
    // It should not fail on enosys ever, as this just indicates
    // that a fs doesn't support the intended operation.
    fs.chown = chownFix(fs.chown);
    fs.fchown = chownFix(fs.fchown);
    fs.lchown = chownFix(fs.lchown);
    fs.chmod = chmodFix(fs.chmod);
    fs.fchmod = chmodFix(fs.fchmod);
    fs.lchmod = chmodFix(fs.lchmod);
    fs.chownSync = chownFixSync(fs.chownSync);
    fs.fchownSync = chownFixSync(fs.fchownSync);
    fs.lchownSync = chownFixSync(fs.lchownSync);
    fs.chmodSync = chmodFixSync(fs.chmodSync);
    fs.fchmodSync = chmodFixSync(fs.fchmodSync);
    fs.lchmodSync = chmodFixSync(fs.lchmodSync);
    fs.stat = statFix(fs.stat);
    fs.fstat = statFix(fs.fstat);
    fs.lstat = statFix(fs.lstat);
    fs.statSync = statFixSync(fs.statSync);
    fs.fstatSync = statFixSync(fs.fstatSync);
    fs.lstatSync = statFixSync(fs.lstatSync);
    // if lchmod/lchown do not exist, then make them no-ops
    if (!fs.lchmod) {
        fs.lchmod = function(path, mode, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchmodSync = function() {
        };
    }
    if (!fs.lchown) {
        fs.lchown = function(path, uid, gid, cb) {
            if (cb) process.nextTick(cb);
        };
        fs.lchownSync = function() {
        };
    }
    // on Windows, A/V software can lock the directory, causing this
    // to fail with an EACCES or EPERM if the directory contains newly
    // created files.  Try again on failure, for up to 60 seconds.
    // Set the timeout this long because some Windows Anti-Virus, such as Parity
    // bit9, may lock files for up to a minute, causing npm package install
    // failures. Also, take care to yield the scheduler. Windows scheduling gives
    // CPU to a busy looping process, which can cause the program causing the lock
    // contention to be starved of CPU by node, so the contention doesn't resolve.
    if ($1e97461496ea8a27$var$platform === "win32") fs.rename = (function(fs$rename) {
        return function(from, to, cb) {
            var start = Date.now();
            var backoff = 0;
            fs$rename(from, to, function CB(er) {
                if (er && (er.code === "EACCES" || er.code === "EPERM") && Date.now() - start < 60000) {
                    setTimeout(function() {
                        fs.stat(to, function(stater, st) {
                            if (stater && stater.code === "ENOENT") fs$rename(from, to, CB);
                            else cb(er);
                        });
                    }, backoff);
                    if (backoff < 100) backoff += 10;
                    return;
                }
                if (cb) cb(er);
            });
        };
    })(fs.rename);
    // if read() returns EAGAIN, then just try it again.
    fs.read = (function(fs$read) {
        function read(fd, buffer, offset, length, position, callback_) {
            var callback;
            if (callback_ && typeof callback_ === 'function') {
                var eagCounter = 0;
                callback = function(er, _, __) {
                    if (er && er.code === 'EAGAIN' && eagCounter < 10) {
                        eagCounter++;
                        return fs$read.call(fs, fd, buffer, offset, length, position, callback);
                    }
                    callback_.apply(this, arguments);
                };
            }
            return fs$read.call(fs, fd, buffer, offset, length, position, callback);
        }
        // This ensures `util.promisify` works as it does for native `fs.read`.
        if (Object.setPrototypeOf) Object.setPrototypeOf(read, fs$read);
        return read;
    })(fs.read);
    fs.readSync = (function(fs$readSync) {
        return function(fd, buffer, offset, length, position) {
            var eagCounter = 0;
            while(true)try {
                return fs$readSync.call(fs, fd, buffer, offset, length, position);
            } catch (er) {
                if (er.code === 'EAGAIN' && eagCounter < 10) {
                    eagCounter++;
                    continue;
                }
                throw er;
            }
        };
    })(fs.readSync);
    function patchLchmod(fs1) {
        fs1.lchmod = function(path, mode, callback) {
            fs1.open(path, $h8yOX$constants.O_WRONLY | $h8yOX$constants.O_SYMLINK, mode, function(err, fd) {
                if (err) {
                    if (callback) callback(err);
                    return;
                }
                // prefer to return the chmod error, if one occurs,
                // but still try to close, and report closing errors if they occur.
                fs1.fchmod(fd, mode, function(err1) {
                    fs1.close(fd, function(err2) {
                        if (callback) callback(err1 || err2);
                    });
                });
            });
        };
        fs1.lchmodSync = function(path, mode) {
            var fd = fs1.openSync(path, $h8yOX$constants.O_WRONLY | $h8yOX$constants.O_SYMLINK, mode);
            // prefer to return the chmod error, if one occurs,
            // but still try to close, and report closing errors if they occur.
            var threw = true;
            var ret;
            try {
                ret = fs1.fchmodSync(fd, mode);
                threw = false;
            } finally{
                if (threw) try {
                    fs1.closeSync(fd);
                } catch (er) {
                }
                else fs1.closeSync(fd);
            }
            return ret;
        };
    }
    function patchLutimes(fs1) {
        if ($h8yOX$constants.hasOwnProperty("O_SYMLINK")) {
            fs1.lutimes = function(path, at, mt, cb) {
                fs1.open(path, $h8yOX$constants.O_SYMLINK, function(er, fd) {
                    if (er) {
                        if (cb) cb(er);
                        return;
                    }
                    fs1.futimes(fd, at, mt, function(er1) {
                        fs1.close(fd, function(er2) {
                            if (cb) cb(er1 || er2);
                        });
                    });
                });
            };
            fs1.lutimesSync = function(path, at, mt) {
                var fd = fs1.openSync(path, $h8yOX$constants.O_SYMLINK);
                var ret;
                var threw = true;
                try {
                    ret = fs1.futimesSync(fd, at, mt);
                    threw = false;
                } finally{
                    if (threw) try {
                        fs1.closeSync(fd);
                    } catch (er) {
                    }
                    else fs1.closeSync(fd);
                }
                return ret;
            };
        } else {
            fs1.lutimes = function(_a, _b, _c, cb) {
                if (cb) process.nextTick(cb);
            };
            fs1.lutimesSync = function() {
            };
        }
    }
    function chmodFix(orig) {
        if (!orig) return orig;
        return function(target, mode, cb) {
            return orig.call(fs, target, mode, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chmodFixSync(orig) {
        if (!orig) return orig;
        return function(target, mode) {
            try {
                return orig.call(fs, target, mode);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function chownFix(orig) {
        if (!orig) return orig;
        return function(target, uid, gid, cb) {
            return orig.call(fs, target, uid, gid, function(er) {
                if (chownErOk(er)) er = null;
                if (cb) cb.apply(this, arguments);
            });
        };
    }
    function chownFixSync(orig) {
        if (!orig) return orig;
        return function(target, uid, gid) {
            try {
                return orig.call(fs, target, uid, gid);
            } catch (er) {
                if (!chownErOk(er)) throw er;
            }
        };
    }
    function statFix(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options, cb) {
            if (typeof options === 'function') {
                cb = options;
                options = null;
            }
            function callback(er, stats) {
                if (stats) {
                    if (stats.uid < 0) stats.uid += 4294967296;
                    if (stats.gid < 0) stats.gid += 4294967296;
                }
                if (cb) cb.apply(this, arguments);
            }
            return options ? orig.call(fs, target, options, callback) : orig.call(fs, target, callback);
        };
    }
    function statFixSync(orig) {
        if (!orig) return orig;
        // Older versions of Node erroneously returned signed integers for
        // uid + gid.
        return function(target, options) {
            var stats = options ? orig.call(fs, target, options) : orig.call(fs, target);
            if (stats.uid < 0) stats.uid += 4294967296;
            if (stats.gid < 0) stats.gid += 4294967296;
            return stats;
        };
    }
    // ENOSYS means that the fs doesn't support the op. Just ignore
    // that, because it doesn't matter.
    //
    // if there's no getuid, or if getuid() is something other
    // than 0, and the error is EINVAL or EPERM, then just ignore
    // it.
    //
    // This specific case is a silent failure in cp, install, tar,
    // and most other unix tools that manage permissions.
    //
    // When running as root, or if other types of errors are
    // encountered, then it's strict.
    function chownErOk(er) {
        if (!er) return true;
        if (er.code === "ENOSYS") return true;
        var nonroot = !process.getuid || process.getuid() !== 0;
        if (nonroot) {
            if (er.code === "EINVAL" || er.code === "EPERM") return true;
        }
        return false;
    }
}

});

parcelRequire.register("94I5P", function(module, exports) {

var $69b6b0bbebb36264$require$Stream = $h8yOX$stream.Stream;
module.exports = $69b6b0bbebb36264$var$legacy;
function $69b6b0bbebb36264$var$legacy(fs) {
    function ReadStream(path, options) {
        if (!(this instanceof ReadStream)) return new ReadStream(path, options);
        $69b6b0bbebb36264$require$Stream.call(this);
        var self = this;
        this.path = path;
        this.fd = null;
        this.readable = true;
        this.paused = false;
        this.flags = 'r';
        this.mode = 438; /*=0666*/ 
        this.bufferSize = 65536;
        options = options || {
        };
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.encoding) this.setEncoding(this.encoding);
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
                throw TypeError('start must be a Number');
            }
            if (this.end === undefined) {
                this.end = Infinity;
            } else if ('number' !== typeof this.end) {
                throw TypeError('end must be a Number');
            }
            if (this.start > this.end) {
                throw new Error('start must be <= end');
            }
            this.pos = this.start;
        }
        if (this.fd !== null) {
            process.nextTick(function() {
                self._read();
            });
            return;
        }
        fs.open(this.path, this.flags, this.mode, function(err, fd) {
            if (err) {
                self.emit('error', err);
                self.readable = false;
                return;
            }
            self.fd = fd;
            self.emit('open', fd);
            self._read();
        });
    }
    function WriteStream(path, options) {
        if (!(this instanceof WriteStream)) return new WriteStream(path, options);
        $69b6b0bbebb36264$require$Stream.call(this);
        this.path = path;
        this.fd = null;
        this.writable = true;
        this.flags = 'w';
        this.encoding = 'binary';
        this.mode = 438; /*=0666*/ 
        this.bytesWritten = 0;
        options = options || {
        };
        // Mixin options into this
        var keys = Object.keys(options);
        for(var index = 0, length = keys.length; index < length; index++){
            var key = keys[index];
            this[key] = options[key];
        }
        if (this.start !== undefined) {
            if ('number' !== typeof this.start) {
                throw TypeError('start must be a Number');
            }
            if (this.start < 0) {
                throw new Error('start must be >= zero');
            }
            this.pos = this.start;
        }
        this.busy = false;
        this._queue = [];
        if (this.fd === null) {
            this._open = fs.open;
            this._queue.push([
                this._open,
                this.path,
                this.flags,
                this.mode,
                undefined
            ]);
            this.flush();
        }
    }
    return {
        ReadStream: ReadStream,
        WriteStream: WriteStream
    };
}

});

parcelRequire.register("cyORG", function(module, exports) {
'use strict';
module.exports = $92501db799dc546c$var$clone;
var $92501db799dc546c$var$getPrototypeOf = Object.getPrototypeOf || function(obj) {
    return obj.__proto__;
};
function $92501db799dc546c$var$clone(obj) {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Object) var copy = {
        __proto__: $92501db799dc546c$var$getPrototypeOf(obj)
    };
    else var copy = Object.create(null);
    Object.getOwnPropertyNames(obj).forEach(function(key) {
        Object.defineProperty(copy, key, Object.getOwnPropertyDescriptor(obj, key));
    });
    return copy;
}

});



parcelRequire.register("gySiv", function(module, exports) {
'use strict';

module.exports = {
    copySync: (parcelRequire("b2fve"))
};

});
parcelRequire.register("b2fve", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");


var $7xD7Q = parcelRequire("7xD7Q");
var $808be8249dc19633$require$mkdirsSync = $7xD7Q.mkdirsSync;

var $f11ZI = parcelRequire("f11ZI");
var $808be8249dc19633$require$utimesMillisSync = $f11ZI.utimesMillisSync;

var $c2Ond = parcelRequire("c2Ond");
function $808be8249dc19633$var$copySync(src, dest, opts) {
    if (typeof opts === 'function') opts = {
        filter: opts
    };
    opts = opts || {
    };
    opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now
    ;
    opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber
    ;
    // Warn about using preserveTimestamps on 32-bit node
    if (opts.preserveTimestamps && process.arch === 'ia32') console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269`);
    const { srcStat: srcStat , destStat: destStat  } = $c2Ond.checkPathsSync(src, dest, 'copy', opts);
    $c2Ond.checkParentPathsSync(src, srcStat, dest, 'copy');
    return $808be8249dc19633$var$handleFilterAndCopy(destStat, src, dest, opts);
}
function $808be8249dc19633$var$handleFilterAndCopy(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest)) return;
    const destParent = $h8yOX$path.dirname(dest);
    if (!$9f6yx.existsSync(destParent)) $808be8249dc19633$require$mkdirsSync(destParent);
    return $808be8249dc19633$var$getStats(destStat, src, dest, opts);
}
function $808be8249dc19633$var$startCopy(destStat, src, dest, opts) {
    if (opts.filter && !opts.filter(src, dest)) return;
    return $808be8249dc19633$var$getStats(destStat, src, dest, opts);
}
function $808be8249dc19633$var$getStats(destStat, src, dest, opts) {
    const statSync = opts.dereference ? $9f6yx.statSync : $9f6yx.lstatSync;
    const srcStat = statSync(src);
    if (srcStat.isDirectory()) return $808be8249dc19633$var$onDir(srcStat, destStat, src, dest, opts);
    else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return $808be8249dc19633$var$onFile(srcStat, destStat, src, dest, opts);
    else if (srcStat.isSymbolicLink()) return $808be8249dc19633$var$onLink(destStat, src, dest, opts);
    else if (srcStat.isSocket()) throw new Error(`Cannot copy a socket file: ${src}`);
    else if (srcStat.isFIFO()) throw new Error(`Cannot copy a FIFO pipe: ${src}`);
    throw new Error(`Unknown file: ${src}`);
}
function $808be8249dc19633$var$onFile(srcStat, destStat, src, dest, opts) {
    if (!destStat) return $808be8249dc19633$var$copyFile(srcStat, src, dest, opts);
    return $808be8249dc19633$var$mayCopyFile(srcStat, src, dest, opts);
}
function $808be8249dc19633$var$mayCopyFile(srcStat, src, dest, opts) {
    if (opts.overwrite) {
        $9f6yx.unlinkSync(dest);
        return $808be8249dc19633$var$copyFile(srcStat, src, dest, opts);
    } else if (opts.errorOnExist) throw new Error(`'${dest}' already exists`);
}
function $808be8249dc19633$var$copyFile(srcStat, src, dest, opts) {
    $9f6yx.copyFileSync(src, dest);
    if (opts.preserveTimestamps) $808be8249dc19633$var$handleTimestamps(srcStat.mode, src, dest);
    return $808be8249dc19633$var$setDestMode(dest, srcStat.mode);
}
function $808be8249dc19633$var$handleTimestamps(srcMode, src, dest) {
    // Make sure the file is writable before setting the timestamp
    // otherwise open fails with EPERM when invoked with 'r+'
    // (through utimes call)
    if ($808be8249dc19633$var$fileIsNotWritable(srcMode)) $808be8249dc19633$var$makeFileWritable(dest, srcMode);
    return $808be8249dc19633$var$setDestTimestamps(src, dest);
}
function $808be8249dc19633$var$fileIsNotWritable(srcMode) {
    return (srcMode & 128) === 0;
}
function $808be8249dc19633$var$makeFileWritable(dest, srcMode) {
    return $808be8249dc19633$var$setDestMode(dest, srcMode | 128);
}
function $808be8249dc19633$var$setDestMode(dest, srcMode) {
    return $9f6yx.chmodSync(dest, srcMode);
}
function $808be8249dc19633$var$setDestTimestamps(src, dest) {
    // The initial srcStat.atime cannot be trusted
    // because it is modified by the read(2) system call
    // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
    const updatedSrcStat = $9f6yx.statSync(src);
    return $808be8249dc19633$require$utimesMillisSync(dest, updatedSrcStat.atime, updatedSrcStat.mtime);
}
function $808be8249dc19633$var$onDir(srcStat, destStat, src, dest, opts) {
    if (!destStat) return $808be8249dc19633$var$mkDirAndCopy(srcStat.mode, src, dest, opts);
    return $808be8249dc19633$var$copyDir(src, dest, opts);
}
function $808be8249dc19633$var$mkDirAndCopy(srcMode, src, dest, opts) {
    $9f6yx.mkdirSync(dest);
    $808be8249dc19633$var$copyDir(src, dest, opts);
    return $808be8249dc19633$var$setDestMode(dest, srcMode);
}
function $808be8249dc19633$var$copyDir(src, dest, opts) {
    $9f6yx.readdirSync(src).forEach((item)=>$808be8249dc19633$var$copyDirItem(item, src, dest, opts)
    );
}
function $808be8249dc19633$var$copyDirItem(item, src, dest, opts) {
    const srcItem = $h8yOX$path.join(src, item);
    const destItem = $h8yOX$path.join(dest, item);
    const { destStat: destStat  } = $c2Ond.checkPathsSync(srcItem, destItem, 'copy', opts);
    return $808be8249dc19633$var$startCopy(destStat, srcItem, destItem, opts);
}
function $808be8249dc19633$var$onLink(destStat, src, dest, opts) {
    let resolvedSrc = $9f6yx.readlinkSync(src);
    if (opts.dereference) resolvedSrc = $h8yOX$path.resolve(process.cwd(), resolvedSrc);
    if (!destStat) return $9f6yx.symlinkSync(resolvedSrc, dest);
    else {
        let resolvedDest;
        try {
            resolvedDest = $9f6yx.readlinkSync(dest);
        } catch (err) {
            // dest exists and is a regular file or directory,
            // Windows may throw UNKNOWN error. If dest already exists,
            // fs throws error anyway, so no need to guard against it here.
            if (err.code === 'EINVAL' || err.code === 'UNKNOWN') return $9f6yx.symlinkSync(resolvedSrc, dest);
            throw err;
        }
        if (opts.dereference) resolvedDest = $h8yOX$path.resolve(process.cwd(), resolvedDest);
        if ($c2Ond.isSrcSubdir(resolvedSrc, resolvedDest)) throw new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`);
        // prevent copy if src is a subdir of dest since unlinking
        // dest in this case would result in removing src contents
        // and therefore a broken symlink would be created.
        if ($9f6yx.statSync(dest).isDirectory() && $c2Ond.isSrcSubdir(resolvedDest, resolvedSrc)) throw new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`);
        return $808be8249dc19633$var$copyLink(resolvedSrc, dest);
    }
}
function $808be8249dc19633$var$copyLink(resolvedSrc, dest) {
    $9f6yx.unlinkSync(dest);
    return $9f6yx.symlinkSync(resolvedSrc, dest);
}
module.exports = $808be8249dc19633$var$copySync;

});
parcelRequire.register("7xD7Q", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $57d9f6f9d75b89b3$require$u = $faHg1.fromPromise;

var $7Brwk = parcelRequire("7Brwk");
var $57d9f6f9d75b89b3$require$_makeDir = $7Brwk.makeDir;
var $57d9f6f9d75b89b3$require$makeDirSync = $7Brwk.makeDirSync;
const $57d9f6f9d75b89b3$var$makeDir = $57d9f6f9d75b89b3$require$u($57d9f6f9d75b89b3$require$_makeDir);
module.exports = {
    mkdirs: $57d9f6f9d75b89b3$var$makeDir,
    mkdirsSync: $57d9f6f9d75b89b3$require$makeDirSync,
    // alias
    mkdirp: $57d9f6f9d75b89b3$var$makeDir,
    mkdirpSync: $57d9f6f9d75b89b3$require$makeDirSync,
    ensureDir: $57d9f6f9d75b89b3$var$makeDir,
    ensureDirSync: $57d9f6f9d75b89b3$require$makeDirSync
};

});
parcelRequire.register("7Brwk", function(module, exports) {

$parcel$export(module.exports, "makeDirSync", () => $589156154858e472$export$625153d8bbae2cbd, (v) => $589156154858e472$export$625153d8bbae2cbd = v);
$parcel$export(module.exports, "makeDir", () => $589156154858e472$export$8e31fb5575eb7e8a, (v) => $589156154858e472$export$8e31fb5575eb7e8a = v);
var $589156154858e472$export$8e31fb5575eb7e8a;
var $589156154858e472$export$625153d8bbae2cbd;
'use strict';

var $h7EPZ = parcelRequire("h7EPZ");

var $9CRF7 = parcelRequire("9CRF7");
var $589156154858e472$require$checkPath = $9CRF7.checkPath;
const $589156154858e472$var$getMode = (options)=>{
    const defaults = {
        mode: 511
    };
    if (typeof options === 'number') return options;
    return ({
        ...defaults,
        ...options
    }).mode;
};
$589156154858e472$export$8e31fb5575eb7e8a = async (dir, options)=>{
    $589156154858e472$require$checkPath(dir);
    return $h7EPZ.mkdir(dir, {
        mode: $589156154858e472$var$getMode(options),
        recursive: true
    });
};
$589156154858e472$export$625153d8bbae2cbd = (dir, options)=>{
    $589156154858e472$require$checkPath(dir);
    return $h7EPZ.mkdirSync(dir, {
        mode: $589156154858e472$var$getMode(options),
        recursive: true
    });
};

});
parcelRequire.register("9CRF7", function(module, exports) {

$parcel$export(module.exports, "checkPath", () => $702149dbae49c5fd$export$147090cb1098a1ae, (v) => $702149dbae49c5fd$export$147090cb1098a1ae = v);
// Adapted from https://github.com/sindresorhus/make-dir
// Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)
// Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
// The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
var $702149dbae49c5fd$export$147090cb1098a1ae;
'use strict';

// https://github.com/nodejs/node/issues/8987
// https://github.com/libuv/libuv/pull/1088
$702149dbae49c5fd$export$147090cb1098a1ae = function checkPath(pth) {
    if (process.platform === 'win32') {
        const pathHasInvalidWinCharacters = /[<>:"|?*]/.test(pth.replace($h8yOX$path.parse(pth).root, ''));
        if (pathHasInvalidWinCharacters) {
            const error = new Error(`Path contains invalid characters: ${pth}`);
            error.code = 'EINVAL';
            throw error;
        }
    }
};

});



parcelRequire.register("f11ZI", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");
function $aee87f0c41c626c1$var$utimesMillis(path, atime, mtime, callback) {
    // if (!HAS_MILLIS_RES) return fs.utimes(path, atime, mtime, callback)
    $9f6yx.open(path, 'r+', (err, fd)=>{
        if (err) return callback(err);
        $9f6yx.futimes(fd, atime, mtime, (futimesErr)=>{
            $9f6yx.close(fd, (closeErr)=>{
                if (callback) callback(futimesErr || closeErr);
            });
        });
    });
}
function $aee87f0c41c626c1$var$utimesMillisSync(path, atime, mtime) {
    const fd = $9f6yx.openSync(path, 'r+');
    $9f6yx.futimesSync(fd, atime, mtime);
    return $9f6yx.closeSync(fd);
}
module.exports = {
    utimesMillis: $aee87f0c41c626c1$var$utimesMillis,
    utimesMillisSync: $aee87f0c41c626c1$var$utimesMillisSync
};

});

parcelRequire.register("c2Ond", function(module, exports) {
'use strict';

var $h7EPZ = parcelRequire("h7EPZ");


function $8c4cbf0f25ee0fa3$var$getStats(src, dest, opts) {
    const statFunc = opts.dereference ? (file)=>$h7EPZ.stat(file, {
            bigint: true
        })
     : (file)=>$h7EPZ.lstat(file, {
            bigint: true
        })
    ;
    return Promise.all([
        statFunc(src),
        statFunc(dest).catch((err)=>{
            if (err.code === 'ENOENT') return null;
            throw err;
        })
    ]).then(([srcStat, destStat])=>({
            srcStat: srcStat,
            destStat: destStat
        })
    );
}
function $8c4cbf0f25ee0fa3$var$getStatsSync(src, dest, opts) {
    let destStat;
    const statFunc = opts.dereference ? (file)=>$h7EPZ.statSync(file, {
            bigint: true
        })
     : (file)=>$h7EPZ.lstatSync(file, {
            bigint: true
        })
    ;
    const srcStat = statFunc(src);
    try {
        destStat = statFunc(dest);
    } catch (err) {
        if (err.code === 'ENOENT') return {
            srcStat: srcStat,
            destStat: null
        };
        throw err;
    }
    return {
        srcStat: srcStat,
        destStat: destStat
    };
}
function $8c4cbf0f25ee0fa3$var$checkPaths(src, dest, funcName, opts, cb) {
    $h8yOX$util.callbackify($8c4cbf0f25ee0fa3$var$getStats)(src, dest, opts, (err, stats)=>{
        if (err) return cb(err);
        const { srcStat: srcStat , destStat: destStat  } = stats;
        if (destStat) {
            if ($8c4cbf0f25ee0fa3$var$areIdentical(srcStat, destStat)) {
                const srcBaseName = $h8yOX$path.basename(src);
                const destBaseName = $h8yOX$path.basename(dest);
                if (funcName === 'move' && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) return cb(null, {
                    srcStat: srcStat,
                    destStat: destStat,
                    isChangingCase: true
                });
                return cb(new Error('Source and destination must not be the same.'));
            }
            if (srcStat.isDirectory() && !destStat.isDirectory()) return cb(new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`));
            if (!srcStat.isDirectory() && destStat.isDirectory()) return cb(new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`));
        }
        if (srcStat.isDirectory() && $8c4cbf0f25ee0fa3$var$isSrcSubdir(src, dest)) return cb(new Error($8c4cbf0f25ee0fa3$var$errMsg(src, dest, funcName)));
        return cb(null, {
            srcStat: srcStat,
            destStat: destStat
        });
    });
}
function $8c4cbf0f25ee0fa3$var$checkPathsSync(src, dest, funcName, opts) {
    const { srcStat: srcStat , destStat: destStat  } = $8c4cbf0f25ee0fa3$var$getStatsSync(src, dest, opts);
    if (destStat) {
        if ($8c4cbf0f25ee0fa3$var$areIdentical(srcStat, destStat)) {
            const srcBaseName = $h8yOX$path.basename(src);
            const destBaseName = $h8yOX$path.basename(dest);
            if (funcName === 'move' && srcBaseName !== destBaseName && srcBaseName.toLowerCase() === destBaseName.toLowerCase()) return {
                srcStat: srcStat,
                destStat: destStat,
                isChangingCase: true
            };
            throw new Error('Source and destination must not be the same.');
        }
        if (srcStat.isDirectory() && !destStat.isDirectory()) throw new Error(`Cannot overwrite non-directory '${dest}' with directory '${src}'.`);
        if (!srcStat.isDirectory() && destStat.isDirectory()) throw new Error(`Cannot overwrite directory '${dest}' with non-directory '${src}'.`);
    }
    if (srcStat.isDirectory() && $8c4cbf0f25ee0fa3$var$isSrcSubdir(src, dest)) throw new Error($8c4cbf0f25ee0fa3$var$errMsg(src, dest, funcName));
    return {
        srcStat: srcStat,
        destStat: destStat
    };
}
// recursively check if dest parent is a subdirectory of src.
// It works for all file types including symlinks since it
// checks the src and dest inodes. It starts from the deepest
// parent and stops once it reaches the src parent or the root path.
function $8c4cbf0f25ee0fa3$var$checkParentPaths(src, srcStat, dest, funcName, cb) {
    const srcParent = $h8yOX$path.resolve($h8yOX$path.dirname(src));
    const destParent = $h8yOX$path.resolve($h8yOX$path.dirname(dest));
    if (destParent === srcParent || destParent === $h8yOX$path.parse(destParent).root) return cb();
    $h7EPZ.stat(destParent, {
        bigint: true
    }, (err, destStat)=>{
        if (err) {
            if (err.code === 'ENOENT') return cb();
            return cb(err);
        }
        if ($8c4cbf0f25ee0fa3$var$areIdentical(srcStat, destStat)) return cb(new Error($8c4cbf0f25ee0fa3$var$errMsg(src, dest, funcName)));
        return $8c4cbf0f25ee0fa3$var$checkParentPaths(src, srcStat, destParent, funcName, cb);
    });
}
function $8c4cbf0f25ee0fa3$var$checkParentPathsSync(src, srcStat, dest, funcName) {
    const srcParent = $h8yOX$path.resolve($h8yOX$path.dirname(src));
    const destParent = $h8yOX$path.resolve($h8yOX$path.dirname(dest));
    if (destParent === srcParent || destParent === $h8yOX$path.parse(destParent).root) return;
    let destStat;
    try {
        destStat = $h7EPZ.statSync(destParent, {
            bigint: true
        });
    } catch (err) {
        if (err.code === 'ENOENT') return;
        throw err;
    }
    if ($8c4cbf0f25ee0fa3$var$areIdentical(srcStat, destStat)) throw new Error($8c4cbf0f25ee0fa3$var$errMsg(src, dest, funcName));
    return $8c4cbf0f25ee0fa3$var$checkParentPathsSync(src, srcStat, destParent, funcName);
}
function $8c4cbf0f25ee0fa3$var$areIdentical(srcStat, destStat) {
    return destStat.ino && destStat.dev && destStat.ino === srcStat.ino && destStat.dev === srcStat.dev;
}
// return true if dest is a subdir of src, otherwise false.
// It only checks the path strings.
function $8c4cbf0f25ee0fa3$var$isSrcSubdir(src, dest) {
    const srcArr = $h8yOX$path.resolve(src).split($h8yOX$path.sep).filter((i)=>i
    );
    const destArr = $h8yOX$path.resolve(dest).split($h8yOX$path.sep).filter((i)=>i
    );
    return srcArr.reduce((acc, cur, i)=>acc && destArr[i] === cur
    , true);
}
function $8c4cbf0f25ee0fa3$var$errMsg(src, dest, funcName) {
    return `Cannot ${funcName} '${src}' to a subdirectory of itself, '${dest}'.`;
}
module.exports = {
    checkPaths: $8c4cbf0f25ee0fa3$var$checkPaths,
    checkPathsSync: $8c4cbf0f25ee0fa3$var$checkPathsSync,
    checkParentPaths: $8c4cbf0f25ee0fa3$var$checkParentPaths,
    checkParentPathsSync: $8c4cbf0f25ee0fa3$var$checkParentPathsSync,
    isSrcSubdir: $8c4cbf0f25ee0fa3$var$isSrcSubdir,
    areIdentical: $8c4cbf0f25ee0fa3$var$areIdentical
};

});



parcelRequire.register("6GZp3", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $4df64bb90cb6f8c8$require$u = $faHg1.fromCallback;

module.exports = {
    copy: $4df64bb90cb6f8c8$require$u((parcelRequire("d6zq3")))
};

});
parcelRequire.register("d6zq3", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");


var $7xD7Q = parcelRequire("7xD7Q");
var $98a74f712a0eba6d$require$mkdirs = $7xD7Q.mkdirs;

var $gNg0Y = parcelRequire("gNg0Y");
var $98a74f712a0eba6d$require$pathExists = $gNg0Y.pathExists;

var $f11ZI = parcelRequire("f11ZI");
var $98a74f712a0eba6d$require$utimesMillis = $f11ZI.utimesMillis;

var $c2Ond = parcelRequire("c2Ond");
function $98a74f712a0eba6d$var$copy(src, dest, opts, cb) {
    if (typeof opts === 'function' && !cb) {
        cb = opts;
        opts = {
        };
    } else if (typeof opts === 'function') opts = {
        filter: opts
    };
    cb = cb || function() {
    };
    opts = opts || {
    };
    opts.clobber = 'clobber' in opts ? !!opts.clobber : true // default to true for now
    ;
    opts.overwrite = 'overwrite' in opts ? !!opts.overwrite : opts.clobber // overwrite falls back to clobber
    ;
    // Warn about using preserveTimestamps on 32-bit node
    if (opts.preserveTimestamps && process.arch === 'ia32') console.warn(`fs-extra: Using the preserveTimestamps option in 32-bit node is not recommended;\n\n    see https://github.com/jprichardson/node-fs-extra/issues/269`);
    $c2Ond.checkPaths(src, dest, 'copy', opts, (err, stats)=>{
        if (err) return cb(err);
        const { srcStat: srcStat , destStat: destStat  } = stats;
        $c2Ond.checkParentPaths(src, srcStat, dest, 'copy', (err1)=>{
            if (err1) return cb(err1);
            if (opts.filter) return $98a74f712a0eba6d$var$handleFilter($98a74f712a0eba6d$var$checkParentDir, destStat, src, dest, opts, cb);
            return $98a74f712a0eba6d$var$checkParentDir(destStat, src, dest, opts, cb);
        });
    });
}
function $98a74f712a0eba6d$var$checkParentDir(destStat, src, dest, opts, cb) {
    const destParent = $h8yOX$path.dirname(dest);
    $98a74f712a0eba6d$require$pathExists(destParent, (err, dirExists)=>{
        if (err) return cb(err);
        if (dirExists) return $98a74f712a0eba6d$var$getStats(destStat, src, dest, opts, cb);
        $98a74f712a0eba6d$require$mkdirs(destParent, (err1)=>{
            if (err1) return cb(err1);
            return $98a74f712a0eba6d$var$getStats(destStat, src, dest, opts, cb);
        });
    });
}
function $98a74f712a0eba6d$var$handleFilter(onInclude, destStat, src, dest, opts, cb) {
    Promise.resolve(opts.filter(src, dest)).then((include)=>{
        if (include) return onInclude(destStat, src, dest, opts, cb);
        return cb();
    }, (error)=>cb(error)
    );
}
function $98a74f712a0eba6d$var$startCopy(destStat, src, dest, opts, cb) {
    if (opts.filter) return $98a74f712a0eba6d$var$handleFilter($98a74f712a0eba6d$var$getStats, destStat, src, dest, opts, cb);
    return $98a74f712a0eba6d$var$getStats(destStat, src, dest, opts, cb);
}
function $98a74f712a0eba6d$var$getStats(destStat, src, dest, opts, cb) {
    const stat = opts.dereference ? $9f6yx.stat : $9f6yx.lstat;
    stat(src, (err, srcStat)=>{
        if (err) return cb(err);
        if (srcStat.isDirectory()) return $98a74f712a0eba6d$var$onDir(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isFile() || srcStat.isCharacterDevice() || srcStat.isBlockDevice()) return $98a74f712a0eba6d$var$onFile(srcStat, destStat, src, dest, opts, cb);
        else if (srcStat.isSymbolicLink()) return $98a74f712a0eba6d$var$onLink(destStat, src, dest, opts, cb);
        else if (srcStat.isSocket()) return cb(new Error(`Cannot copy a socket file: ${src}`));
        else if (srcStat.isFIFO()) return cb(new Error(`Cannot copy a FIFO pipe: ${src}`));
        return cb(new Error(`Unknown file: ${src}`));
    });
}
function $98a74f712a0eba6d$var$onFile(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat) return $98a74f712a0eba6d$var$copyFile(srcStat, src, dest, opts, cb);
    return $98a74f712a0eba6d$var$mayCopyFile(srcStat, src, dest, opts, cb);
}
function $98a74f712a0eba6d$var$mayCopyFile(srcStat, src, dest, opts, cb) {
    if (opts.overwrite) $9f6yx.unlink(dest, (err)=>{
        if (err) return cb(err);
        return $98a74f712a0eba6d$var$copyFile(srcStat, src, dest, opts, cb);
    });
    else if (opts.errorOnExist) return cb(new Error(`'${dest}' already exists`));
    else return cb();
}
function $98a74f712a0eba6d$var$copyFile(srcStat, src, dest, opts, cb) {
    $9f6yx.copyFile(src, dest, (err)=>{
        if (err) return cb(err);
        if (opts.preserveTimestamps) return $98a74f712a0eba6d$var$handleTimestampsAndMode(srcStat.mode, src, dest, cb);
        return $98a74f712a0eba6d$var$setDestMode(dest, srcStat.mode, cb);
    });
}
function $98a74f712a0eba6d$var$handleTimestampsAndMode(srcMode, src, dest, cb) {
    // Make sure the file is writable before setting the timestamp
    // otherwise open fails with EPERM when invoked with 'r+'
    // (through utimes call)
    if ($98a74f712a0eba6d$var$fileIsNotWritable(srcMode)) return $98a74f712a0eba6d$var$makeFileWritable(dest, srcMode, (err)=>{
        if (err) return cb(err);
        return $98a74f712a0eba6d$var$setDestTimestampsAndMode(srcMode, src, dest, cb);
    });
    return $98a74f712a0eba6d$var$setDestTimestampsAndMode(srcMode, src, dest, cb);
}
function $98a74f712a0eba6d$var$fileIsNotWritable(srcMode) {
    return (srcMode & 128) === 0;
}
function $98a74f712a0eba6d$var$makeFileWritable(dest, srcMode, cb) {
    return $98a74f712a0eba6d$var$setDestMode(dest, srcMode | 128, cb);
}
function $98a74f712a0eba6d$var$setDestTimestampsAndMode(srcMode, src, dest, cb) {
    $98a74f712a0eba6d$var$setDestTimestamps(src, dest, (err)=>{
        if (err) return cb(err);
        return $98a74f712a0eba6d$var$setDestMode(dest, srcMode, cb);
    });
}
function $98a74f712a0eba6d$var$setDestMode(dest, srcMode, cb) {
    return $9f6yx.chmod(dest, srcMode, cb);
}
function $98a74f712a0eba6d$var$setDestTimestamps(src, dest, cb) {
    // The initial srcStat.atime cannot be trusted
    // because it is modified by the read(2) system call
    // (See https://nodejs.org/api/fs.html#fs_stat_time_values)
    $9f6yx.stat(src, (err, updatedSrcStat)=>{
        if (err) return cb(err);
        return $98a74f712a0eba6d$require$utimesMillis(dest, updatedSrcStat.atime, updatedSrcStat.mtime, cb);
    });
}
function $98a74f712a0eba6d$var$onDir(srcStat, destStat, src, dest, opts, cb) {
    if (!destStat) return $98a74f712a0eba6d$var$mkDirAndCopy(srcStat.mode, src, dest, opts, cb);
    return $98a74f712a0eba6d$var$copyDir(src, dest, opts, cb);
}
function $98a74f712a0eba6d$var$mkDirAndCopy(srcMode, src, dest, opts, cb) {
    $9f6yx.mkdir(dest, (err)=>{
        if (err) return cb(err);
        $98a74f712a0eba6d$var$copyDir(src, dest, opts, (err1)=>{
            if (err1) return cb(err1);
            return $98a74f712a0eba6d$var$setDestMode(dest, srcMode, cb);
        });
    });
}
function $98a74f712a0eba6d$var$copyDir(src, dest, opts, cb) {
    $9f6yx.readdir(src, (err, items)=>{
        if (err) return cb(err);
        return $98a74f712a0eba6d$var$copyDirItems(items, src, dest, opts, cb);
    });
}
function $98a74f712a0eba6d$var$copyDirItems(items, src, dest, opts, cb) {
    const item = items.pop();
    if (!item) return cb();
    return $98a74f712a0eba6d$var$copyDirItem(items, item, src, dest, opts, cb);
}
function $98a74f712a0eba6d$var$copyDirItem(items, item, src, dest, opts, cb) {
    const srcItem = $h8yOX$path.join(src, item);
    const destItem = $h8yOX$path.join(dest, item);
    $c2Ond.checkPaths(srcItem, destItem, 'copy', opts, (err, stats)=>{
        if (err) return cb(err);
        const { destStat: destStat  } = stats;
        $98a74f712a0eba6d$var$startCopy(destStat, srcItem, destItem, opts, (err1)=>{
            if (err1) return cb(err1);
            return $98a74f712a0eba6d$var$copyDirItems(items, src, dest, opts, cb);
        });
    });
}
function $98a74f712a0eba6d$var$onLink(destStat, src, dest, opts, cb) {
    $9f6yx.readlink(src, (err, resolvedSrc)=>{
        if (err) return cb(err);
        if (opts.dereference) resolvedSrc = $h8yOX$path.resolve(process.cwd(), resolvedSrc);
        if (!destStat) return $9f6yx.symlink(resolvedSrc, dest, cb);
        else $9f6yx.readlink(dest, (err1, resolvedDest)=>{
            if (err1) {
                // dest exists and is a regular file or directory,
                // Windows may throw UNKNOWN error. If dest already exists,
                // fs throws error anyway, so no need to guard against it here.
                if (err1.code === 'EINVAL' || err1.code === 'UNKNOWN') return $9f6yx.symlink(resolvedSrc, dest, cb);
                return cb(err1);
            }
            if (opts.dereference) resolvedDest = $h8yOX$path.resolve(process.cwd(), resolvedDest);
            if ($c2Ond.isSrcSubdir(resolvedSrc, resolvedDest)) return cb(new Error(`Cannot copy '${resolvedSrc}' to a subdirectory of itself, '${resolvedDest}'.`));
            // do not copy if src is a subdir of dest since unlinking
            // dest in this case would result in removing src contents
            // and therefore a broken symlink would be created.
            if (destStat.isDirectory() && $c2Ond.isSrcSubdir(resolvedDest, resolvedSrc)) return cb(new Error(`Cannot overwrite '${resolvedDest}' with '${resolvedSrc}'.`));
            return $98a74f712a0eba6d$var$copyLink(resolvedSrc, dest, cb);
        });
    });
}
function $98a74f712a0eba6d$var$copyLink(resolvedSrc, dest, cb) {
    $9f6yx.unlink(dest, (err)=>{
        if (err) return cb(err);
        return $9f6yx.symlink(resolvedSrc, dest, cb);
    });
}
module.exports = $98a74f712a0eba6d$var$copy;

});
parcelRequire.register("gNg0Y", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $c39da5255b7babfd$require$u = $faHg1.fromPromise;

var $h7EPZ = parcelRequire("h7EPZ");
function $c39da5255b7babfd$var$pathExists(path) {
    return $h7EPZ.access(path).then(()=>true
    ).catch(()=>false
    );
}
module.exports = {
    pathExists: $c39da5255b7babfd$require$u($c39da5255b7babfd$var$pathExists),
    pathExistsSync: $h7EPZ.existsSync
};

});



parcelRequire.register("lEyvM", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $fc381ab012947875$require$u = $faHg1.fromPromise;

var $h7EPZ = parcelRequire("h7EPZ");


var $7xD7Q = parcelRequire("7xD7Q");

var $608Ux = parcelRequire("608Ux");
const $fc381ab012947875$var$emptyDir = $fc381ab012947875$require$u(async function emptyDir(dir) {
    let items;
    try {
        items = await $h7EPZ.readdir(dir);
    } catch  {
        return $7xD7Q.mkdirs(dir);
    }
    return Promise.all(items.map((item)=>$608Ux.remove($h8yOX$path.join(dir, item))
    ));
});
function $fc381ab012947875$var$emptyDirSync(dir) {
    let items;
    try {
        items = $h7EPZ.readdirSync(dir);
    } catch  {
        return $7xD7Q.mkdirsSync(dir);
    }
    items.forEach((item)=>{
        item = $h8yOX$path.join(dir, item);
        $608Ux.removeSync(item);
    });
}
module.exports = {
    emptyDirSync: $fc381ab012947875$var$emptyDirSync,
    emptydirSync: $fc381ab012947875$var$emptyDirSync,
    emptyDir: $fc381ab012947875$var$emptyDir,
    emptydir: $fc381ab012947875$var$emptyDir
};

});
parcelRequire.register("608Ux", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");

var $faHg1 = parcelRequire("faHg1");
var $45e9a7b52a6dd80f$require$u = $faHg1.fromCallback;

var $iMRz6 = parcelRequire("iMRz6");
function $45e9a7b52a6dd80f$var$remove(path, callback) {
    // Node 14.14.0+
    if ($9f6yx.rm) return $9f6yx.rm(path, {
        recursive: true,
        force: true
    }, callback);
    $iMRz6(path, callback);
}
function $45e9a7b52a6dd80f$var$removeSync(path) {
    // Node 14.14.0+
    if ($9f6yx.rmSync) return $9f6yx.rmSync(path, {
        recursive: true,
        force: true
    });
    $iMRz6.sync(path);
}
module.exports = {
    remove: $45e9a7b52a6dd80f$require$u($45e9a7b52a6dd80f$var$remove),
    removeSync: $45e9a7b52a6dd80f$var$removeSync
};

});
parcelRequire.register("iMRz6", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");


const $dad64298bbcd3451$var$isWindows = process.platform === 'win32';
function $dad64298bbcd3451$var$defaults(options) {
    const methods = [
        'unlink',
        'chmod',
        'stat',
        'lstat',
        'rmdir',
        'readdir'
    ];
    methods.forEach((m)=>{
        options[m] = options[m] || $9f6yx[m];
        m = m + 'Sync';
        options[m] = options[m] || $9f6yx[m];
    });
    options.maxBusyTries = options.maxBusyTries || 3;
}
function $dad64298bbcd3451$var$rimraf(p, options, cb) {
    let busyTries = 0;
    if (typeof options === 'function') {
        cb = options;
        options = {
        };
    }
    $h8yOX$assert(p, 'rimraf: missing path');
    $h8yOX$assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string');
    $h8yOX$assert.strictEqual(typeof cb, 'function', 'rimraf: callback function required');
    $h8yOX$assert(options, 'rimraf: invalid options argument provided');
    $h8yOX$assert.strictEqual(typeof options, 'object', 'rimraf: options should be object');
    $dad64298bbcd3451$var$defaults(options);
    $dad64298bbcd3451$var$rimraf_(p, options, function CB(er) {
        if (er) {
            if ((er.code === 'EBUSY' || er.code === 'ENOTEMPTY' || er.code === 'EPERM') && busyTries < options.maxBusyTries) {
                busyTries++;
                const time = busyTries * 100;
                // try again, with the same exact callback as this one.
                return setTimeout(()=>$dad64298bbcd3451$var$rimraf_(p, options, CB)
                , time);
            }
            // already gone
            if (er.code === 'ENOENT') er = null;
        }
        cb(er);
    });
}
// Two possible strategies.
// 1. Assume it's a file.  unlink it, then do the dir stuff on EPERM or EISDIR
// 2. Assume it's a directory.  readdir, then do the file stuff on ENOTDIR
//
// Both result in an extra syscall when you guess wrong.  However, there
// are likely far more normal files in the world than directories.  This
// is based on the assumption that a the average number of files per
// directory is >= 1.
//
// If anyone ever complains about this, then I guess the strategy could
// be made configurable somehow.  But until then, YAGNI.
function $dad64298bbcd3451$var$rimraf_(p, options, cb) {
    $h8yOX$assert(p);
    $h8yOX$assert(options);
    $h8yOX$assert(typeof cb === 'function');
    // sunos lets the root user unlink directories, which is... weird.
    // so we have to lstat here and make sure it's not a dir.
    options.lstat(p, (er, st)=>{
        if (er && er.code === 'ENOENT') return cb(null);
        // Windows can EPERM on stat.  Life is suffering.
        if (er && er.code === 'EPERM' && $dad64298bbcd3451$var$isWindows) return $dad64298bbcd3451$var$fixWinEPERM(p, options, er, cb);
        if (st && st.isDirectory()) return $dad64298bbcd3451$var$rmdir(p, options, er, cb);
        options.unlink(p, (er1)=>{
            if (er1) {
                if (er1.code === 'ENOENT') return cb(null);
                if (er1.code === 'EPERM') return $dad64298bbcd3451$var$isWindows ? $dad64298bbcd3451$var$fixWinEPERM(p, options, er1, cb) : $dad64298bbcd3451$var$rmdir(p, options, er1, cb);
                if (er1.code === 'EISDIR') return $dad64298bbcd3451$var$rmdir(p, options, er1, cb);
            }
            return cb(er1);
        });
    });
}
function $dad64298bbcd3451$var$fixWinEPERM(p, options, er, cb) {
    $h8yOX$assert(p);
    $h8yOX$assert(options);
    $h8yOX$assert(typeof cb === 'function');
    options.chmod(p, 438, (er2)=>{
        if (er2) cb(er2.code === 'ENOENT' ? null : er);
        else options.stat(p, (er3, stats)=>{
            if (er3) cb(er3.code === 'ENOENT' ? null : er);
            else if (stats.isDirectory()) $dad64298bbcd3451$var$rmdir(p, options, er, cb);
            else options.unlink(p, cb);
        });
    });
}
function $dad64298bbcd3451$var$fixWinEPERMSync(p, options, er) {
    let stats;
    $h8yOX$assert(p);
    $h8yOX$assert(options);
    try {
        options.chmodSync(p, 438);
    } catch (er2) {
        if (er2.code === 'ENOENT') return;
        else throw er;
    }
    try {
        stats = options.statSync(p);
    } catch (er3) {
        if (er3.code === 'ENOENT') return;
        else throw er;
    }
    if (stats.isDirectory()) $dad64298bbcd3451$var$rmdirSync(p, options, er);
    else options.unlinkSync(p);
}
function $dad64298bbcd3451$var$rmdir(p, options, originalEr, cb) {
    $h8yOX$assert(p);
    $h8yOX$assert(options);
    $h8yOX$assert(typeof cb === 'function');
    // try to rmdir first, and only readdir on ENOTEMPTY or EEXIST (SunOS)
    // if we guessed wrong, and it's not a directory, then
    // raise the original error.
    options.rmdir(p, (er)=>{
        if (er && (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM')) $dad64298bbcd3451$var$rmkids(p, options, cb);
        else if (er && er.code === 'ENOTDIR') cb(originalEr);
        else cb(er);
    });
}
function $dad64298bbcd3451$var$rmkids(p, options, cb) {
    $h8yOX$assert(p);
    $h8yOX$assert(options);
    $h8yOX$assert(typeof cb === 'function');
    options.readdir(p, (er, files)=>{
        if (er) return cb(er);
        let n = files.length;
        let errState;
        if (n === 0) return options.rmdir(p, cb);
        files.forEach((f)=>{
            $dad64298bbcd3451$var$rimraf($h8yOX$path.join(p, f), options, (er1)=>{
                if (errState) return;
                if (er1) return cb(errState = er1);
                if ((--n) === 0) options.rmdir(p, cb);
            });
        });
    });
}
// this looks simpler, and is strictly *faster*, but will
// tie up the JavaScript thread and fail on excessively
// deep directory trees.
function $dad64298bbcd3451$var$rimrafSync(p, options) {
    let st;
    options = options || {
    };
    $dad64298bbcd3451$var$defaults(options);
    $h8yOX$assert(p, 'rimraf: missing path');
    $h8yOX$assert.strictEqual(typeof p, 'string', 'rimraf: path should be a string');
    $h8yOX$assert(options, 'rimraf: missing options');
    $h8yOX$assert.strictEqual(typeof options, 'object', 'rimraf: options should be object');
    try {
        st = options.lstatSync(p);
    } catch (er) {
        if (er.code === 'ENOENT') return;
        // Windows can EPERM on stat.  Life is suffering.
        if (er.code === 'EPERM' && $dad64298bbcd3451$var$isWindows) $dad64298bbcd3451$var$fixWinEPERMSync(p, options, er);
    }
    try {
        // sunos lets the root user unlink directories, which is... weird.
        if (st && st.isDirectory()) $dad64298bbcd3451$var$rmdirSync(p, options, null);
        else options.unlinkSync(p);
    } catch (er) {
        if (er.code === 'ENOENT') return;
        else if (er.code === 'EPERM') return $dad64298bbcd3451$var$isWindows ? $dad64298bbcd3451$var$fixWinEPERMSync(p, options, er) : $dad64298bbcd3451$var$rmdirSync(p, options, er);
        else if (er.code !== 'EISDIR') throw er;
        $dad64298bbcd3451$var$rmdirSync(p, options, er);
    }
}
function $dad64298bbcd3451$var$rmdirSync(p, options, originalEr) {
    $h8yOX$assert(p);
    $h8yOX$assert(options);
    try {
        options.rmdirSync(p);
    } catch (er) {
        if (er.code === 'ENOTDIR') throw originalEr;
        else if (er.code === 'ENOTEMPTY' || er.code === 'EEXIST' || er.code === 'EPERM') $dad64298bbcd3451$var$rmkidsSync(p, options);
        else if (er.code !== 'ENOENT') throw er;
    }
}
function $dad64298bbcd3451$var$rmkidsSync(p, options) {
    $h8yOX$assert(p);
    $h8yOX$assert(options);
    options.readdirSync(p).forEach((f)=>$dad64298bbcd3451$var$rimrafSync($h8yOX$path.join(p, f), options)
    );
    if ($dad64298bbcd3451$var$isWindows) {
        // We only end up here once we got ENOTEMPTY at least once, and
        // at this point, we are guaranteed to have removed all the kids.
        // So, we know that it won't be ENOENT or ENOTDIR or anything else.
        // try really hard to delete stuff on windows, because it has a
        // PROFOUNDLY annoying habit of not closing handles promptly when
        // files are deleted, resulting in spurious ENOTEMPTY errors.
        const startTime = Date.now();
        do try {
            const ret = options.rmdirSync(p, options);
            return ret;
        } catch  {
        }
        while (Date.now() - startTime < 500) // give up after 500ms
    } else {
        const ret = options.rmdirSync(p, options);
        return ret;
    }
}
module.exports = $dad64298bbcd3451$var$rimraf;
$dad64298bbcd3451$var$rimraf.sync = $dad64298bbcd3451$var$rimrafSync;

});



parcelRequire.register("6bgEx", function(module, exports) {
'use strict';

var $dprBB = parcelRequire("dprBB");

var $i3z0L = parcelRequire("i3z0L");

var $9NJuo = parcelRequire("9NJuo");
module.exports = {
    // file
    createFile: $dprBB.createFile,
    createFileSync: $dprBB.createFileSync,
    ensureFile: $dprBB.createFile,
    ensureFileSync: $dprBB.createFileSync,
    // link
    createLink: $i3z0L.createLink,
    createLinkSync: $i3z0L.createLinkSync,
    ensureLink: $i3z0L.createLink,
    ensureLinkSync: $i3z0L.createLinkSync,
    // symlink
    createSymlink: $9NJuo.createSymlink,
    createSymlinkSync: $9NJuo.createSymlinkSync,
    ensureSymlink: $9NJuo.createSymlink,
    ensureSymlinkSync: $9NJuo.createSymlinkSync
};

});
parcelRequire.register("dprBB", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $9c330606b7d82f38$require$u = $faHg1.fromCallback;


var $9f6yx = parcelRequire("9f6yx");

var $7xD7Q = parcelRequire("7xD7Q");
function $9c330606b7d82f38$var$createFile(file, callback) {
    function makeFile() {
        $9f6yx.writeFile(file, '', (err)=>{
            if (err) return callback(err);
            callback();
        });
    }
    $9f6yx.stat(file, (err, stats)=>{
        if (!err && stats.isFile()) return callback();
        const dir = $h8yOX$path.dirname(file);
        $9f6yx.stat(dir, (err1, stats1)=>{
            if (err1) {
                // if the directory doesn't exist, make it
                if (err1.code === 'ENOENT') return $7xD7Q.mkdirs(dir, (err2)=>{
                    if (err2) return callback(err2);
                    makeFile();
                });
                return callback(err1);
            }
            if (stats1.isDirectory()) makeFile();
            else // parent is not a directory
            // This is just to cause an internal ENOTDIR error to be thrown
            $9f6yx.readdir(dir, (err2)=>{
                if (err2) return callback(err2);
            });
        });
    });
}
function $9c330606b7d82f38$var$createFileSync(file) {
    let stats;
    try {
        stats = $9f6yx.statSync(file);
    } catch  {
    }
    if (stats && stats.isFile()) return;
    const dir = $h8yOX$path.dirname(file);
    try {
        if (!$9f6yx.statSync(dir).isDirectory()) // parent is not a directory
        // This is just to cause an internal ENOTDIR error to be thrown
        $9f6yx.readdirSync(dir);
    } catch (err) {
        // If the stat call above failed because the directory doesn't exist, create it
        if (err && err.code === 'ENOENT') $7xD7Q.mkdirsSync(dir);
        else throw err;
    }
    $9f6yx.writeFileSync(file, '');
}
module.exports = {
    createFile: $9c330606b7d82f38$require$u($9c330606b7d82f38$var$createFile),
    createFileSync: $9c330606b7d82f38$var$createFileSync
};

});

parcelRequire.register("i3z0L", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $d253aa519a0249fd$require$u = $faHg1.fromCallback;


var $9f6yx = parcelRequire("9f6yx");

var $7xD7Q = parcelRequire("7xD7Q");

var $gNg0Y = parcelRequire("gNg0Y");
var $d253aa519a0249fd$require$pathExists = $gNg0Y.pathExists;

var $c2Ond = parcelRequire("c2Ond");
var $d253aa519a0249fd$require$areIdentical = $c2Ond.areIdentical;
function $d253aa519a0249fd$var$createLink(srcpath, dstpath, callback) {
    function makeLink(srcpath1, dstpath1) {
        $9f6yx.link(srcpath1, dstpath1, (err)=>{
            if (err) return callback(err);
            callback(null);
        });
    }
    $9f6yx.lstat(dstpath, (_, dstStat)=>{
        $9f6yx.lstat(srcpath, (err, srcStat)=>{
            if (err) {
                err.message = err.message.replace('lstat', 'ensureLink');
                return callback(err);
            }
            if (dstStat && $d253aa519a0249fd$require$areIdentical(srcStat, dstStat)) return callback(null);
            const dir = $h8yOX$path.dirname(dstpath);
            $d253aa519a0249fd$require$pathExists(dir, (err1, dirExists)=>{
                if (err1) return callback(err1);
                if (dirExists) return makeLink(srcpath, dstpath);
                $7xD7Q.mkdirs(dir, (err2)=>{
                    if (err2) return callback(err2);
                    makeLink(srcpath, dstpath);
                });
            });
        });
    });
}
function $d253aa519a0249fd$var$createLinkSync(srcpath, dstpath) {
    let dstStat;
    try {
        dstStat = $9f6yx.lstatSync(dstpath);
    } catch  {
    }
    try {
        const srcStat = $9f6yx.lstatSync(srcpath);
        if (dstStat && $d253aa519a0249fd$require$areIdentical(srcStat, dstStat)) return;
    } catch (err) {
        err.message = err.message.replace('lstat', 'ensureLink');
        throw err;
    }
    const dir = $h8yOX$path.dirname(dstpath);
    const dirExists = $9f6yx.existsSync(dir);
    if (dirExists) return $9f6yx.linkSync(srcpath, dstpath);
    $7xD7Q.mkdirsSync(dir);
    return $9f6yx.linkSync(srcpath, dstpath);
}
module.exports = {
    createLink: $d253aa519a0249fd$require$u($d253aa519a0249fd$var$createLink),
    createLinkSync: $d253aa519a0249fd$var$createLinkSync
};

});

parcelRequire.register("9NJuo", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $722bf9e300fff468$require$u = $faHg1.fromCallback;


var $h7EPZ = parcelRequire("h7EPZ");

var $7xD7Q = parcelRequire("7xD7Q");
const $722bf9e300fff468$var$mkdirs = $7xD7Q.mkdirs;
const $722bf9e300fff468$var$mkdirsSync = $7xD7Q.mkdirsSync;

var $gmFsL = parcelRequire("gmFsL");
const $722bf9e300fff468$var$symlinkPaths = $gmFsL.symlinkPaths;
const $722bf9e300fff468$var$symlinkPathsSync = $gmFsL.symlinkPathsSync;

var $emGGQ = parcelRequire("emGGQ");
const $722bf9e300fff468$var$symlinkType = $emGGQ.symlinkType;
const $722bf9e300fff468$var$symlinkTypeSync = $emGGQ.symlinkTypeSync;

var $gNg0Y = parcelRequire("gNg0Y");
var $722bf9e300fff468$require$pathExists = $gNg0Y.pathExists;

var $c2Ond = parcelRequire("c2Ond");
var $722bf9e300fff468$require$areIdentical = $c2Ond.areIdentical;
function $722bf9e300fff468$var$createSymlink(srcpath, dstpath, type, callback) {
    callback = typeof type === 'function' ? type : callback;
    type = typeof type === 'function' ? false : type;
    $h7EPZ.lstat(dstpath, (err, stats)=>{
        if (!err && stats.isSymbolicLink()) Promise.all([
            $h7EPZ.stat(srcpath),
            $h7EPZ.stat(dstpath)
        ]).then(([srcStat, dstStat])=>{
            if ($722bf9e300fff468$require$areIdentical(srcStat, dstStat)) return callback(null);
            $722bf9e300fff468$var$_createSymlink(srcpath, dstpath, type, callback);
        });
        else $722bf9e300fff468$var$_createSymlink(srcpath, dstpath, type, callback);
    });
}
function $722bf9e300fff468$var$_createSymlink(srcpath, dstpath, type, callback) {
    $722bf9e300fff468$var$symlinkPaths(srcpath, dstpath, (err, relative)=>{
        if (err) return callback(err);
        srcpath = relative.toDst;
        $722bf9e300fff468$var$symlinkType(relative.toCwd, type, (err1, type1)=>{
            if (err1) return callback(err1);
            const dir = $h8yOX$path.dirname(dstpath);
            $722bf9e300fff468$require$pathExists(dir, (err2, dirExists)=>{
                if (err2) return callback(err2);
                if (dirExists) return $h7EPZ.symlink(srcpath, dstpath, type1, callback);
                $722bf9e300fff468$var$mkdirs(dir, (err3)=>{
                    if (err3) return callback(err3);
                    $h7EPZ.symlink(srcpath, dstpath, type1, callback);
                });
            });
        });
    });
}
function $722bf9e300fff468$var$createSymlinkSync(srcpath, dstpath, type) {
    let stats;
    try {
        stats = $h7EPZ.lstatSync(dstpath);
    } catch  {
    }
    if (stats && stats.isSymbolicLink()) {
        const srcStat = $h7EPZ.statSync(srcpath);
        const dstStat = $h7EPZ.statSync(dstpath);
        if ($722bf9e300fff468$require$areIdentical(srcStat, dstStat)) return;
    }
    const relative = $722bf9e300fff468$var$symlinkPathsSync(srcpath, dstpath);
    srcpath = relative.toDst;
    type = $722bf9e300fff468$var$symlinkTypeSync(relative.toCwd, type);
    const dir = $h8yOX$path.dirname(dstpath);
    const exists = $h7EPZ.existsSync(dir);
    if (exists) return $h7EPZ.symlinkSync(srcpath, dstpath, type);
    $722bf9e300fff468$var$mkdirsSync(dir);
    return $h7EPZ.symlinkSync(srcpath, dstpath, type);
}
module.exports = {
    createSymlink: $722bf9e300fff468$require$u($722bf9e300fff468$var$createSymlink),
    createSymlinkSync: $722bf9e300fff468$var$createSymlinkSync
};

});
parcelRequire.register("gmFsL", function(module, exports) {
'use strict';


var $9f6yx = parcelRequire("9f6yx");

var $gNg0Y = parcelRequire("gNg0Y");
var $be9edd149e778baf$require$pathExists = $gNg0Y.pathExists;
/**
 * Function that returns two types of paths, one relative to symlink, and one
 * relative to the current working directory. Checks if path is absolute or
 * relative. If the path is relative, this function checks if the path is
 * relative to symlink or relative to current working directory. This is an
 * initiative to find a smarter `srcpath` to supply when building symlinks.
 * This allows you to determine which path to use out of one of three possible
 * types of source paths. The first is an absolute path. This is detected by
 * `path.isAbsolute()`. When an absolute path is provided, it is checked to
 * see if it exists. If it does it's used, if not an error is returned
 * (callback)/ thrown (sync). The other two options for `srcpath` are a
 * relative url. By default Node's `fs.symlink` works by creating a symlink
 * using `dstpath` and expects the `srcpath` to be relative to the newly
 * created symlink. If you provide a `srcpath` that does not exist on the file
 * system it results in a broken symlink. To minimize this, the function
 * checks to see if the 'relative to symlink' source file exists, and if it
 * does it will use it. If it does not, it checks if there's a file that
 * exists that is relative to the current working directory, if does its used.
 * This preserves the expectations of the original fs.symlink spec and adds
 * the ability to pass in `relative to current working direcotry` paths.
 */ function $be9edd149e778baf$var$symlinkPaths(srcpath, dstpath, callback) {
    if ($h8yOX$path.isAbsolute(srcpath)) return $9f6yx.lstat(srcpath, (err)=>{
        if (err) {
            err.message = err.message.replace('lstat', 'ensureSymlink');
            return callback(err);
        }
        return callback(null, {
            toCwd: srcpath,
            toDst: srcpath
        });
    });
    else {
        const dstdir = $h8yOX$path.dirname(dstpath);
        const relativeToDst = $h8yOX$path.join(dstdir, srcpath);
        return $be9edd149e778baf$require$pathExists(relativeToDst, (err, exists)=>{
            if (err) return callback(err);
            if (exists) return callback(null, {
                toCwd: relativeToDst,
                toDst: srcpath
            });
            else return $9f6yx.lstat(srcpath, (err1)=>{
                if (err1) {
                    err1.message = err1.message.replace('lstat', 'ensureSymlink');
                    return callback(err1);
                }
                return callback(null, {
                    toCwd: srcpath,
                    toDst: $h8yOX$path.relative(dstdir, srcpath)
                });
            });
        });
    }
}
function $be9edd149e778baf$var$symlinkPathsSync(srcpath, dstpath) {
    let exists;
    if ($h8yOX$path.isAbsolute(srcpath)) {
        exists = $9f6yx.existsSync(srcpath);
        if (!exists) throw new Error('absolute srcpath does not exist');
        return {
            toCwd: srcpath,
            toDst: srcpath
        };
    } else {
        const dstdir = $h8yOX$path.dirname(dstpath);
        const relativeToDst = $h8yOX$path.join(dstdir, srcpath);
        exists = $9f6yx.existsSync(relativeToDst);
        if (exists) return {
            toCwd: relativeToDst,
            toDst: srcpath
        };
        else {
            exists = $9f6yx.existsSync(srcpath);
            if (!exists) throw new Error('relative srcpath does not exist');
            return {
                toCwd: srcpath,
                toDst: $h8yOX$path.relative(dstdir, srcpath)
            };
        }
    }
}
module.exports = {
    symlinkPaths: $be9edd149e778baf$var$symlinkPaths,
    symlinkPathsSync: $be9edd149e778baf$var$symlinkPathsSync
};

});

parcelRequire.register("emGGQ", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");
function $a7543c2382fb2ecd$var$symlinkType(srcpath, type, callback) {
    callback = typeof type === 'function' ? type : callback;
    type = typeof type === 'function' ? false : type;
    if (type) return callback(null, type);
    $9f6yx.lstat(srcpath, (err, stats)=>{
        if (err) return callback(null, 'file');
        type = stats && stats.isDirectory() ? 'dir' : 'file';
        callback(null, type);
    });
}
function $a7543c2382fb2ecd$var$symlinkTypeSync(srcpath, type) {
    let stats;
    if (type) return type;
    try {
        stats = $9f6yx.lstatSync(srcpath);
    } catch  {
        return 'file';
    }
    return stats && stats.isDirectory() ? 'dir' : 'file';
}
module.exports = {
    symlinkType: $a7543c2382fb2ecd$var$symlinkType,
    symlinkTypeSync: $a7543c2382fb2ecd$var$symlinkTypeSync
};

});



parcelRequire.register("hXbg4", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $d120adfe0eba183a$require$u = $faHg1.fromPromise;

var $gZoQd = parcelRequire("gZoQd");

$gZoQd.outputJson = $d120adfe0eba183a$require$u((parcelRequire("jK6HR")));

$gZoQd.outputJsonSync = (parcelRequire("5p0aS"));
// aliases
$gZoQd.outputJSON = $gZoQd.outputJson;
$gZoQd.outputJSONSync = $gZoQd.outputJsonSync;
$gZoQd.writeJSON = $gZoQd.writeJson;
$gZoQd.writeJSONSync = $gZoQd.writeJsonSync;
$gZoQd.readJSON = $gZoQd.readJson;
$gZoQd.readJSONSync = $gZoQd.readJsonSync;
module.exports = $gZoQd;

});
parcelRequire.register("gZoQd", function(module, exports) {
'use strict';

var $jVPH7 = parcelRequire("jVPH7");
module.exports = {
    // jsonfile exports
    readJson: $jVPH7.readFile,
    readJsonSync: $jVPH7.readFileSync,
    writeJson: $jVPH7.writeFile,
    writeJsonSync: $jVPH7.writeFileSync
};

});
parcelRequire.register("jVPH7", function(module, exports) {
let $e82b70a419db6c4e$var$_fs;


try {
    $e82b70a419db6c4e$var$_fs = (parcelRequire("9f6yx"));
} catch (_) {
    $e82b70a419db6c4e$var$_fs = $h8yOX$fs;
}

var $faHg1 = parcelRequire("faHg1");

var $dbAHD = parcelRequire("dbAHD");
var $e82b70a419db6c4e$require$stripBom = $dbAHD.stripBom;
var $e82b70a419db6c4e$require$stringify = $dbAHD.stringify;
async function $e82b70a419db6c4e$var$_readFile(file, options = {
}) {
    if (typeof options === 'string') options = {
        encoding: options
    };
    const fs = options.fs || $e82b70a419db6c4e$var$_fs;
    const shouldThrow = 'throws' in options ? options.throws : true;
    let data = await $faHg1.fromCallback(fs.readFile)(file, options);
    data = $e82b70a419db6c4e$require$stripBom(data);
    let obj;
    try {
        obj = JSON.parse(data, options ? options.reviver : null);
    } catch (err) {
        if (shouldThrow) {
            err.message = `${file}: ${err.message}`;
            throw err;
        } else return null;
    }
    return obj;
}
const $e82b70a419db6c4e$var$readFile = $faHg1.fromPromise($e82b70a419db6c4e$var$_readFile);
function $e82b70a419db6c4e$var$readFileSync(file, options = {
}) {
    if (typeof options === 'string') options = {
        encoding: options
    };
    const fs = options.fs || $e82b70a419db6c4e$var$_fs;
    const shouldThrow = 'throws' in options ? options.throws : true;
    try {
        let content = fs.readFileSync(file, options);
        content = $e82b70a419db6c4e$require$stripBom(content);
        return JSON.parse(content, options.reviver);
    } catch (err) {
        if (shouldThrow) {
            err.message = `${file}: ${err.message}`;
            throw err;
        } else return null;
    }
}
async function $e82b70a419db6c4e$var$_writeFile(file, obj, options = {
}) {
    const fs = options.fs || $e82b70a419db6c4e$var$_fs;
    const str = $e82b70a419db6c4e$require$stringify(obj, options);
    await $faHg1.fromCallback(fs.writeFile)(file, str, options);
}
const $e82b70a419db6c4e$var$writeFile = $faHg1.fromPromise($e82b70a419db6c4e$var$_writeFile);
function $e82b70a419db6c4e$var$writeFileSync(file, obj, options = {
}) {
    const fs = options.fs || $e82b70a419db6c4e$var$_fs;
    const str = $e82b70a419db6c4e$require$stringify(obj, options);
    // not sure if fs.writeFileSync returns anything, but just in case
    return fs.writeFileSync(file, str, options);
}
const $e82b70a419db6c4e$var$jsonfile = {
    readFile: $e82b70a419db6c4e$var$readFile,
    readFileSync: $e82b70a419db6c4e$var$readFileSync,
    writeFile: $e82b70a419db6c4e$var$writeFile,
    writeFileSync: $e82b70a419db6c4e$var$writeFileSync
};
module.exports = $e82b70a419db6c4e$var$jsonfile;

});
parcelRequire.register("dbAHD", function(module, exports) {
function $9998c5ddb97e04d6$var$stringify(obj, { EOL: EOL = '\n' , finalEOL: finalEOL = true , replacer: replacer = null , spaces: spaces  } = {
}) {
    const EOF = finalEOL ? EOL : '';
    const str = JSON.stringify(obj, replacer, spaces);
    return str.replace(/\n/g, EOL) + EOF;
}
function $9998c5ddb97e04d6$var$stripBom(content) {
    // we do this because JSON.parse would convert it to a utf8 string if encoding wasn't specified
    if (Buffer.isBuffer(content)) content = content.toString('utf8');
    return content.replace(/^\uFEFF/, '');
}
module.exports = {
    stringify: $9998c5ddb97e04d6$var$stringify,
    stripBom: $9998c5ddb97e04d6$var$stripBom
};

});



parcelRequire.register("jK6HR", function(module, exports) {
'use strict';

var $dbAHD = parcelRequire("dbAHD");
var $e5f783f5c8939405$require$stringify = $dbAHD.stringify;

var $6rjNo = parcelRequire("6rjNo");
var $e5f783f5c8939405$require$outputFile = $6rjNo.outputFile;
async function $e5f783f5c8939405$var$outputJson(file, data, options = {
}) {
    const str = $e5f783f5c8939405$require$stringify(data, options);
    await $e5f783f5c8939405$require$outputFile(file, str, options);
}
module.exports = $e5f783f5c8939405$var$outputJson;

});
parcelRequire.register("6rjNo", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $4b049eb8fcd76477$require$u = $faHg1.fromCallback;

var $9f6yx = parcelRequire("9f6yx");


var $7xD7Q = parcelRequire("7xD7Q");

var $gNg0Y = parcelRequire("gNg0Y");
var $4b049eb8fcd76477$require$pathExists = $gNg0Y.pathExists;
function $4b049eb8fcd76477$var$outputFile(file, data, encoding, callback) {
    if (typeof encoding === 'function') {
        callback = encoding;
        encoding = 'utf8';
    }
    const dir = $h8yOX$path.dirname(file);
    $4b049eb8fcd76477$require$pathExists(dir, (err, itDoes)=>{
        if (err) return callback(err);
        if (itDoes) return $9f6yx.writeFile(file, data, encoding, callback);
        $7xD7Q.mkdirs(dir, (err1)=>{
            if (err1) return callback(err1);
            $9f6yx.writeFile(file, data, encoding, callback);
        });
    });
}
function $4b049eb8fcd76477$var$outputFileSync(file, ...args) {
    const dir = $h8yOX$path.dirname(file);
    if ($9f6yx.existsSync(dir)) return $9f6yx.writeFileSync(file, ...args);
    $7xD7Q.mkdirsSync(dir);
    $9f6yx.writeFileSync(file, ...args);
}
module.exports = {
    outputFile: $4b049eb8fcd76477$require$u($4b049eb8fcd76477$var$outputFile),
    outputFileSync: $4b049eb8fcd76477$var$outputFileSync
};

});


parcelRequire.register("5p0aS", function(module, exports) {
'use strict';

var $dbAHD = parcelRequire("dbAHD");
var $3eef6c2df6b61c45$require$stringify = $dbAHD.stringify;

var $6rjNo = parcelRequire("6rjNo");
var $3eef6c2df6b61c45$require$outputFileSync = $6rjNo.outputFileSync;
function $3eef6c2df6b61c45$var$outputJsonSync(file, data, options) {
    const str = $3eef6c2df6b61c45$require$stringify(data, options);
    $3eef6c2df6b61c45$require$outputFileSync(file, str, options);
}
module.exports = $3eef6c2df6b61c45$var$outputJsonSync;

});


parcelRequire.register("28kQ1", function(module, exports) {
'use strict';

module.exports = {
    moveSync: (parcelRequire("9EV2N"))
};

});
parcelRequire.register("9EV2N", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");


var $gySiv = parcelRequire("gySiv");
var $708419431db6e1d6$require$copySync = $gySiv.copySync;

var $608Ux = parcelRequire("608Ux");
var $708419431db6e1d6$require$removeSync = $608Ux.removeSync;

var $7xD7Q = parcelRequire("7xD7Q");
var $708419431db6e1d6$require$mkdirpSync = $7xD7Q.mkdirpSync;

var $c2Ond = parcelRequire("c2Ond");
function $708419431db6e1d6$var$moveSync(src, dest, opts) {
    opts = opts || {
    };
    const overwrite = opts.overwrite || opts.clobber || false;
    const { srcStat: srcStat , isChangingCase: isChangingCase = false  } = $c2Ond.checkPathsSync(src, dest, 'move', opts);
    $c2Ond.checkParentPathsSync(src, srcStat, dest, 'move');
    if (!$708419431db6e1d6$var$isParentRoot(dest)) $708419431db6e1d6$require$mkdirpSync($h8yOX$path.dirname(dest));
    return $708419431db6e1d6$var$doRename(src, dest, overwrite, isChangingCase);
}
function $708419431db6e1d6$var$isParentRoot(dest) {
    const parent = $h8yOX$path.dirname(dest);
    const parsedPath = $h8yOX$path.parse(parent);
    return parsedPath.root === parent;
}
function $708419431db6e1d6$var$doRename(src, dest, overwrite, isChangingCase) {
    if (isChangingCase) return $708419431db6e1d6$var$rename(src, dest, overwrite);
    if (overwrite) {
        $708419431db6e1d6$require$removeSync(dest);
        return $708419431db6e1d6$var$rename(src, dest, overwrite);
    }
    if ($9f6yx.existsSync(dest)) throw new Error('dest already exists.');
    return $708419431db6e1d6$var$rename(src, dest, overwrite);
}
function $708419431db6e1d6$var$rename(src, dest, overwrite) {
    try {
        $9f6yx.renameSync(src, dest);
    } catch (err) {
        if (err.code !== 'EXDEV') throw err;
        return $708419431db6e1d6$var$moveAcrossDevice(src, dest, overwrite);
    }
}
function $708419431db6e1d6$var$moveAcrossDevice(src, dest, overwrite) {
    const opts = {
        overwrite: overwrite,
        errorOnExist: true
    };
    $708419431db6e1d6$require$copySync(src, dest, opts);
    return $708419431db6e1d6$require$removeSync(src);
}
module.exports = $708419431db6e1d6$var$moveSync;

});


parcelRequire.register("fX234", function(module, exports) {
'use strict';

var $faHg1 = parcelRequire("faHg1");
var $b9cdf484caa196a9$require$u = $faHg1.fromCallback;

module.exports = {
    move: $b9cdf484caa196a9$require$u((parcelRequire("7wexc")))
};

});
parcelRequire.register("7wexc", function(module, exports) {
'use strict';

var $9f6yx = parcelRequire("9f6yx");


var $6GZp3 = parcelRequire("6GZp3");
var $0169a872d6ba0a26$require$copy = $6GZp3.copy;

var $608Ux = parcelRequire("608Ux");
var $0169a872d6ba0a26$require$remove = $608Ux.remove;

var $7xD7Q = parcelRequire("7xD7Q");
var $0169a872d6ba0a26$require$mkdirp = $7xD7Q.mkdirp;

var $gNg0Y = parcelRequire("gNg0Y");
var $0169a872d6ba0a26$require$pathExists = $gNg0Y.pathExists;

var $c2Ond = parcelRequire("c2Ond");
function $0169a872d6ba0a26$var$move(src, dest, opts, cb) {
    if (typeof opts === 'function') {
        cb = opts;
        opts = {
        };
    }
    const overwrite = opts.overwrite || opts.clobber || false;
    $c2Ond.checkPaths(src, dest, 'move', opts, (err, stats)=>{
        if (err) return cb(err);
        const { srcStat: srcStat , isChangingCase: isChangingCase = false  } = stats;
        $c2Ond.checkParentPaths(src, srcStat, dest, 'move', (err1)=>{
            if (err1) return cb(err1);
            if ($0169a872d6ba0a26$var$isParentRoot(dest)) return $0169a872d6ba0a26$var$doRename(src, dest, overwrite, isChangingCase, cb);
            $0169a872d6ba0a26$require$mkdirp($h8yOX$path.dirname(dest), (err2)=>{
                if (err2) return cb(err2);
                return $0169a872d6ba0a26$var$doRename(src, dest, overwrite, isChangingCase, cb);
            });
        });
    });
}
function $0169a872d6ba0a26$var$isParentRoot(dest) {
    const parent = $h8yOX$path.dirname(dest);
    const parsedPath = $h8yOX$path.parse(parent);
    return parsedPath.root === parent;
}
function $0169a872d6ba0a26$var$doRename(src, dest, overwrite, isChangingCase, cb) {
    if (isChangingCase) return $0169a872d6ba0a26$var$rename(src, dest, overwrite, cb);
    if (overwrite) return $0169a872d6ba0a26$require$remove(dest, (err)=>{
        if (err) return cb(err);
        return $0169a872d6ba0a26$var$rename(src, dest, overwrite, cb);
    });
    $0169a872d6ba0a26$require$pathExists(dest, (err, destExists)=>{
        if (err) return cb(err);
        if (destExists) return cb(new Error('dest already exists.'));
        return $0169a872d6ba0a26$var$rename(src, dest, overwrite, cb);
    });
}
function $0169a872d6ba0a26$var$rename(src, dest, overwrite, cb) {
    $9f6yx.rename(src, dest, (err)=>{
        if (!err) return cb();
        if (err.code !== 'EXDEV') return cb(err);
        return $0169a872d6ba0a26$var$moveAcrossDevice(src, dest, overwrite, cb);
    });
}
function $0169a872d6ba0a26$var$moveAcrossDevice(src, dest, overwrite, cb) {
    const opts = {
        overwrite: overwrite,
        errorOnExist: true
    };
    $0169a872d6ba0a26$require$copy(src, dest, opts, (err)=>{
        if (err) return cb(err);
        return $0169a872d6ba0a26$require$remove(src, cb);
    });
}
module.exports = $0169a872d6ba0a26$var$move;

});



parcelRequire.register("8SceC", function(module, exports) {
module.exports = Promise.resolve(require("./compare.1b61c4a6.js")).then(()=>parcelRequire('atHBZ')
);

});



//# sourceMappingURL=installation.6c1a001e.js.map
