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
        return false;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2luc3RhbGxhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1Q0FBK0I7QUFDL0IsOERBQW9DO0FBQ3BDLCtCQUFvQztBQUNwQyx1RUFBb0Q7QUFFcEQsaURBQXVEO0FBQ3ZELCtCQUFnQztBQUNoQyxNQUFNLFFBQVEsR0FBRyxnQkFBUyxDQUFDLHdCQUFXLENBQUMsQ0FBQTtBQUV2QyxLQUFLLFVBQVUsaUJBQWlCO0lBQzlCLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUE7SUFDaEMsSUFBSSxJQUFJLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7UUFDeEMsSUFBSSxNQUFNLHFCQUFVLENBQUMsV0FBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxDQUFDLENBQUMsRUFBRTtZQUNuRCxPQUFPLFdBQUksQ0FBQyxJQUFJLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDdEQ7YUFBTTtZQUNMLE9BQU8sV0FBSSxDQUFDLElBQUksRUFBRSxTQUFTLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDcEM7S0FDRjtTQUFNLElBQUksT0FBTyxDQUFDLFFBQVEsS0FBSyxPQUFPLEVBQUU7UUFDdkMsTUFBTSxPQUFPLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxTQUFTLENBQUMsQ0FBQTtRQUN0QyxJQUFJLE9BQU8sRUFBRTtZQUNYLE9BQU8sV0FBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDdEM7S0FDRjtTQUFNLElBQUksSUFBSSxFQUFFO1FBQ2YsT0FBTyxXQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtLQUNwQztJQUNELE9BQU8sRUFBRSxDQUFBO0FBQ1gsQ0FBQztB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RCxPQUFPLFVBQVUsQ0FBQTtBQUNuQixDQUFDO0FBekJELHNDQXlCQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGNvcHkgfSBmcm9tIFwiZnMtZXh0cmFcIlxuaW1wb3J0IHBhdGhFeGlzdHMgZnJvbSBcInBhdGgtZXhpc3RzXCJcbmltcG9ydCB7IGpvaW4sIGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgc2VtdmVyQ29tcGFyZSBmcm9tIFwic2VtdmVyL2Z1bmN0aW9ucy9jb21wYXJlXCJcblxuaW1wb3J0IHsgZXhlY0ZpbGUgYXMgZXhlY0ZpbGVSYXcgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tIFwidXRpbFwiXG5jb25zdCBleGVjRmlsZSA9IHByb21pc2lmeShleGVjRmlsZVJhdylcblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q29kZURCaW5Gb2xkZXIoKSB7XG4gIGNvbnN0IGhvbWUgPSBwcm9jZXNzLmVudltcIkhPTUVcIl1cbiAgaWYgKGhvbWUgJiYgcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJsaW51eFwiKSB7XG4gICAgaWYgKGF3YWl0IHBhdGhFeGlzdHMoam9pbihob21lLCBcIi5sb2NhbFwiLCBcInNoYXJlXCIpKSkge1xuICAgICAgcmV0dXJuIGpvaW4oaG9tZSwgXCIubG9jYWxcIiwgXCJzaGFyZVwiLCBcImNvZGUtZFwiLCBcImJpblwiKVxuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gam9pbihob21lLCBcIi5jb2RlLWRcIiwgXCJiaW5cIilcbiAgICB9XG4gIH0gZWxzZSBpZiAocHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiKSB7XG4gICAgY29uc3QgYXBwZGF0YSA9IHByb2Nlc3MuZW52W1wiQVBQREFUQVwiXVxuICAgIGlmIChhcHBkYXRhKSB7XG4gICAgICByZXR1cm4gam9pbihhcHBkYXRhLCBcImNvZGUtZFwiLCBcImJpblwiKVxuICAgIH1cbiAgfSBlbHNlIGlmIChob21lKSB7XG4gICAgcmV0dXJuIGpvaW4oaG9tZSwgXCIuY29kZS1kXCIsIFwiYmluXCIpXG4gIH1cbiAgcmV0dXJuIFwiXCJcbn1cblxuYXN5bmMgZnVuY3Rpb24gaXNTZXJ2ZURJbnN0YWxsZWQoc2VydmVEUGF0aDogc3RyaW5nKSB7XG4gIHJldHVybiBwYXRoRXhpc3RzKHNlcnZlRFBhdGgpXG59XG5cbi8qKiBnZXQgdGhlIHZlcnNpb24gb2Ygc2VydmUtZCAqL1xuYXN5bmMgZnVuY3Rpb24gZ2V0U2VydmVEVmVyc2lvbihmaWxlOiBzdHJpbmcpIHtcbiAgdHJ5IHtcbiAgICBjb25zdCBvdXRwdXQgPSAoYXdhaXQgZXhlY0ZpbGUoZmlsZSwgW1wiLS12ZXJzaW9uXCJdKSkuc3RkZXJyXG4gICAgY29uc3QgdmVyc2lvbiA9IG91dHB1dC5tYXRjaCgvdihcXGRcXFMqKVxccy8pPy5bMV1cbiAgICByZXR1cm4gdmVyc2lvblxuICB9IGNhdGNoIChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlKVxuICAgIHJldHVybiB1bmRlZmluZWRcbiAgfVxufVxuXG4vKiogQ2hlY2sgaWYgdGhlIGdpdmVuIHNlcnZlLWQgaXMgdXAgdG8gZGF0ZSBhZ2FpbnN0IHRoZSB0YXJnZXQgdmVyc2lvbiAqL1xuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGlzU2VydmVEVXBUb0RhdGUoZ2l2ZW5GaWxlOiBzdHJpbmcsIHRhcmdldEZpbGU6IHN0cmluZykge1xuICBjb25zdCBnaXZlblZlcnNpb24gPSBhd2FpdCBnZXRTZXJ2ZURWZXJzaW9uKGdpdmVuRmlsZSlcbiAgY29uc3QgdGFyZ2V0VmVyc2lvbiA9IGF3YWl0IGdldFNlcnZlRFZlcnNpb24odGFyZ2V0RmlsZSlcbiAgaWYgKGdpdmVuVmVyc2lvbiAmJiB0YXJnZXRWZXJzaW9uKSB7XG4gICAgcmV0dXJuIHNlbXZlckNvbXBhcmUoZ2l2ZW5WZXJzaW9uLCB0YXJnZXRWZXJzaW9uKSAhPT0gLTFcbiAgfSBlbHNlIHtcbiAgICAvLyBhc3N1bWUgZ2l2ZW4gdmVyc2lvbiBpcyBvbGRcbiAgICByZXR1cm4gZmFsc2VcbiAgfVxufVxuXG5hc3luYyBmdW5jdGlvbiBjb3B5U2VydmVEKGJ1bmRsZWRTZXJ2ZXJGb2xkZXI6IHN0cmluZywgY29kZURCaW5Gb2xkZXI6IHN0cmluZykge1xuICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkSW5mbyhcIkluc3RhbGxpbmcgRCBzZXJ2ZXJzLi4uXCIpXG4gIC8vIGNvcHkgdGhlIHdob2xlIHNlcnZlZCBmb2xkZXJcbiAgYXdhaXQgY29weShidW5kbGVkU2VydmVyRm9sZGVyLCBjb2RlREJpbkZvbGRlciwgeyBvdmVyd3JpdGU6IHRydWUgfSlcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZFN1Y2Nlc3MoXCJEIHNlcnZlcnMgd2FzIGluc3RhbGxlZFwiKVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaW5zdGFsbFNlcnZlRCgpIHtcbiAgY29uc3QgZGlzdEZvbGRlciA9IGpvaW4oZGlybmFtZShfX2Rpcm5hbWUpLCBcImRpc3RcIilcblxuICBjb25zdCBleGVFeHRlbnRpb24gPSBwcm9jZXNzLnBsYXRmb3JtID09PSBcIndpbjMyXCIgPyBcIi5leGVcIiA6IFwiXCJcbiAgY29uc3Qgc2VydmVERXhlRmlsZU5hbWUgPSBgc2VydmUtZCR7ZXhlRXh0ZW50aW9ufWBcblxuICBjb25zdCBidW5kbGVkU2VydmVyRm9sZGVyID0gam9pbihkaXN0Rm9sZGVyLCBgJHtwcm9jZXNzLnBsYXRmb3JtfS0ke3Byb2Nlc3MuYXJjaH1gKVxuXG4gIGNvbnN0IGNvZGVEQmluRm9sZGVyID0gYXdhaXQgZ2V0Q29kZURCaW5Gb2xkZXIoKVxuICBjb25zdCBzZXJ2ZURQYXRoID0gam9pbihjb2RlREJpbkZvbGRlciwgc2VydmVERXhlRmlsZU5hbWUpXG5cbiAgaWYgKGJ1bmRsZWRTZXJ2ZXJGb2xkZXIpIHtcbiAgICBjb25zdCBidW5kbGVkU2VydmVEUGF0aCA9IGpvaW4oYnVuZGxlZFNlcnZlckZvbGRlciwgc2VydmVERXhlRmlsZU5hbWUpXG4gICAgaWYgKCEoYXdhaXQgaXNTZXJ2ZURJbnN0YWxsZWQoc2VydmVEUGF0aCkpIHx8ICEoYXdhaXQgaXNTZXJ2ZURVcFRvRGF0ZShzZXJ2ZURQYXRoLCBidW5kbGVkU2VydmVEUGF0aCkpKSB7XG4gICAgICBhd2FpdCBjb3B5U2VydmVEKGJ1bmRsZWRTZXJ2ZXJGb2xkZXIsIGNvZGVEQmluRm9sZGVyKVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBpZiAoIShhd2FpdCBpc1NlcnZlREluc3RhbGxlZChzZXJ2ZURQYXRoKSkpIHtcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRFcnJvcihcbiAgICAgICAgYHNlcnZlLWQgYmluYXJ5IGlzIG5vdCBhdmFpbGFibGUgZm9yICR7cHJvY2Vzcy5wbGF0Zm9ybX0uXG4gICAgICAgIFBsZWFzZSBidWlsdCBpdCBmcm9tIHRoZSBzb3VyY2UsIHBsYWNlIGl0IHVuZGVyICR7Y29kZURCaW5Gb2xkZXJ9LCBhbmQgcmVzdGFydCBBdG9tLmBcbiAgICAgIClcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNlcnZlRFBhdGhcbn1cbiJdfQ==