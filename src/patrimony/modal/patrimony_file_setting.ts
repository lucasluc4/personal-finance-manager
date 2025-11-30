import { Notice, normalizePath } from "obsidian";
import { PatrimonyFileParameter } from "./patrimony_file_parameter";
import { FinanceFileSetting } from "src/general/modal_decorator/file/finance_file_setting";
import { FinanceManagerPluginSettings } from "main";

export class PatrimonyFileSetting implements FinanceFileSetting<PatrimonyFileParameter> {

	validate(value: PatrimonyFileParameter): boolean {
		if (!value || !value.getPatrimonyValue() || !value.getAsset() || !value.getPeriod()) {
			new Notice('All fields are required');
			return false;
		}
		return true;
	}

	getPath(value: PatrimonyFileParameter, settings: FinanceManagerPluginSettings): string {
		return normalizePath(settings.patrimonyFolder + "/" + value.getPeriod().replace("-", "/"));
	}

	getFileName(value: PatrimonyFileParameter, settings: FinanceManagerPluginSettings): string {
		return value.getAsset().getName() + ".md";
	}

	getFileContent(value: PatrimonyFileParameter): string {
		return "---\n" +
			"Value: " + value.getPatrimonyValue().toFixed(2) + "\n" +
			"---\n";
	}
}
