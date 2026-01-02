import {Modal, Notice, Setting, normalizePath} from "obsidian";
import {FinanceFileSetting} from "./file/finance_file_setting";

import { FinanceManagerPluginSettings } from 'main';

export class FinanceFileCreationButtonDecorator<K> {
	private readonly settings: FinanceManagerPluginSettings;

	constructor(settings: FinanceManagerPluginSettings) {
		this.settings = settings;
	}

	include(modal: Modal, getValue: () => K, financeFileSetting: FinanceFileSetting<K>) {

		new Setting(modal.contentEl)
			.addButton((btn) =>
				btn
					.setButtonText('Create')
					.setCta()
					.onClick(async () => {
						const value = getValue();

						if (!financeFileSetting.validate(value)) {
							return;
						}

						const fileContent = financeFileSetting.getFileContent(value);

						const path = normalizePath(financeFileSetting.getPath(value, this.settings));
						const fileName = financeFileSetting.getFileName(value, this.settings);
						const filePath = normalizePath(path + "/" + fileName);

						try {

							const existingFolder = modal.app.vault.getAbstractFileByPath(path);
							if (!existingFolder) {
								await modal.app.vault.createFolder(path);
							}

							const file = await modal.app.vault.create(filePath, fileContent);
							await modal.app.workspace.getLeaf(false).openFile(file);
						} catch {
							new Notice('An error occurred while creating new register. ' +
								'Check if file ' + filePath + ' already exists.');
							return;
						}

						modal.close();
					}));
	}
}
