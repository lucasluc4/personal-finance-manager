import { FinanceManagerPluginSettings } from 'main';

export interface FinanceFileSetting<T> {
	validate(value: T): boolean;
	getFileName(value: T, settings: FinanceManagerPluginSettings): string;
	getPath(value: T, settings: FinanceManagerPluginSettings): string;
	getFileContent(value: T): string;
}
