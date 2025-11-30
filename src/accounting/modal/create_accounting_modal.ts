import {Modal} from "obsidian";
import {PeriodPickerDecorator} from "../../general/modal_decorator/period_picker_decorator";
import {AccountingCalculator} from "../accounting_calculator";
import {FinanceFileCreationButtonDecorator} from "../../general/modal_decorator/finance_file_creation_button_decorator";
import {AccountingFileSetting} from "../file/accounting_file_setting";

import FinanceManagerPlugin from 'main';

export class CreateAccountingModal extends Modal {
	constructor(plugin: FinanceManagerPlugin) {
		super(plugin.app);

		this.setTitle("Create Accounting");

		let period: string;

		new PeriodPickerDecorator().include(this, (newPeriod) => {
			period = newPeriod;
		});

		const calculateAccounting = () => {
			return new AccountingCalculator(plugin.app).calculate(period);
		}

		new FinanceFileCreationButtonDecorator(plugin.settings).include(this, calculateAccounting,
			new AccountingFileSetting());
	}
}
