"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const avatarManager_1 = require("./avatarManager");
const dataSource_1 = require("./dataSource");
const diffDocProvider_1 = require("./diffDocProvider");
const extensionState_1 = require("./extensionState");
const gitGraphView_1 = require("./gitGraphView");
const repoManager_1 = require("./repoManager");
const statusBarItem_1 = require("./statusBarItem");
// function activate(context) {
//     const extensionState = new extensionState_1.ExtensionState(context);
//     const dataSource = new dataSource_1.DataSource();
//     const avatarManager = new avatarManager_1.AvatarManager(dataSource, extensionState);
//     const statusBarItem = new statusBarItem_1.StatusBarItem(context);
//     const repoManager = new repoManager_1.RepoManager(dataSource, extensionState, statusBarItem);
//     context.subscriptions.push(vscode.commands.registerCommand('git-graph.view', () => {
//         gitGraphView_1.GitGraphView.createOrShow(context.extensionPath, dataSource, extensionState, avatarManager, repoManager);
//     }), vscode.commands.registerCommand('git-graph.clearAvatarCache', () => {
//         avatarManager.clearCache();
//     }), vscode.workspace.registerTextDocumentContentProvider(diffDocProvider_1.DiffDocProvider.scheme, new diffDocProvider_1.DiffDocProvider(dataSource)), vscode.workspace.onDidChangeConfiguration(e => {
//         if (e.affectsConfiguration('git-graph.showStatusBarItem')) {
//             statusBarItem.refresh();
//         }
//         else if (e.affectsConfiguration('git-graph.dateType')) {
//             dataSource.generateGitCommandFormats();
//         }
//         else if (e.affectsConfiguration('git-graph.maxDepthOfRepoSearch')) {
//             repoManager.maxDepthOfRepoSearchChanged();
//         }
//         else if (e.affectsConfiguration('git.path')) {
//             dataSource.registerGitPath();
//         }
//     }), repoManager);
// }
// exports.activate = activate;
// exports.deactivate = deactivate;

function activate(context) {

	console.log('Congratulations, your extension "js-code" is now active!');

	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		vscode.window.showInformationMessage('Hello World!');
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {}

module.exports = {
	activate,
	deactivate
}
