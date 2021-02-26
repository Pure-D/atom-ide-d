"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const atom_languageclient_1 = require("atom-languageclient");
const installation_1 = require("./installation");
class DLanguageClient extends atom_languageclient_1.AutoLanguageClient {
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
        const serveDPath = await installation_1.installServeD();
        const serveD = super.spawn(serveDPath, [], {
            cwd: projectPath,
        });
        return serveD;
    }
}
module.exports = new DLanguageClient();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaWRlLWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaWRlLWQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSw2REFBd0Q7QUFDeEQsaURBQThDO0FBRTlDLE1BQU0sZUFBZ0IsU0FBUSx3Q0FBa0I7SUFDOUMsZ0JBQWdCO1FBQ2QsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsQ0FBQTtJQUMxQixDQUFDO0lBQ0QsZUFBZTtRQUNiLE9BQU8sR0FBRyxDQUFBO0lBQ1osQ0FBQztJQUNELGFBQWE7UUFDWCxPQUFPLFNBQVMsQ0FBQTtJQUNsQixDQUFDO0lBRUQsaUJBQWlCO1FBQ2YsT0FBTyxPQUFPLENBQUE7SUFDaEIsQ0FBQztJQUVELEtBQUssQ0FBQyxrQkFBa0IsQ0FBQyxXQUFtQjtRQUMxQyxNQUFNLFVBQVUsR0FBRyxNQUFNLDRCQUFhLEVBQUUsQ0FBQTtRQUV4QyxNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxFQUFFLEVBQUU7WUFDekMsR0FBRyxFQUFFLFdBQVc7U0FDakIsQ0FBQyxDQUFBO1FBRUYsT0FBTyxNQUFNLENBQUE7SUFDZixDQUFDO0NBQ0Y7QUFFRCxNQUFNLENBQUMsT0FBTyxHQUFHLElBQUksZUFBZSxFQUFFLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBBdXRvTGFuZ3VhZ2VDbGllbnQgfSBmcm9tIFwiYXRvbS1sYW5ndWFnZWNsaWVudFwiXG5pbXBvcnQgeyBpbnN0YWxsU2VydmVEIH0gZnJvbSBcIi4vaW5zdGFsbGF0aW9uXCJcblxuY2xhc3MgRExhbmd1YWdlQ2xpZW50IGV4dGVuZHMgQXV0b0xhbmd1YWdlQ2xpZW50IHtcbiAgZ2V0R3JhbW1hclNjb3BlcygpIHtcbiAgICByZXR1cm4gW1wic291cmNlLmRcIiwgXCJEXCJdXG4gIH1cbiAgZ2V0TGFuZ3VhZ2VOYW1lKCkge1xuICAgIHJldHVybiBcIkRcIlxuICB9XG4gIGdldFNlcnZlck5hbWUoKSB7XG4gICAgcmV0dXJuIFwic2VydmUtZFwiXG4gIH1cblxuICBnZXRDb25uZWN0aW9uVHlwZSgpOiBcInN0ZGlvXCIge1xuICAgIHJldHVybiBcInN0ZGlvXCJcbiAgfVxuXG4gIGFzeW5jIHN0YXJ0U2VydmVyUHJvY2Vzcyhwcm9qZWN0UGF0aDogc3RyaW5nKSB7XG4gICAgY29uc3Qgc2VydmVEUGF0aCA9IGF3YWl0IGluc3RhbGxTZXJ2ZUQoKVxuXG4gICAgY29uc3Qgc2VydmVEID0gc3VwZXIuc3Bhd24oc2VydmVEUGF0aCwgW10sIHtcbiAgICAgIGN3ZDogcHJvamVjdFBhdGgsXG4gICAgfSlcblxuICAgIHJldHVybiBzZXJ2ZURcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG5ldyBETGFuZ3VhZ2VDbGllbnQoKVxuIl19