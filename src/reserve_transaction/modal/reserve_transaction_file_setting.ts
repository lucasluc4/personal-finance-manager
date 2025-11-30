import { App, Notice, normalizePath } from 'obsidian';
import { FinanceFileSetting } from "src/general/modal_decorator/file/finance_file_setting";
import { ReserveTransactionFileParameter } from "./reserve_transaction_file_parameter";
import { FinanceManagerPluginSettings } from "main";

export class ReserveTransactionFileSetting implements FinanceFileSetting<ReserveTransactionFileParameter> {

	private readonly app: App;

	constructor(app: App) {
		this.app = app;
	}

	validate(value: ReserveTransactionFileParameter): boolean {
		if (!value || !value.getValue() || !value.getReserveAccount() || !value.getPeriod() || !value.getType()) {
			new Notice('All fields are required');
			return false;
		}
		return true;
	}

	getPath(value: ReserveTransactionFileParameter, settings: FinanceManagerPluginSettings): string {
		return normalizePath(settings.reserveTransactionFolder + "/" + value.getPeriod().replace("-", "/"));
	}

	getFileName(value: ReserveTransactionFileParameter, settings: FinanceManagerPluginSettings): string {
		let num = 1;
		while (true) {
			const fileName = value.getReserveAccount().getName()
				+ " - " + value.getType().toString()
				+ " " + num
				+ ".md";
			const fullPath = this.getPath(value, settings) + "/" + fileName;
			const existingFile = this.app.vault.getAbstractFileByPath(fullPath);
			if (!existingFile) {
				return fileName;
			}
			num++;
		}
	}

	getFileContent(value: ReserveTransactionFileParameter): string {
		return "---\n" +
			"Reserve Account: " + value.getReserveAccount().getName() + "\n" +
			"Type: " + value.getType().toString() + "\n" +
			"Value: " + value.getValue().toFixed(2) + "\n" +
			"---\n";
	}

}
