"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installServeD = exports.isServeDUpToDate = void 0;
const fs_extra_1 = require("fs-extra");
const path_exists_1 = __importDefault(require("path-exists"));
const path_1 = require("path");
const compare_1 = __importDefault(require("semver/functions/compare"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFile = util_1.promisify(child_process_1.execFile);
async function getCodeDBinFolder() {
    const home = process.env["HOME"];
    if (home && process.platform === "linux") {
        if (await path_exists_1.default(path_1.join(home, ".local", "share"))) {
            return path_1.join(home, ".local", "share", "code-d", "bin");
        }
        else {
            return path_1.join(home, ".code-d", "bin");
        }
    }
    else if (process.platform === "win32") {
        const appdata = process.env["APPDATA"];
        if (appdata) {
            return path_1.join(appdata, "code-d", "bin");
        }
    }
    else if (home) {
        return path_1.join(home, ".code-d", "bin");
    }
    return "";
}
async function isServeDInstalled(serveDPath) {
    return path_exists_1.default(serveDPath);
}
async function getServeDVersion(file) {
    var _a;
    try {
        const output = (await execFile(file, ["--version"])).stderr;
        const version = (_a = output.match(/v(\d\S*)\s/)) === null || _a === void 0 ? void 0 : _a[1];
        return version;
    }
    catch (e) {
        console.error(e);
        return undefined;
    }
}
async function isServeDUpToDate(givenFile, targetFile) {
    const givenVersion = await getServeDVersion(givenFile);
    const targetVersion = await getServeDVersion(targetFile);
    if (givenVersion && targetVersion) {
        return compare_1.default(givenVersion, targetVersion) !== -1;
    }
    else {
        return -1;
    }
}
exports.isServeDUpToDate = isServeDUpToDate;
async function copyServeD(bundledServerFolder, codeDBinFolder) {
    atom.notifications.addInfo("Installing D servers...");
    await fs_extra_1.copy(bundledServerFolder, codeDBinFolder, { overwrite: true });
    atom.notifications.addSuccess("D servers was installed");
}
async function installServeD() {
    const distFolder = path_1.join(path_1.dirname(__dirname), "dist");
    const exeExtention = process.platform === "win32" ? ".exe" : "";
    const serveDExeFileName = `serve-d${exeExtention}`;
    const bundledServerFolder = path_1.join(distFolder, `${process.platform}-${process.arch}`);
    const codeDBinFolder = await getCodeDBinFolder();
    const serveDPath = path_1.join(codeDBinFolder, serveDExeFileName);
    if (bundledServerFolder) {
        const bundledServeDPath = path_1.join(bundledServerFolder, serveDExeFileName);
        if (!(await isServeDInstalled(serveDPath)) || !(await isServeDUpToDate(serveDPath, bundledServeDPath))) {
            await copyServeD(bundledServerFolder, codeDBinFolder);
        }
    }
    else {
        if (!(await isServeDInstalled(serveDPath))) {
            atom.notifications.addError(`serve-d binary is not available for ${process.platform}.
        Please built it from the source, place it under ${codeDBinFolder}, and restart Atom.`);
        }
    }
    return serveDPath;
}
exports.installServeD = installServeD;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2luc3RhbGxhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1Q0FBK0I7QUFDL0IsOERBQW9DO0FBQ3BDLCtCQUFvQztBQUNwQyx1RUFBb0Q7QUFFcEQsaURBQXVEO0FBQ3ZELCtCQUFnQztBQUNoQyxNQUFNLFFBQVEsR0FBRyxnQkFBUyxDQUFDLHdCQUFXLENBQUMsQ0FBQTtBQUV2QyxLQUFLLFVBQVUsaUJBQWlCO0lBQzlCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDaEMsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7UUFDeEMsSUFBSSxNQUFNLHFCQUFVLENBQUMsV0FBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRTtZQUNuRCxPQUFPLFdBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDdEQ7YUFBTTtZQUNMLE9BQU8sV0FBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDcEM7S0FDRjtTQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7UUFDdkMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUN0QyxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sV0FBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDdEM7S0FDRjtTQUFNLElBQUksSUFBSSxFQUFFO1FBQ2YsT0FBTyxXQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtLQUNwQztJQUNELE9BQU8sRUFBRSxDQUFBO0FBQ1gsQ0FBQztB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RjtJQUNELE9BQU8sVUFBVSxDQUFBO0FBQ25CLENBQUM7QUF6QkQsc0NBeUJDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgY29weSB9IGZyb20gXCJmcy1leHRyYVwiXG5pbXBvcnQgcGF0aEV4aXN0cyBmcm9tIFwicGF0aC1leGlzdHNcIlxuaW1wb3J0IHsgam9pbiwgZGlybmFtZSB9IGZyb20gXCJwYXRoXCJcbmltcG9ydCBzZW12ZXJDb21wYXJlIGZyb20gXCJzZW12ZXIvZnVuY3Rpb25zL2NvbXBhcmVcIlxuXG5pbXBvcnQgeyBleGVjRmlsZSBhcyBleGVjRmlsZVJhdyB9IGZyb20gXCJjaGlsZF9wcm9jZXNzXCJcbmltcG9ydCB7IHByb21pc2lmeSB9IGZyb20gXCJ1dGlsXCJcbmNvbnN0IGV4ZWNGaWxlID0gcHJvbWlzaWZ5KGV4ZWNGaWxlUmF3KVxuXG5hc3luYyBmdW5jdGlvbiBnZXRDb2RlREJpbkZvbGRlcigpIHtcbiAgY29uc3QgaG9tZSA9IHByb2Nlc3MuZW52W1wiSE9NRVwiXVxuICBpZiAoaG9tZSAmJiBwcm9jZXNzLnBsYXRmb3JtID09PSBcImxpbnV4XCIpIHtcbiAgICBpZiAoYXdhaXQgcGF0aEV4aXN0cyhqb2luKGhvbWUsIFwiLmxvY2FsXCIsIFwic2hhcmVcIikpKSB7XG4gICAgICByZXR1cm4gam9pbihob21lLCBcIi5sb2NhbFwiLCBcInNoYXJlXCIsIFwiY29kZS1kXCIsIFwiYmluXCIpXG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBqb2luKGhvbWUsIFwiLmNvZGUtZFwiLCBcImJpblwiKVxuICAgIH1cbiAgfSBlbHNlIGlmIChwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIpIHtcbiAgICBjb25zdCBhcHBkYXRhID0gcHJvY2Vzcy5lbnZbXCJBUFBEQVRBXCJdXG4gICAgaWYgKGFwcGRhdGEpIHtcbiAgICAgIHJldHVybiBqb2luKGFwcGRhdGEsIFwiY29kZS1kXCIsIFwiYmluXCIpXG4gICAgfVxuICB9IGVsc2UgaWYgKGhvbWUpIHtcbiAgICByZXR1cm4gam9pbihob21lLCBcIi5jb2RlLWRcIiwgXCJiaW5cIilcbiAgfVxuICByZXR1cm4gXCJcIlxufVxuXG5hc3luYyBmdW5jdGlvbiBpc1NlcnZlREluc3RhbGxlZChzZXJ2ZURQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHBhdGhFeGlzdHMoc2VydmVEUGF0aClcbn1cblxuLyoqIGdldCB0aGUgdmVyc2lvbiBvZiBzZXJ2ZS1kICovXG5hc3luYyBmdW5jdGlvbiBnZXRTZXJ2ZURWZXJzaW9uKGZpbGU6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IG91dHB1dCA9IChhd2FpdCBleGVjRmlsZShmaWxlLCBbXCItLXZlcnNpb25cIl0pKS5zdGRlcnJcbiAgICBjb25zdCB2ZXJzaW9uID0gb3V0cHV0Lm1hdGNoKC92KFxcZFxcUyopXFxzLyk/LlsxXVxuICAgIHJldHVybiB2ZXJzaW9uXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG5cbi8qKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VydmUtZCBpcyB1cCB0byBkYXRlIGFnYWluc3QgdGhlIHRhcmdldCB2ZXJzaW9uICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNTZXJ2ZURVcFRvRGF0ZShnaXZlbkZpbGU6IHN0cmluZywgdGFyZ2V0RmlsZTogc3RyaW5nKSB7XG4gIGNvbnN0IGdpdmVuVmVyc2lvbiA9IGF3YWl0IGdldFNlcnZlRFZlcnNpb24oZ2l2ZW5GaWxlKVxuICBjb25zdCB0YXJnZXRWZXJzaW9uID0gYXdhaXQgZ2V0U2VydmVEVmVyc2lvbih0YXJnZXRGaWxlKVxuICBpZiAoZ2l2ZW5WZXJzaW9uICYmIHRhcmdldFZlcnNpb24pIHtcbiAgICByZXR1cm4gc2VtdmVyQ29tcGFyZShnaXZlblZlcnNpb24sIHRhcmdldFZlcnNpb24pICE9PSAtMVxuICB9IGVsc2Uge1xuICAgIC8vIGFzc3VtZSBnaXZlbiB2ZXJzaW9uIGlzIG9sZFxuICAgIHJldHVybiAtMVxuICB9XG59XG5cbmFzeW5jIGZ1bmN0aW9uIGNvcHlTZXJ2ZUQoYnVuZGxlZFNlcnZlckZvbGRlcjogc3RyaW5nLCBjb2RlREJpbkZvbGRlcjogc3RyaW5nKSB7XG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRJbmZvKFwiSW5zdGFsbGluZyBEIHNlcnZlcnMuLi5cIilcbiAgLy8gY29weSB0aGUgd2hvbGUgc2VydmVkIGZvbGRlclxuICBhd2FpdCBjb3B5KGJ1bmRsZWRTZXJ2ZXJGb2xkZXIsIGNvZGVEQmluRm9sZGVyLCB7IG92ZXJ3cml0ZTogdHJ1ZSB9KVxuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcIkQgc2VydmVycyB3YXMgaW5zdGFsbGVkXCIpXG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBpbnN0YWxsU2VydmVEKCkge1xuICBjb25zdCBkaXN0Rm9sZGVyID0gam9pbihkaXJuYW1lKF9fZGlybmFtZSksIFwiZGlzdFwiKVxuXG4gIGNvbnN0IGV4ZUV4dGVudGlvbiA9IHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIiA/IFwiLmV4ZVwiIDogXCJcIlxuICBjb25zdCBzZXJ2ZURFeGVGaWxlTmFtZSA9IGBzZXJ2ZS1kJHtleGVFeHRlbnRpb259YFxuXG4gIGNvbnN0IGJ1bmRsZWRTZXJ2ZXJGb2xkZXIgPSBqb2luKGRpc3RGb2xkZXIsIGAke3Byb2Nlc3MucGxhdGZvcm19LSR7cHJvY2Vzcy5hcmNofWApXG5cbiAgY29uc3QgY29kZURCaW5Gb2xkZXIgPSBhd2FpdCBnZXRDb2RlREJpbkZvbGRlcigpXG4gIGNvbnN0IHNlcnZlRFBhdGggPSBqb2luKGNvZGVEQmluRm9sZGVyLCBzZXJ2ZURFeGVGaWxlTmFtZSlcblxuICBpZiAoYnVuZGxlZFNlcnZlckZvbGRlcikge1xuICAgIGNvbnN0IGJ1bmRsZWRTZXJ2ZURQYXRoID0gam9pbihidW5kbGVkU2VydmVyRm9sZGVyLCBzZXJ2ZURFeGVGaWxlTmFtZSlcbiAgICBpZiAoIShhd2FpdCBpc1NlcnZlREluc3RhbGxlZChzZXJ2ZURQYXRoKSkgfHwgIShhd2FpdCBpc1NlcnZlRFVwVG9EYXRlKHNlcnZlRFBhdGgsIGJ1bmRsZWRTZXJ2ZURQYXRoKSkpIHtcbiAgICAgIGF3YWl0IGNvcHlTZXJ2ZUQoYnVuZGxlZFNlcnZlckZvbGRlciwgY29kZURCaW5Gb2xkZXIpXG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGlmICghKGF3YWl0IGlzU2VydmVESW5zdGFsbGVkKHNlcnZlRFBhdGgpKSkge1xuICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKFxuICAgICAgICBgc2VydmUtZCBiaW5hcnkgaXMgbm90IGF2YWlsYWJsZSBmb3IgJHtwcm9jZXNzLnBsYXRmb3JtfS5cbiAgICAgICAgUGxlYXNlIGJ1aWx0IGl0IGZyb20gdGhlIHNvdXJjZSwgcGxhY2UgaXQgdW5kZXIgJHtjb2RlREJpbkZvbGRlcn0sIGFuZCByZXN0YXJ0IEF0b20uYFxuICAgICAgKVxuICAgIH1cbiAgfVxuICByZXR1cm4gc2VydmVEUGF0aFxufVxuIl19