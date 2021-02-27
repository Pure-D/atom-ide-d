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
        const serveD = super.spawn(serveDPath, [], {
            cwd: projectPath,
        });
        return serveD;
    }
}
module.exports = new DLanguageClient();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlLWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaWRlLWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEsNkRBQXdEO0FBRXhELE1BQU0sZUFBZ0IsU0FBUSx3Q0FBa0I7SUFDOUMsUUFBUTtRQUNOLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQTtRQUNoQixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxlQUFlLENBQUMsZUFBZSxDQUFDLEVBQUU7WUFHbkQsT0FBTyxDQUFDLG1CQUFtQixDQUFDLENBQUMsT0FBTyxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQTtZQUVuRCxJQUFJLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxlQUFlLENBQUMsQ0FBQTtZQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxtREFBbUQsQ0FBQyxDQUFBO1NBQ25GO0lBQ0gsQ0FBQztJQUVELGdCQUFnQjtRQUNkLE9BQU8sQ0FBQyxVQUFVLEVBQUUsR0FBRyxDQUFDLENBQUE7SUFDMUIsQ0FBQztJQUNELGVBQWU7UUFDYixPQUFPLEdBQUcsQ0FBQTtJQUNaLENBQUM7SUFDRCxhQUFhO1FBQ1gsT0FBTyxTQUFTLENBQUE7SUFDbEIsQ0FBQztJQUVELGlCQUFpQjtRQUNmLE9BQU8sT0FBTyxDQUFBO0lBQ2hCLENBQUM7SUFFRCxLQUFLLENBQUMsa0JBQWtCLENBQUMsV0FBbUI7UUFFMUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxHQUFHLHdEQUFhLGdCQUFnQixHQUFDLENBQUE7UUFFeEQsTUFBTSxVQUFVLEdBQUcsTUFBTSxhQUFhLEVBQUUsQ0FBQTtRQUV4QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUU7WUFDekMsR0FBRyxFQUFFLFdBQVc7U0FDakIsQ0FBQyxDQUFBO1FBRUYsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXRvTGFuZ3VhZ2VDbGllbnQgfSBmcm9tIFwiYXRvbS1sYW5ndWFnZWNsaWVudFwiXG5cbmNsYXNzIERMYW5ndWFnZUNsaWVudCBleHRlbmRzIEF1dG9MYW5ndWFnZUNsaWVudCB7XG4gIGFjdGl2YXRlKCkge1xuICAgIHN1cGVyLmFjdGl2YXRlKClcbiAgICBpZiAoIWF0b20ucGFja2FnZXMuaXNQYWNrYWdlTG9hZGVkKFwiYXRvbS1pZGUtYmFzZVwiKSkge1xuICAgICAgLy8gaW5zdGFsbCBpZiBub3QgaW5zdGFsbGVkXG4gICAgICAvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgQHR5cGVzY3JpcHQtZXNsaW50L25vLXZhci1yZXF1aXJlc1xuICAgICAgcmVxdWlyZShcImF0b20tcGFja2FnZS1kZXBzXCIpLmluc3RhbGwoXCJpZGUtZFwiLCB0cnVlKVxuICAgICAgLy8gZW5hYmxlIGlmIGRpc2FibGVkXG4gICAgICBhdG9tLnBhY2thZ2VzLmVuYWJsZVBhY2thZ2UoXCJhdG9tLWlkZS1iYXNlXCIpXG4gICAgICBhdG9tLm5vdGlmaWNhdGlvbnMuYWRkU3VjY2VzcyhcImlkZS1kOiBhdG9tLWlkZS1iYXNlIHdhcyBpbnN0YWxsZWQgYW5kIGVuYWJsZWQuLi5cIilcbiAgICB9XG4gIH1cblxuICBnZXRHcmFtbWFyU2NvcGVzKCkge1xuICAgIHJldHVybiBbXCJzb3VyY2UuZFwiLCBcIkRcIl1cbiAgfVxuICBnZXRMYW5ndWFnZU5hbWUoKSB7XG4gICAgcmV0dXJuIFwiRFwiXG4gIH1cbiAgZ2V0U2VydmVyTmFtZSgpIHtcbiAgICByZXR1cm4gXCJzZXJ2ZS1kXCJcbiAgfVxuXG4gIGdldENvbm5lY3Rpb25UeXBlKCk6IFwic3RkaW9cIiB7XG4gICAgcmV0dXJuIFwic3RkaW9cIlxuICB9XG5cbiAgYXN5bmMgc3RhcnRTZXJ2ZXJQcm9jZXNzKHByb2plY3RQYXRoOiBzdHJpbmcpIHtcbiAgICAvLyBpbXBvcnQgb25seSB3aGVuIGEgRCBmaWxlIGlzIG9wZW5lZC5cbiAgICBjb25zdCB7IGluc3RhbGxTZXJ2ZUQgfSA9IGF3YWl0IGltcG9ydChcIi4vaW5zdGFsbGF0aW9uXCIpXG5cbiAgICBjb25zdCBzZXJ2ZURQYXRoID0gYXdhaXQgaW5zdGFsbFNlcnZlRCgpXG5cbiAgICBjb25zdCBzZXJ2ZUQgPSBzdXBlci5zcGF3bihzZXJ2ZURQYXRoLCBbXSwge1xuICAgICAgY3dkOiBwcm9qZWN0UGF0aCxcbiAgICB9KVxuXG4gICAgcmV0dXJuIHNlcnZlRFxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbmV3IERMYW5ndWFnZUNsaWVudCgpXG4iXX0=