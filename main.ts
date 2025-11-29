import { App, Plugin, PluginSettingTab, Setting, normalizePath } from 'obsidian';
import { PluginActionCommandDecorator } from "src/plugin_actions/decorator/plugin_action_command_decorator";
import { PluginActionButtonDecorator } from "src/plugin_actions/decorator/plugin_action_button_decorator";
import { FolderSuggest } from "src/settings/folder_suggest";

// Remember to rename these classes and interfaces!

interface FinanceManagerPluginSettings {
	language: string;
	assetFolder: string;
	patrimonyFolder: string;
	transactionsFolder: string;
	reserveAccountsFolder: string;
	reserveTransactionFolder: string;
	accountingFolder: string;
}

const DEFAULT_SETTINGS: FinanceManagerPluginSettings = {
	language: 'en-US',
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
		this.addSettingTab(new SampleSettingTab(this.app, this));

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

class SampleSettingTab extends PluginSettingTab {
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
			.setDesc("This sets the language in Modals and Commands but won't change field names in generated files")
			.addDropdown(dropdown => dropdown
				.addOption("en-US", "en-US")
				.setValue(this.plugin.settings.language)
				.onChange(async (value) => {
					this.plugin.settings.language = value;
					await this.plugin.saveSettings();
				})
			);

		const normalizedDefaultAssetFolder = normalizePath(DEFAULT_SETTINGS.assetFolder);
		new Setting(containerEl)
			.setName('Assets folder')
			.setDesc("Default folder is " + normalizedDefaultAssetFolder)
			.addText(text => {

				new FolderSuggest(text.inputEl, this.app, async (value) => {
					text.setValue(value);
					this.plugin.settings.assetFolder = value || normalizedDefaultAssetFolder;
					await this.plugin.saveSettings();
				});

				text.setValue(this.plugin.settings.assetFolder);

				return text.setPlaceholder(normalizedDefaultAssetFolder).onChange(async (value) => {
					this.plugin.settings.assetFolder = value || normalizedDefaultAssetFolder;
					await this.plugin.saveSettings();
				});
			});
	}
}
