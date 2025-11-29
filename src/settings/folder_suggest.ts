import { App, AbstractInputSuggest } from 'obsidian';

export class FolderSuggest extends AbstractInputSuggest<string> {
	content: string[];

	constructor(private inputEl: HTMLInputElement, app: App, private onSelectCb: (value: string) => void) {
		super(app, inputEl);
		this.content = app.vault.getAllFolders().map(folder => folder.path);
	}

	getSuggestions(inputStr: string): string[] {
		const lowerCaseInputStr = inputStr.toLocaleLowerCase();
		return [...this.content].filter((content) =>
			content.toLocaleLowerCase().contains(lowerCaseInputStr)
		);
	}

	renderSuggestion(content: string, el: HTMLElement): void {
		el.setText(content);
	}

	selectSuggestion(content: string, evt: MouseEvent | KeyboardEvent): void {
		this.onSelectCb(content);
		this.close();
	}
}
