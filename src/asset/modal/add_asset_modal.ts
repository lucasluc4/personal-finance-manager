import {  Modal, Setting } from 'obsidian';
import { AssetTypeDescriptionMap } from "src/asset/asset_type_description_map";
import { AssetType } from "src/asset/asset_type";
import { FinanceFileCreationButtonDecorator } from "src/general/modal_decorator/finance_file_creation_button_decorator";
import { AssetFileParameter } from "./asset_file_parameter";
import { AssetFileSetting } from "./asset_file_setting";

import FinanceManagerPlugin from 'main';

export class AddAssetModal extends Modal {
	constructor(plugin: FinanceManagerPlugin) {
		super(plugin.app);
		this.setTitle('Create new asset');

		let name = '';
		let type: AssetType = AssetType.DepositAccount;

		const assetTypeDescriptionMap = new AssetTypeDescriptionMap();

		new Setting(this.contentEl)
			.setName('Asset name')
			.addText((text) =>
				text.onChange((value) => {
					name = value;
				}));

		new Setting(this.contentEl)
			.setName('Asset type')
			.addDropdown((dropdown) =>
				dropdown
					.addOption(AssetType.DepositAccount,
						assetTypeDescriptionMap.getDescription(AssetType.DepositAccount))
					.addOption(AssetType.InvestmentAccount,
						assetTypeDescriptionMap.getDescription(AssetType.InvestmentAccount))
					.addOption(AssetType.RealEstate, assetTypeDescriptionMap.getDescription(AssetType.RealEstate))
					.onChange((value: AssetType) => {
						type = value;
					})
			);

		const getAssetFileParameter = () => {
			return new AssetFileParameter(type, name);
		}

		new FinanceFileCreationButtonDecorator<AssetFileParameter>(plugin.settings).include(this, getAssetFileParameter,
			new AssetFileSetting());
	}
}
