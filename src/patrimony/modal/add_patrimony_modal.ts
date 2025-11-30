import { Modal } from 'obsidian';
import { Asset } from "src/asset/asset";
import { PeriodPickerDecorator } from "src/general/modal_decorator/period_picker_decorator";
import { AssetPickerDecorator } from "src/general/modal_decorator/asset_picker_decorator";
import { ValueFieldDecorator } from "src/general/modal_decorator/value_field_decorator";
import { FinanceFileCreationButtonDecorator } from "src/general/modal_decorator/finance_file_creation_button_decorator";
import { PatrimonyFileParameter } from "./patrimony_file_parameter";
import { PatrimonyFileSetting } from "./patrimony_file_setting";

import FinanceManagerPlugin from 'main';

export class AddPatrimonyModal extends Modal {
	constructor(plugin: FinanceManagerPlugin) {
		super(plugin.app);

		this.setTitle('Create new Patrimony Entry');

		let asset: Asset;
		let period: string;
		let patrimonyValue: number = 0;

		new PeriodPickerDecorator().include(this, (newPeriod) => {
			period = newPeriod;
		});

		new AssetPickerDecorator().include(this, plugin.settings, (newAsset) => {
			asset = newAsset;
		});

		new ValueFieldDecorator().include(this, "Value", (newValue) => {
			patrimonyValue = newValue;
		});

		const getPatrimonyFileParameter = () => {
			return new PatrimonyFileParameter(asset, period, patrimonyValue);
		}

		new FinanceFileCreationButtonDecorator(plugin.settings).include(this, getPatrimonyFileParameter,
			new PatrimonyFileSetting());
	}
}
