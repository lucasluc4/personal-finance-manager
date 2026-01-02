import { Modal, Setting } from 'obsidian';
import { FinanceFileCreationButtonDecorator } from "src/general/modal_decorator/finance_file_creation_button_decorator";
import { ValueFieldDecorator } from "src/general/modal_decorator/value_field_decorator";
import { ReserveAccount } from "../reserve_account";
import { ReserveAccountFileSettings } from "./reserve_account_file_setting";

import FinanceManagerPlugin from 'main';

export class AddReserveAccountModal extends Modal {
	constructor(plugin: FinanceManagerPlugin) {
		super(plugin.app);
		this.setTitle("Create new reserve account")

		let name = '';
		let goal = 0;
		let description = '';

		new Setting(this.contentEl)
			.setName("Name")
			.addText((text) => {
				text.onChange(value => name = value);
			});

		new ValueFieldDecorator().include(this, "Goal", value => goal = value);

		new Setting(this.contentEl)
			.setName("Description (optional)")
			.addTextArea((text) => text.onChange(value => description = value));

		const getReserveAccountParameter = () => {
			return new ReserveAccount(name, goal, description, true);
		}

		new FinanceFileCreationButtonDecorator<ReserveAccount>(plugin.settings)
			.include(this, getReserveAccountParameter, new ReserveAccountFileSettings());
	}
}
