// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { env, Position, Range, languages, CodeActionProvider, CodeAction, CodeActionKind } from 'vscode';
import * as path from 'path';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "copy-error" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('copy-error.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from Copy Error!');
	});

	// NEW: Register command that copies diagnostic messages
	const copyDiagnosticDisposable = vscode.commands.registerCommand('copy-error.copyDiagnostic', async (messages?: string[]) => {
		let diagnosticMessages: string[] | undefined = messages;

		// If no messages passed, gather diagnostics at the cursor position
		if (!diagnosticMessages || diagnosticMessages.length === 0) {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showInformationMessage('No active editor to copy diagnostics from.');
				return;
			}

			const cursor = editor.selection.active;
			const diagnosticsAtCursor = languages
				.getDiagnostics(editor.document.uri)
				.filter((d) => d.range.contains(cursor));

			if (diagnosticsAtCursor.length === 0) {
				vscode.window.showInformationMessage('No diagnostics at cursor to copy.');
				return;
			}

			diagnosticMessages = diagnosticsAtCursor.map((d) => d.message);
		}

		const textToCopy = diagnosticMessages.join('\n');
		await env.clipboard.writeText(textToCopy);
		vscode.window.showInformationMessage('Diagnostic message copied to clipboard.');
	});

	// CodeAction provider to surface a quick-fix style "Copy error message" action
	const provider: CodeActionProvider = {
		provideCodeActions(document, range, context, token) {
			if (!context.diagnostics || context.diagnostics.length === 0) {
				return;
			}

			const messages = context.diagnostics.map((d) => d.message);
			const action = new CodeAction('Copy error message', CodeActionKind.QuickFix);
			action.command = {
				title: 'Copy error message',
				command: 'copy-error.copyDiagnostic',
				arguments: [messages]
			};
			return [action];
		}
	};

	const providerDisposable = languages.registerCodeActionsProvider('*', provider, {
		providedCodeActionKinds: [CodeActionKind.QuickFix]
	});

	context.subscriptions.push(disposable, copyDiagnosticDisposable, providerDisposable);

	// Gutter icon decoration type
	const decorationType = vscode.window.createTextEditorDecorationType({
		gutterIconPath: path.join(context.extensionPath, 'media', 'copy.svg'),
		gutterIconSize: 'contain'
	});

	function updateEditorDecorations(editor: vscode.TextEditor): void {
		if (!editor) {
			return;
		}

	const diagnostics = languages.getDiagnostics(editor.document.uri);
	const decorationOptions: vscode.DecorationOptions[] = diagnostics.map((d) => {
		const messages = [d.message];
		const commandUri = vscode.Uri.parse(
			`command:copy-error.copyDiagnostic?${encodeURIComponent(JSON.stringify(messages))}`
		);

		// Use zero-length range at line start so we don't override squiggly underline decoration
		const iconRange = new vscode.Range(d.range.start.line, 0, d.range.start.line, 0);

		return {
			range: iconRange,
			hoverMessage: new vscode.MarkdownString(`[📋 Copy error](<${commandUri.toString()}>)`)
		};
	});

	editor.setDecorations(decorationType, decorationOptions);
	}

	// Update decorations for active editor initially and on events
	if (vscode.window.activeTextEditor) {
		updateEditorDecorations(vscode.window.activeTextEditor);
	}

	context.subscriptions.push(
		vscode.window.onDidChangeActiveTextEditor((editor) => {
			if (editor) {
				updateEditorDecorations(editor);
			}
		}),
		languages.onDidChangeDiagnostics((e) => {
			const editor = vscode.window.activeTextEditor;
			if (editor && e.uris.some((u) => u.toString() === editor.document.uri.toString())) {
				updateEditorDecorations(editor);
			}
		})
	);
}

// This method is called when your extension is deactivated
export function deactivate() {}
