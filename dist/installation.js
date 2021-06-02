"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.installServeD = exports.isServeDUpToDate = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const compare_1 = __importDefault(require("semver/functions/compare"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execFile = util_1.promisify(child_process_1.execFile);
async function getCodeDBinFolder() {
    const home = process.env.HOME;
    if (typeof home === "string" && home !== "" && process.platform === "linux") {
        if (await fs_extra_1.pathExists(path_1.join(home, ".local", "share"))) {
            return path_1.join(home, ".local", "share", "code-d", "bin");
        }
        else {
            return path_1.join(home, ".code-d", "bin");
        }
    }
    else if (process.platform === "win32") {
        const appdata = process.env.APPDATA;
        if (typeof appdata === "string" && appdata !== "") {
            return path_1.join(appdata, "code-d", "bin");
        }
    }
    else if (typeof home === "string" && home !== "") {
        return path_1.join(home, ".code-d", "bin");
    }
    return "";
}
function isServeDInstalled(serveDPath) {
    return fs_extra_1.pathExists(serveDPath);
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
    const [givenVersion, targetVersion] = await Promise.all([getServeDVersion(givenFile), getServeDVersion(targetFile)]);
    if (typeof givenVersion === "string" &&
        typeof targetVersion === "string" &&
        givenVersion !== "" &&
        targetVersion !== "") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5zdGFsbGF0aW9uLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL2luc3RhbGxhdGlvbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQSx1Q0FBMkM7QUFDM0MsK0JBQW9DO0FBQ3BDLHVFQUFvRDtBQUVwRCxpREFBdUQ7QUFDdkQsK0JBQWdDO0FBQ2hDLE1BQU0sUUFBUSxHQUFHLGdCQUFTLENBQUMsd0JBQVcsQ0FBQyxDQUFBO0FBRXZDLEtBQUssVUFBVSxpQkFBaUI7SUFDOUIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUE7SUFDN0IsSUFBSSxPQUFPLElBQUksS0FBSyxRQUFRLElBQUksSUFBSSxLQUFLLEVBQUUsSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtRQUMzRSxJQUFJLE1BQU0scUJBQVUsQ0FBQyxXQUFJLENBQUMsSUFBSSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQyxFQUFFO1lBQ25ELE9BQU8sV0FBSSxDQUFDLElBQUksRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUN0RDthQUFNO1lBQ0wsT0FBTyxXQUFJLENBQUMsSUFBSSxFQUFFLFNBQVMsRUFBRSxLQUFLLENBQUMsQ0FBQTtTQUNwQztLQUNGO1NBQU0sSUFBSSxPQUFPLENBQUMsUUFBUSxLQUFLLE9BQU8sRUFBRTtRQUN2QyxNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQTtRQUNuQyxJQUFJLE9BQU8sT0FBTyxLQUFLLFFBQVEsSUFBSSxPQUFPLEtBQUssRUFBRSxFQUFFO1lBQ2pELE9BQU8sV0FBSSxDQUFDLE9BQU8sRUFBRSxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUE7U0FDdEM7S0FDRjtTQUFNLElBQUksT0FBTyxJQUFJLEtBQUssUUFBUSxJQUFJLElBQUksS0FBSyxFQUFFLEVBQUU7UUFDbEQsT0FB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QyxDQUFBO1NBQ3REO0tBQ0Y7U0FBTTtRQUNMLElBQUksQ0FBQyxDQUFDLE1BQU0saUJBQWlCLENBQUMsVUFBVSxDQUFDLENBQUMsRUFBRTtZQUMxQyxJQUFJLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FDekIsdUNBQXVDLE9BQU8sQ0FBQyxRQUFROzBEQUNMLGNBQWMscUJBQXFCLENBQ3RGLENBQUE7U0FDRjtLQUNGO0lBQ0QsT0FBTyxVQUFVLENBQUE7QUFDbkIsQ0FBQztBQXpCRCxzQ0F5QkMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBjb3B5LCBwYXRoRXhpc3RzIH0gZnJvbSBcImZzLWV4dHJhXCJcbmltcG9ydCB7IGpvaW4sIGRpcm5hbWUgfSBmcm9tIFwicGF0aFwiXG5pbXBvcnQgc2VtdmVyQ29tcGFyZSBmcm9tIFwic2VtdmVyL2Z1bmN0aW9ucy9jb21wYXJlXCJcblxuaW1wb3J0IHsgZXhlY0ZpbGUgYXMgZXhlY0ZpbGVSYXcgfSBmcm9tIFwiY2hpbGRfcHJvY2Vzc1wiXG5pbXBvcnQgeyBwcm9taXNpZnkgfSBmcm9tIFwidXRpbFwiXG5jb25zdCBleGVjRmlsZSA9IHByb21pc2lmeShleGVjRmlsZVJhdylcblxuYXN5bmMgZnVuY3Rpb24gZ2V0Q29kZURCaW5Gb2xkZXIoKSB7XG4gIGNvbnN0IGhvbWUgPSBwcm9jZXNzLmVudi5IT01FXG4gIGlmICh0eXBlb2YgaG9tZSA9PT0gXCJzdHJpbmdcIiAmJiBob21lICE9PSBcIlwiICYmIHByb2Nlc3MucGxhdGZvcm0gPT09IFwibGludXhcIikge1xuICAgIGlmIChhd2FpdCBwYXRoRXhpc3RzKGpvaW4oaG9tZSwgXCIubG9jYWxcIiwgXCJzaGFyZVwiKSkpIHtcbiAgICAgIHJldHVybiBqb2luKGhvbWUsIFwiLmxvY2FsXCIsIFwic2hhcmVcIiwgXCJjb2RlLWRcIiwgXCJiaW5cIilcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGpvaW4oaG9tZSwgXCIuY29kZS1kXCIsIFwiYmluXCIpXG4gICAgfVxuICB9IGVsc2UgaWYgKHByb2Nlc3MucGxhdGZvcm0gPT09IFwid2luMzJcIikge1xuICAgIGNvbnN0IGFwcGRhdGEgPSBwcm9jZXNzLmVudi5BUFBEQVRBXG4gICAgaWYgKHR5cGVvZiBhcHBkYXRhID09PSBcInN0cmluZ1wiICYmIGFwcGRhdGEgIT09IFwiXCIpIHtcbiAgICAgIHJldHVybiBqb2luKGFwcGRhdGEsIFwiY29kZS1kXCIsIFwiYmluXCIpXG4gICAgfVxuICB9IGVsc2UgaWYgKHR5cGVvZiBob21lID09PSBcInN0cmluZ1wiICYmIGhvbWUgIT09IFwiXCIpIHtcbiAgICByZXR1cm4gam9pbihob21lLCBcIi5jb2RlLWRcIiwgXCJiaW5cIilcbiAgfVxuICByZXR1cm4gXCJcIlxufVxuXG5mdW5jdGlvbiBpc1NlcnZlREluc3RhbGxlZChzZXJ2ZURQYXRoOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHBhdGhFeGlzdHMoc2VydmVEUGF0aClcbn1cblxuLyoqIEdldCB0aGUgdmVyc2lvbiBvZiBzZXJ2ZS1kICovXG5hc3luYyBmdW5jdGlvbiBnZXRTZXJ2ZURWZXJzaW9uKGZpbGU6IHN0cmluZykge1xuICB0cnkge1xuICAgIGNvbnN0IG91dHB1dCA9IChhd2FpdCBleGVjRmlsZShmaWxlLCBbXCItLXZlcnNpb25cIl0pKS5zdGRlcnJcbiAgICBjb25zdCB2ZXJzaW9uID0gb3V0cHV0Lm1hdGNoKC92KFxcZFxcUyopXFxzLyk/LlsxXVxuICAgIHJldHVybiB2ZXJzaW9uXG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjb25zb2xlLmVycm9yKGUpXG4gICAgcmV0dXJuIHVuZGVmaW5lZFxuICB9XG59XG5cbi8qKiBDaGVjayBpZiB0aGUgZ2l2ZW4gc2VydmUtZCBpcyB1cCB0byBkYXRlIGFnYWluc3QgdGhlIHRhcmdldCB2ZXJzaW9uICovXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gaXNTZXJ2ZURVcFRvRGF0ZShnaXZlbkZpbGU6IHN0cmluZywgdGFyZ2V0RmlsZTogc3RyaW5nKSB7XG4gIGNvbnN0IFtnaXZlblZlcnNpb24sIHRhcmdldFZlcnNpb25dID0gYXdhaXQgUHJvbWlzZS5hbGwoW2dldFNlcnZlRFZlcnNpb24oZ2l2ZW5GaWxlKSwgZ2V0U2VydmVEVmVyc2lvbih0YXJnZXRGaWxlKV0pXG4gIGlmIChcbiAgICB0eXBlb2YgZ2l2ZW5WZXJzaW9uID09PSBcInN0cmluZ1wiICYmXG4gICAgdHlwZW9mIHRhcmdldFZlcnNpb24gPT09IFwic3RyaW5nXCIgJiZcbiAgICBnaXZlblZlcnNpb24gIT09IFwiXCIgJiZcbiAgICB0YXJnZXRWZXJzaW9uICE9PSBcIlwiXG4gICkge1xuICAgIHJldHVybiBzZW12ZXJDb21wYXJlKGdpdmVuVmVyc2lvbiwgdGFyZ2V0VmVyc2lvbikgIT09IC0xXG4gIH0gZWxzZSB7XG4gICAgLy8gYXNzdW1lIGdpdmVuIHZlcnNpb24gaXMgb2xkXG4gICAgcmV0dXJuIGZhbHNlXG4gIH1cbn1cblxuYXN5bmMgZnVuY3Rpb24gY29weVNlcnZlRChidW5kbGVkU2VydmVyRm9sZGVyOiBzdHJpbmcsIGNvZGVEQmluRm9sZGVyOiBzdHJpbmcpIHtcbiAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEluZm8oXCJJbnN0YWxsaW5nIEQgc2VydmVycy4uLlwiKVxuICAvLyBjb3B5IHRoZSB3aG9sZSBzZXJ2ZWQgZm9sZGVyXG4gIGF3YWl0IGNvcHkoYnVuZGxlZFNlcnZlckZvbGRlciwgY29kZURCaW5Gb2xkZXIsIHsgb3ZlcndyaXRlOiB0cnVlIH0pXG4gIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiRCBzZXJ2ZXJzIHdhcyBpbnN0YWxsZWRcIilcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGluc3RhbGxTZXJ2ZUQoKSB7XG4gIGNvbnN0IGRpc3RGb2xkZXIgPSBqb2luKGRpcm5hbWUoX19kaXJuYW1lKSwgXCJkaXN0XCIpXG5cbiAgY29uc3QgZXhlRXh0ZW50aW9uID0gcHJvY2Vzcy5wbGF0Zm9ybSA9PT0gXCJ3aW4zMlwiID8gXCIuZXhlXCIgOiBcIlwiXG4gIGNvbnN0IHNlcnZlREV4ZUZpbGVOYW1lID0gYHNlcnZlLWQke2V4ZUV4dGVudGlvbn1gXG5cbiAgY29uc3QgYnVuZGxlZFNlcnZlckZvbGRlciA9IGpvaW4oZGlzdEZvbGRlciwgYCR7cHJvY2Vzcy5wbGF0Zm9ybX0tJHtwcm9jZXNzLmFyY2h9YClcblxuICBjb25zdCBjb2RlREJpbkZvbGRlciA9IGF3YWl0IGdldENvZGVEQmluRm9sZGVyKClcbiAgY29uc3Qgc2VydmVEUGF0aCA9IGpvaW4oY29kZURCaW5Gb2xkZXIsIHNlcnZlREV4ZUZpbGVOYW1lKVxuXG4gIGlmIChidW5kbGVkU2VydmVyRm9sZGVyKSB7XG4gICAgY29uc3QgYnVuZGxlZFNlcnZlRFBhdGggPSBqb2luKGJ1bmRsZWRTZXJ2ZXJGb2xkZXIsIHNlcnZlREV4ZUZpbGVOYW1lKVxuICAgIGlmICghKGF3YWl0IGlzU2VydmVESW5zdGFsbGVkKHNlcnZlRFBhdGgpKSB8fCAhKGF3YWl0IGlzU2VydmVEVXBUb0RhdGUoc2VydmVEUGF0aCwgYnVuZGxlZFNlcnZlRFBhdGgpKSkge1xuICAgICAgYXdhaXQgY29weVNlcnZlRChidW5kbGVkU2VydmVyRm9sZGVyLCBjb2RlREJpbkZvbGRlcilcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgaWYgKCEoYXdhaXQgaXNTZXJ2ZURJbnN0YWxsZWQoc2VydmVEUGF0aCkpKSB7XG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkRXJyb3IoXG4gICAgICAgIGBzZXJ2ZS1kIGJpbmFyeSBpcyBub3QgYXZhaWxhYmxlIGZvciAke3Byb2Nlc3MucGxhdGZvcm19LlxuICAgICAgICBQbGVhc2UgYnVpbHQgaXQgZnJvbSB0aGUgc291cmNlLCBwbGFjZSBpdCB1bmRlciAke2NvZGVEQmluRm9sZGVyfSwgYW5kIHJlc3RhcnQgQXRvbS5gXG4gICAgICApXG4gICAgfVxuICB9XG4gIHJldHVybiBzZXJ2ZURQYXRoXG59XG4iXX0=