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
parcelRequire.register("atHBZ", function(module, exports) {

var $iF8hd = parcelRequire("iF8hd");
const $7a0e712f6befb3cf$var$compare = (a, b, loose)=>new $iF8hd(a, loose).compare(new $iF8hd(b, loose))
;
module.exports = $7a0e712f6befb3cf$var$compare;

});
parcelRequire.register("iF8hd", function(module, exports) {

var $4wayy = parcelRequire("4wayy");

var $h06VS = parcelRequire("h06VS");
var $d96279e9d25c83cb$require$MAX_LENGTH = $h06VS.MAX_LENGTH;
var $d96279e9d25c83cb$require$MAX_SAFE_INTEGER = $h06VS.MAX_SAFE_INTEGER;

var $kqvfO = parcelRequire("kqvfO");
var $d96279e9d25c83cb$require$re = $kqvfO.re;
var $d96279e9d25c83cb$require$t = $kqvfO.t;

var $lOrTB = parcelRequire("lOrTB");

var $1tH2l = parcelRequire("1tH2l");
var $d96279e9d25c83cb$require$compareIdentifiers = $1tH2l.compareIdentifiers;
class $d96279e9d25c83cb$var$SemVer {
    constructor(version, options){
        options = $lOrTB(options);
        if (version instanceof $d96279e9d25c83cb$var$SemVer) {
            if (version.loose === !!options.loose && version.includePrerelease === !!options.includePrerelease) return version;
            else version = version.version;
        } else if (typeof version !== 'string') throw new TypeError(`Invalid Version: ${version}`);
        if (version.length > $d96279e9d25c83cb$require$MAX_LENGTH) throw new TypeError(`version is longer than ${$d96279e9d25c83cb$require$MAX_LENGTH} characters`);
        $4wayy('SemVer', version, options);
        this.options = options;
        this.loose = !!options.loose;
        // this isn't actually relevant for versions, but keep it so that we
        // don't run into trouble passing this.options around.
        this.includePrerelease = !!options.includePrerelease;
        const m = version.trim().match(options.loose ? $d96279e9d25c83cb$require$re[$d96279e9d25c83cb$require$t.LOOSE] : $d96279e9d25c83cb$require$re[$d96279e9d25c83cb$require$t.FULL]);
        if (!m) throw new TypeError(`Invalid Version: ${version}`);
        this.raw = version;
        // these are actually numbers
        this.major = +m[1];
        this.minor = +m[2];
        this.patch = +m[3];
        if (this.major > $d96279e9d25c83cb$require$MAX_SAFE_INTEGER || this.major < 0) throw new TypeError('Invalid major version');
        if (this.minor > $d96279e9d25c83cb$require$MAX_SAFE_INTEGER || this.minor < 0) throw new TypeError('Invalid minor version');
        if (this.patch > $d96279e9d25c83cb$require$MAX_SAFE_INTEGER || this.patch < 0) throw new TypeError('Invalid patch version');
        // numberify any prerelease numeric ids
        if (!m[4]) this.prerelease = [];
        else this.prerelease = m[4].split('.').map((id)=>{
            if (/^[0-9]+$/.test(id)) {
                const num = +id;
                if (num >= 0 && num < $d96279e9d25c83cb$require$MAX_SAFE_INTEGER) return num;
            }
            return id;
        });
        this.build = m[5] ? m[5].split('.') : [];
        this.format();
    }
    format() {
        this.version = `${this.major}.${this.minor}.${this.patch}`;
        if (this.prerelease.length) this.version += `-${this.prerelease.join('.')}`;
        return this.version;
    }
    toString() {
        return this.version;
    }
    compare(other) {
        $4wayy('SemVer.compare', this.version, this.options, other);
        if (!(other instanceof $d96279e9d25c83cb$var$SemVer)) {
            if (typeof other === 'string' && other === this.version) return 0;
            other = new $d96279e9d25c83cb$var$SemVer(other, this.options);
        }
        if (other.version === this.version) return 0;
        return this.compareMain(other) || this.comparePre(other);
    }
    compareMain(other) {
        if (!(other instanceof $d96279e9d25c83cb$var$SemVer)) other = new $d96279e9d25c83cb$var$SemVer(other, this.options);
        return $d96279e9d25c83cb$require$compareIdentifiers(this.major, other.major) || $d96279e9d25c83cb$require$compareIdentifiers(this.minor, other.minor) || $d96279e9d25c83cb$require$compareIdentifiers(this.patch, other.patch);
    }
    comparePre(other) {
        if (!(other instanceof $d96279e9d25c83cb$var$SemVer)) other = new $d96279e9d25c83cb$var$SemVer(other, this.options);
        // NOT having a prerelease is > having one
        if (this.prerelease.length && !other.prerelease.length) return -1;
        else if (!this.prerelease.length && other.prerelease.length) return 1;
        else if (!this.prerelease.length && !other.prerelease.length) return 0;
        let i = 0;
        do {
            const a = this.prerelease[i];
            const b = other.prerelease[i];
            $4wayy('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) return 0;
            else if (b === undefined) return 1;
            else if (a === undefined) return -1;
            else if (a === b) continue;
            else return $d96279e9d25c83cb$require$compareIdentifiers(a, b);
        }while (++i)
    }
    compareBuild(other) {
        if (!(other instanceof $d96279e9d25c83cb$var$SemVer)) other = new $d96279e9d25c83cb$var$SemVer(other, this.options);
        let i = 0;
        do {
            const a = this.build[i];
            const b = other.build[i];
            $4wayy('prerelease compare', i, a, b);
            if (a === undefined && b === undefined) return 0;
            else if (b === undefined) return 1;
            else if (a === undefined) return -1;
            else if (a === b) continue;
            else return $d96279e9d25c83cb$require$compareIdentifiers(a, b);
        }while (++i)
    }
    // preminor will bump the version up to the next minor release, and immediately
    // down to pre-release. premajor and prepatch work the same way.
    inc(release, identifier) {
        switch(release){
            case 'premajor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor = 0;
                this.major++;
                this.inc('pre', identifier);
                break;
            case 'preminor':
                this.prerelease.length = 0;
                this.patch = 0;
                this.minor++;
                this.inc('pre', identifier);
                break;
            case 'prepatch':
                // If this is already a prerelease, it will bump to the next version
                // drop any prereleases that might already exist, since they are not
                // relevant at this point.
                this.prerelease.length = 0;
                this.inc('patch', identifier);
                this.inc('pre', identifier);
                break;
            // If the input is a non-prerelease version, this acts the same as
            // prepatch.
            case 'prerelease':
                if (this.prerelease.length === 0) this.inc('patch', identifier);
                this.inc('pre', identifier);
                break;
            case 'major':
                // If this is a pre-major version, bump up to the same major version.
                // Otherwise increment major.
                // 1.0.0-5 bumps to 1.0.0
                // 1.1.0 bumps to 2.0.0
                if (this.minor !== 0 || this.patch !== 0 || this.prerelease.length === 0) this.major++;
                this.minor = 0;
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'minor':
                // If this is a pre-minor version, bump up to the same minor version.
                // Otherwise increment minor.
                // 1.2.0-5 bumps to 1.2.0
                // 1.2.1 bumps to 1.3.0
                if (this.patch !== 0 || this.prerelease.length === 0) this.minor++;
                this.patch = 0;
                this.prerelease = [];
                break;
            case 'patch':
                // If this is not a pre-release version, it will increment the patch.
                // If it is a pre-release it will bump up to the same patch version.
                // 1.2.0-5 patches to 1.2.0
                // 1.2.0 patches to 1.2.1
                if (this.prerelease.length === 0) this.patch++;
                this.prerelease = [];
                break;
            // This probably shouldn't be used publicly.
            // 1.0.0 'pre' would become 1.0.0-0 which is the wrong direction.
            case 'pre':
                if (this.prerelease.length === 0) this.prerelease = [
                    0
                ];
                else {
                    let i = this.prerelease.length;
                    while((--i) >= 0)if (typeof this.prerelease[i] === 'number') {
                        this.prerelease[i]++;
                        i = -2;
                    }
                    if (i === -1) // didn't increment anything
                    this.prerelease.push(0);
                }
                if (identifier) {
                    // 1.2.0-beta.1 bumps to 1.2.0-beta.2,
                    // 1.2.0-beta.fooblz or 1.2.0-beta bumps to 1.2.0-beta.0
                    if (this.prerelease[0] === identifier) {
                        if (isNaN(this.prerelease[1])) this.prerelease = [
                            identifier,
                            0
                        ];
                    } else this.prerelease = [
                        identifier,
                        0
                    ];
                }
                break;
            default:
                throw new Error(`invalid increment argument: ${release}`);
        }
        this.format();
        this.raw = this.version;
        return this;
    }
}
module.exports = $d96279e9d25c83cb$var$SemVer;

});
parcelRequire.register("4wayy", function(module, exports) {
const $34a256de890f0069$var$debug = typeof process === 'object' && process.env && process.env.NODE_DEBUG && /\bsemver\b/i.test(process.env.NODE_DEBUG) ? (...args)=>console.error('SEMVER', ...args)
 : ()=>{
};
module.exports = $34a256de890f0069$var$debug;

});

parcelRequire.register("h06VS", function(module, exports) {
// Note: this is the semver.org version of the spec that it implements
// Not necessarily the package version of this code.
const $c607d06a94bd88a6$var$SEMVER_SPEC_VERSION = '2.0.0';
const $c607d06a94bd88a6$var$MAX_LENGTH = 256;
const $c607d06a94bd88a6$var$MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || /* istanbul ignore next */ 9007199254740991;
// Max safe segment length for coercion.
const $c607d06a94bd88a6$var$MAX_SAFE_COMPONENT_LENGTH = 16;
module.exports = {
    SEMVER_SPEC_VERSION: $c607d06a94bd88a6$var$SEMVER_SPEC_VERSION,
    MAX_LENGTH: $c607d06a94bd88a6$var$MAX_LENGTH,
    MAX_SAFE_INTEGER: $c607d06a94bd88a6$var$MAX_SAFE_INTEGER,
    MAX_SAFE_COMPONENT_LENGTH: $c607d06a94bd88a6$var$MAX_SAFE_COMPONENT_LENGTH
};

});

parcelRequire.register("kqvfO", function(module, exports) {

var $h06VS = parcelRequire("h06VS");
var $edee7abef69a2797$require$MAX_SAFE_COMPONENT_LENGTH = $h06VS.MAX_SAFE_COMPONENT_LENGTH;

var $4wayy = parcelRequire("4wayy");
exports = module.exports = {
};
// The actual regexps go on exports.re
const re = exports.re = [];
const src = exports.src = [];
const t = exports.t = {
};
let R = 0;
const createToken = (name, value, isGlobal)=>{
    const index = R++;
    $4wayy(index, value);
    t[name] = index;
    src[index] = value;
    re[index] = new RegExp(value, isGlobal ? 'g' : undefined);
};
// The following Regular Expressions can be used for tokenizing,
// validating, and parsing SemVer version strings.
// ## Numeric Identifier
// A single `0`, or a non-zero digit followed by zero or more digits.
createToken('NUMERICIDENTIFIER', '0|[1-9]\\d*');
createToken('NUMERICIDENTIFIERLOOSE', '[0-9]+');
// ## Non-numeric Identifier
// Zero or more digits, followed by a letter or hyphen, and then zero or
// more letters, digits, or hyphens.
createToken('NONNUMERICIDENTIFIER', '\\d*[a-zA-Z-][a-zA-Z0-9-]*');
// ## Main Version
// Three dot-separated numeric identifiers.
createToken('MAINVERSION', `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})\\.` + `(${src[t.NUMERICIDENTIFIER]})`);
createToken('MAINVERSIONLOOSE', `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})\\.` + `(${src[t.NUMERICIDENTIFIERLOOSE]})`);
// ## Pre-release Version Identifier
// A numeric identifier, or a non-numeric identifier.
createToken('PRERELEASEIDENTIFIER', `(?:${src[t.NUMERICIDENTIFIER]}|${src[t.NONNUMERICIDENTIFIER]})`);
createToken('PRERELEASEIDENTIFIERLOOSE', `(?:${src[t.NUMERICIDENTIFIERLOOSE]}|${src[t.NONNUMERICIDENTIFIER]})`);
// ## Pre-release Version
// Hyphen, followed by one or more dot-separated pre-release version
// identifiers.
createToken('PRERELEASE', `(?:-(${src[t.PRERELEASEIDENTIFIER]}(?:\\.${src[t.PRERELEASEIDENTIFIER]})*))`);
createToken('PRERELEASELOOSE', `(?:-?(${src[t.PRERELEASEIDENTIFIERLOOSE]}(?:\\.${src[t.PRERELEASEIDENTIFIERLOOSE]})*))`);
// ## Build Metadata Identifier
// Any combination of digits, letters, or hyphens.
createToken('BUILDIDENTIFIER', '[0-9A-Za-z-]+');
// ## Build Metadata
// Plus sign, followed by one or more period-separated build metadata
// identifiers.
createToken('BUILD', `(?:\\+(${src[t.BUILDIDENTIFIER]}(?:\\.${src[t.BUILDIDENTIFIER]})*))`);
// ## Full Version String
// A main version, followed optionally by a pre-release version and
// build metadata.
// Note that the only major, minor, patch, and pre-release sections of
// the version string are capturing groups.  The build metadata is not a
// capturing group, because it should not ever be used in version
// comparison.
createToken('FULLPLAIN', `v?${src[t.MAINVERSION]}${src[t.PRERELEASE]}?${src[t.BUILD]}?`);
createToken('FULL', `^${src[t.FULLPLAIN]}$`);
// like full, but allows v1.2.3 and =1.2.3, which people do sometimes.
// also, 1.0.0alpha1 (prerelease without the hyphen) which is pretty
// common in the npm registry.
createToken('LOOSEPLAIN', `[v=\\s]*${src[t.MAINVERSIONLOOSE]}${src[t.PRERELEASELOOSE]}?${src[t.BUILD]}?`);
createToken('LOOSE', `^${src[t.LOOSEPLAIN]}$`);
createToken('GTLT', '((?:<|>)?=?)');
// Something like "2.*" or "1.2.x".
// Note that "x.x" is a valid xRange identifer, meaning "any version"
// Only the first item is strictly required.
createToken('XRANGEIDENTIFIERLOOSE', `${src[t.NUMERICIDENTIFIERLOOSE]}|x|X|\\*`);
createToken('XRANGEIDENTIFIER', `${src[t.NUMERICIDENTIFIER]}|x|X|\\*`);
createToken('XRANGEPLAIN', `[v=\\s]*(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:\\.(${src[t.XRANGEIDENTIFIER]})` + `(?:${src[t.PRERELEASE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGEPLAINLOOSE', `[v=\\s]*(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:\\.(${src[t.XRANGEIDENTIFIERLOOSE]})` + `(?:${src[t.PRERELEASELOOSE]})?${src[t.BUILD]}?` + `)?)?`);
createToken('XRANGE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAIN]}$`);
createToken('XRANGELOOSE', `^${src[t.GTLT]}\\s*${src[t.XRANGEPLAINLOOSE]}$`);
// Coercion.
// Extract anything that could conceivably be a part of a valid semver
createToken('COERCE', `${"(^|[^\\d])(\\d{1,"}${$edee7abef69a2797$require$MAX_SAFE_COMPONENT_LENGTH}})` + `(?:\\.(\\d{1,${$edee7abef69a2797$require$MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:\\.(\\d{1,${$edee7abef69a2797$require$MAX_SAFE_COMPONENT_LENGTH}}))?` + `(?:$|[^\\d])`);
createToken('COERCERTL', src[t.COERCE], true);
// Tilde ranges.
// Meaning is "reasonably at or greater than"
createToken('LONETILDE', '(?:~>?)');
createToken('TILDETRIM', `(\\s*)${src[t.LONETILDE]}\\s+`, true);
exports.tildeTrimReplace = '$1~';
createToken('TILDE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAIN]}$`);
createToken('TILDELOOSE', `^${src[t.LONETILDE]}${src[t.XRANGEPLAINLOOSE]}$`);
// Caret ranges.
// Meaning is "at least and backwards compatible with"
createToken('LONECARET', '(?:\\^)');
createToken('CARETTRIM', `(\\s*)${src[t.LONECARET]}\\s+`, true);
exports.caretTrimReplace = '$1^';
createToken('CARET', `^${src[t.LONECARET]}${src[t.XRANGEPLAIN]}$`);
createToken('CARETLOOSE', `^${src[t.LONECARET]}${src[t.XRANGEPLAINLOOSE]}$`);
// A simple gt/lt/eq thing, or just "" to indicate "any version"
createToken('COMPARATORLOOSE', `^${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]})$|^$`);
createToken('COMPARATOR', `^${src[t.GTLT]}\\s*(${src[t.FULLPLAIN]})$|^$`);
// An expression to strip any whitespace between the gtlt and the thing
// it modifies, so that `> 1.2.3` ==> `>1.2.3`
createToken('COMPARATORTRIM', `(\\s*)${src[t.GTLT]}\\s*(${src[t.LOOSEPLAIN]}|${src[t.XRANGEPLAIN]})`, true);
exports.comparatorTrimReplace = '$1$2$3';
// Something like `1.2.3 - 1.2.4`
// Note that these all use the loose form, because they'll be
// checked against either the strict or loose comparator form
// later.
createToken('HYPHENRANGE', `^\\s*(${src[t.XRANGEPLAIN]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAIN]})` + `\\s*$`);
createToken('HYPHENRANGELOOSE', `^\\s*(${src[t.XRANGEPLAINLOOSE]})` + `\\s+-\\s+` + `(${src[t.XRANGEPLAINLOOSE]})` + `\\s*$`);
// Star ranges basically just allow anything at all.
createToken('STAR', '(<|>)?=?\\s*\\*');
// >=0.0.0 is like a star
createToken('GTE0', '^\\s*>=\\s*0\.0\.0\\s*$');
createToken('GTE0PRE', '^\\s*>=\\s*0\.0\.0-0\\s*$');

});

parcelRequire.register("lOrTB", function(module, exports) {
// parse out just the options we care about so we always get a consistent
// obj with keys in a consistent order.
const $fe13e80942fc0071$var$opts = [
    'includePrerelease',
    'loose',
    'rtl'
];
const $fe13e80942fc0071$var$parseOptions = (options)=>!options ? {
    } : typeof options !== 'object' ? {
        loose: true
    } : $fe13e80942fc0071$var$opts.filter((k)=>options[k]
    ).reduce((options1, k)=>{
        options1[k] = true;
        return options1;
    }, {
    })
;
module.exports = $fe13e80942fc0071$var$parseOptions;

});

parcelRequire.register("1tH2l", function(module, exports) {
const $1139e21768676268$var$numeric = /^[0-9]+$/;
const $1139e21768676268$var$compareIdentifiers = (a, b)=>{
    const anum = $1139e21768676268$var$numeric.test(a);
    const bnum = $1139e21768676268$var$numeric.test(b);
    if (anum && bnum) {
        a = +a;
        b = +b;
    }
    return a === b ? 0 : anum && !bnum ? -1 : bnum && !anum ? 1 : a < b ? -1 : 1;
};
const $1139e21768676268$var$rcompareIdentifiers = (a, b)=>$1139e21768676268$var$compareIdentifiers(b, a)
;
module.exports = {
    compareIdentifiers: $1139e21768676268$var$compareIdentifiers,
    rcompareIdentifiers: $1139e21768676268$var$rcompareIdentifiers
};

});




//# sourceMappingURL=compare.1b61c4a6.js.map
