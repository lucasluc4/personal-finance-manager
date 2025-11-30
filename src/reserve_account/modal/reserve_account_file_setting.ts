import { Notice, normalizePath } from 'obsidian';
import { FinanceFileSetting } from "src/general/modal_decorator/file/finance_file_setting";
import { ReserveAccount } from "../reserve_account";
import { FinanceManagerPluginSettings } from "main";

export class ReserveAccountFileSettings implements FinanceFileSetting<ReserveAccount> {

	validate(value: ReserveAccount): boolean {
		if (!value || !value.getName() || !value.getName().length || !value.getGoal()) {
			new Notice('Name and goal cannot be empty');
			return false;
		}
		return true;
	}

	getFileName(value: ReserveAccount, settings: FinanceManagerPluginSettings): string {
		return value.getName() + ".md";
	}

	getPath(value: ReserveAccount, settings: FinanceManagerPluginSettings): string {
		return normalizePath(settings.reserveAccountsFolder);
	}

	getFileContent(value: ReserveAccount): string {
		return "---\n" +
			"Goal: " + value.getGoal() + "\n" +
			"Active: true\n" +
			"Achieved: false\n" +
			"---\n" +
			value.getDescription() + "\n";
	}

}
