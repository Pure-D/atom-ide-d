"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const atom_languageclient_1 = require("atom-languageclient");
class DLanguageClient extends atom_languageclient_1.AutoLanguageClient {
    activate() {
        super.activate();
        if (!atom.packages.isPackageLoaded("atom-ide-base")) {
            require("atom-package-deps").install("ide-d", true);
            atom.packages.enablePackage("atom-ide-base");
            atom.notifications.addSuccess("ide-d: atom-ide-base was installed and enabled...");
        }
    }
    getGrammarScopes() {
        return ["source.d", "D"];
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
    async startServerProcess(projectPath) {
        const { installServeD } = await Promise.resolve().then(() => __importStar(require("./installation")));
        const serveDPath = await installServeD();
        const serveD = super.spawn(serveDPath, ["--require", "workspaces"], {
            cwd: projectPath,
        });
        return serveD;
    }
}
module.exports = new DLanguageClient();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlLWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaWRlLWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQXdEO0FBRXhELE1BQU0sZUFBZ0IsU0FBUSx3Q0FBa0I7SUFDOUMsUUFBUTtRQUNOLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFHbkQsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUVuRCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxtREFBbUQsQ0FBQyxDQUFBO1NBQ25GO0lBQ0gsQ0FBQztJQUdELGdCQUFnQjtRQUNkLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUNELGVBQWU7UUFDYixPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7SUFDRCxhQUFhO1FBQ1gsT0FBTyxTQUFTLENBQUE7SUFDbEIsQ0FBQztJQUVELGlCQUFpQjtRQUNmLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFHRCxLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBbUI7UUFFMUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLHdEQUFhLGdCQUFnQixHQUFDLENBQUE7UUFFeEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxhQUFhLEVBQUUsQ0FBQTtRQUV4QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxDQUFDLFdBQVcsRUFBRSxZQUFZLENBQUMsRUFBRTtZQUNsRSxHQUFHLEVBQUUsV0FBVztTQUNqQixDQUFDLENBQUE7UUFFRixPQUFPLE1BQU0sQ0FBQTtJQUNmLENBQUM7Q0FDRjtBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLEVBQUUsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEF1dG9MYW5ndWFnZUNsaWVudCB9IGZyb20gXCJhdG9tLWxhbmd1YWdlY2xpZW50XCJcblxuY2xhc3MgRExhbmd1YWdlQ2xpZW50IGV4dGVuZHMgQXV0b0xhbmd1YWdlQ2xpZW50IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgc3VwZXIuYWN0aXZhdGUoKVxuICAgIGlmICghYXRvbS5wYWNrYWdlcy5pc1BhY2thZ2VMb2FkZWQoXCJhdG9tLWlkZS1iYXNlXCIpKSB7XG4gICAgICAvLyBpbnN0YWxsIGlmIG5vdCBpbnN0YWxsZWRcbiAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBAdHlwZXNjcmlwdC1lc2xpbnQvbm8tdmFyLXJlcXVpcmVzXG4gICAgICByZXF1aXJlKFwiYXRvbS1wYWNrYWdlLWRlcHNcIikuaW5zdGFsbChcImlkZS1kXCIsIHRydWUpXG4gICAgICAvLyBlbmFibGUgaWYgZGlzYWJsZWRcbiAgICAgIGF0b20ucGFja2FnZXMuZW5hYmxlUGFja2FnZShcImF0b20taWRlLWJhc2VcIilcbiAgICAgIGF0b20ubm90aWZpY2F0aW9ucy5hZGRTdWNjZXNzKFwiaWRlLWQ6IGF0b20taWRlLWJhc2Ugd2FzIGluc3RhbGxlZCBhbmQgZW5hYmxlZC4uLlwiKVxuICAgIH1cbiAgfVxuXG4gIC8qIGVzbGludC1kaXNhYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cbiAgZ2V0R3JhbW1hclNjb3BlcygpIHtcbiAgICByZXR1cm4gW1wic291cmNlLmRcIiwgXCJEXCJdXG4gIH1cbiAgZ2V0TGFuZ3VhZ2VOYW1lKCkge1xuICAgIHJldHVybiBcIkRcIlxuICB9XG4gIGdldFNlcnZlck5hbWUoKSB7XG4gICAgcmV0dXJuIFwic2VydmUtZFwiXG4gIH1cblxuICBnZXRDb25uZWN0aW9uVHlwZSgpOiBcInN0ZGlvXCIge1xuICAgIHJldHVybiBcInN0ZGlvXCJcbiAgfVxuICAvKiBlc2xpbnQtZW5hYmxlIGNsYXNzLW1ldGhvZHMtdXNlLXRoaXMgKi9cblxuICBhc3luYyBzdGFydFNlcnZlclByb2Nlc3MocHJvamVjdFBhdGg6IHN0cmluZykge1xuICAgIC8vIGltcG9ydCBvbmx5IHdoZW4gYSBEIGZpbGUgaXMgb3BlbmVkLlxuICAgIGNvbnN0IHsgaW5zdGFsbFNlcnZlRCB9ID0gYXdhaXQgaW1wb3J0KFwiLi9pbnN0YWxsYXRpb25cIilcblxuICAgIGNvbnN0IHNlcnZlRFBhdGggPSBhd2FpdCBpbnN0YWxsU2VydmVEKClcblxuICAgIGNvbnN0IHNlcnZlRCA9IHN1cGVyLnNwYXduKHNlcnZlRFBhdGgsIFtcIi0tcmVxdWlyZVwiLCBcIndvcmtzcGFjZXNcIl0sIHtcbiAgICAgIGN3ZDogcHJvamVjdFBhdGgsXG4gICAgfSlcblxuICAgIHJldHVybiBzZXJ2ZURcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBETGFuZ3VhZ2VDbGllbnQoKVxuIl19