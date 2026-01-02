import { App, Plugin, PluginSettingTab, Setting, normalizePath } from 'obsidian';
import { PluginActionCommandDecorator } from "src/plugin_actions/decorator/plugin_action_command_decorator";
import { PluginActionButtonDecorator } from "src/plugin_actions/decorator/plugin_action_button_decorator";
import { FolderSuggest } from "src/settings/folder_suggest";

// Remember to rename these classes and interfaces!

export interface FinanceManagerPluginSettings {
	language: string;
	assetFolder: string;
	patrimonyFolder: string;
	transactionsFolder: string;
	reserveAccountsFolder: string;
	reserveTransactionFolder: string;
	accountingFolder: string;
}

const DEFAULT_SETTINGS: FinanceManagerPluginSettings = {
	language: 'English',
	assetFolder: normalizePath('finance/assets'),
	patrimonyFolder: normalizePath('finance/patrimony'),
	transactionsFolder: normalizePath('finance/transactions'),
	reserveAccountsFolder: normalizePath('finance/reserve_accounts'),
	reserveTransactionFolder: normalizePath('finance/reserve_transactions'),
	accountingFolder: normalizePath('finance/accounting')
}

export default class FinanceManagerPlugin extends Plugin {
	settings: FinanceManagerPluginSettings;

	async onload() {
		await this.loadSettings();

		new PluginActionButtonDecorator().include(this);
		new PluginActionCommandDecorator().include(this);

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new PersonalFinanceSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		// this.registerDomEvent(document, 'click', (evt: MouseEvent) => {
		// 	console.log('click', evt);
		// });

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		// this.registerInterval(window.setInterval(() => console.log('setInterval'), 5 * 60 * 1000));
	}

	onunload() {

	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class PersonalFinanceSettingTab extends PluginSettingTab {
	plugin: FinanceManagerPlugin;
	app: App;

	constructor(app: App, plugin: FinanceManagerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.app = app;
	}

	display(): void {
		const {containerEl} = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Language')
			.setDesc("This sets the language in modals and commands but will not change field names in generated files. After changing the language, it is recommended to reload the Obsidian app.")
			.addDropdown(dropdown => dropdown
				.addOption("English", "English")
				.setValue(this.plugin.settings.language)
				.onChange(async (value) => {
					this.plugin.settings.language = value;
					await this.plugin.saveSettings();
				})
			);

		new Setting(containerEl)
			.setName('Assets folder')
			.setDesc("Default folder is " + DEFAULT_SETTINGS.assetFolder + ". After changing this path or any of the paths below, it is necessary to manually move all existing files in the old folder to the new one. Otherwise, the plugin will lost track of not migrated entries.")
			.addText(text => {

				new FolderSuggest(text.inputEl, this.app, (value) => {
					text.setValue(value);
					this.plugin.settings.assetFolder = value || DEFAULT_SETTINGS.assetFolder;
					void this.plugin.saveSettings();
				});

				text.setValue(this.plugin.settings.assetFolder);

				return text.setPlaceholder(DEFAULT_SETTINGS.assetFolder).onChange(async (value) => {
					this.plugin.settings.assetFolder = value || DEFAULT_SETTINGS.assetFolder;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Patrimony folder')
			.setDesc("Default folder is " + DEFAULT_SETTINGS.patrimonyFolder)
			.addText(text => {

				new FolderSuggest(text.inputEl, this.app, (value) => {
					text.setValue(value);
					this.plugin.settings.patrimonyFolder = value || DEFAULT_SETTINGS.patrimonyFolder;
					void this.plugin.saveSettings();
				});

				text.setValue(this.plugin.settings.patrimonyFolder);

				return text.setPlaceholder(DEFAULT_SETTINGS.patrimonyFolder).onChange(async (value) => {
					this.plugin.settings.patrimonyFolder = value || DEFAULT_SETTINGS.patrimonyFolder;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Transactions folder')
			.setDesc("Default folder is " + DEFAULT_SETTINGS.transactionsFolder)
			.addText(text => {

				new FolderSuggest(text.inputEl, this.app, (value) => {
					text.setValue(value);
					this.plugin.settings.transactionsFolder = value || DEFAULT_SETTINGS.transactionsFolder;
					void this.plugin.saveSettings();
				});

				text.setValue(this.plugin.settings.transactionsFolder);

				return text.setPlaceholder(DEFAULT_SETTINGS.transactionsFolder).onChange(async (value) => {
					this.plugin.settings.transactionsFolder = value || DEFAULT_SETTINGS.transactionsFolder;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Reserve accounts folder')
			.setDesc("Default folder is " + DEFAULT_SETTINGS.reserveAccountsFolder)
			.addText(text => {

				new FolderSuggest(text.inputEl, this.app, (value) => {
					text.setValue(value);
					this.plugin.settings.reserveAccountsFolder = value || DEFAULT_SETTINGS.reserveAccountsFolder;
					void this.plugin.saveSettings();
				});

				text.setValue(this.plugin.settings.reserveAccountsFolder);

				return text.setPlaceholder(DEFAULT_SETTINGS.reserveAccountsFolder).onChange(async (value) => {
					this.plugin.settings.reserveAccountsFolder = value || DEFAULT_SETTINGS.reserveAccountsFolder;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Reserve transactions folder')
			.setDesc("Default folder is " + DEFAULT_SETTINGS.reserveTransactionFolder)
			.addText(text => {

				new FolderSuggest(text.inputEl, this.app, (value) => {
					text.setValue(value);
					this.plugin.settings.reserveTransactionFolder = value || DEFAULT_SETTINGS.reserveTransactionFolder;
					void this.plugin.saveSettings();
				});

				text.setValue(this.plugin.settings.reserveTransactionFolder);

				return text.setPlaceholder(DEFAULT_SETTINGS.reserveTransactionFolder).onChange(async (value) => {
					this.plugin.settings.reserveTransactionFolder = value || DEFAULT_SETTINGS.reserveTransactionFolder;
					await this.plugin.saveSettings();
				});
			});

		new Setting(containerEl)
			.setName('Accounting folder')
			.setDesc("Default folder is " + DEFAULT_SETTINGS.accountingFolder)
			.addText(text => {

				new FolderSuggest(text.inputEl, this.app, (value) => {
					text.setValue(value);
					this.plugin.settings.accountingFolder = value || DEFAULT_SETTINGS.accountingFolder;
					void this.plugin.saveSettings();
				});

				text.setValue(this.plugin.settings.accountingFolder);

				return text.setPlaceholder(DEFAULT_SETTINGS.accountingFolder).onChange(async (value) => {
					this.plugin.settings.accountingFolder = value || DEFAULT_SETTINGS.accountingFolder;
					await this.plugin.saveSettings();
				});
			});
	}
}
