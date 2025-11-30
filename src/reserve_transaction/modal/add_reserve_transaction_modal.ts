import {Modal, normalizePath, Setting, TFile} from 'obsidian';
import {ReserveAccount} from "src/reserve_account/reserve_account";
import {ReserveTransactionType} from "../reserve_transaction_type";
import {PeriodPickerDecorator} from "src/general/modal_decorator/period_picker_decorator";
import {ValueFieldDecorator} from "src/general/modal_decorator/value_field_decorator";
import {FinanceFileCreationButtonDecorator} from "src/general/modal_decorator/finance_file_creation_button_decorator";
import {ReserveTransactionFileParameter} from "./reserve_transaction_file_parameter";
import {ReserveTransactionFileSetting} from "./reserve_transaction_file_setting";

import FinanceManagerPlugin from 'main';

export class AddReserveTransactionModal extends Modal {
	constructor(plugin: FinanceManagerPlugin) {
		super(plugin.app);

		this.setTitle("Create new Reserve Transaction");

		let reserveAccount: ReserveAccount;
		let period: string;
		let transactionValue: number;
		let type: ReserveTransactionType;

		new PeriodPickerDecorator().include(this, (newPeriod) => {
			period = newPeriod;
		});

		const currentAccounts: ReserveAccount[] = [];
		const defaultReserveAccount: ReserveAccount = new ReserveAccount("Default", 0, "Default reserve account", true);
		currentAccounts.push(defaultReserveAccount);

		const folder = this.app.vault.getFolderByPath(normalizePath("finance/reserve_accounts"));
		folder?.children.forEach((child) => {
			if (child instanceof TFile && child.extension === "md") {
				const assetFile = child as TFile;
				const frontmatter = this.app.metadataCache.getFileCache(assetFile)?.frontmatter;

				if (frontmatter) {
					try {
						const active = frontmatter.Active as boolean;
						const goal = frontmatter.Goal as number;

						currentAccounts.push(new ReserveAccount(assetFile.basename, goal, '', active));
					} catch (e) {
						console.error(e);
					}
				}
			}
		});

		new Setting(this.contentEl)
			.setName('Reserve Account')
			.addDropdown((dropdown) => {
				currentAccounts.forEach((currentAccount) => {
					if (currentAccount.isActive()) {
						dropdown.addOption(currentAccount.getName(), currentAccount.getName());
					}
				});

				dropdown.setValue(defaultReserveAccount.getName());
				reserveAccount = defaultReserveAccount;

				dropdown
					.onChange((value: string) => {
						currentAccounts.forEach((currentAccount) => {
							if (value === currentAccount.getName()) {
								reserveAccount = currentAccount;
							}
						})
					});
			});

		new ValueFieldDecorator().include(this, "Value", newValue => transactionValue = newValue);

		type = ReserveTransactionType.Deposit;

		new Setting(this.contentEl)
			.setName('Type')
			.addDropdown((dropdown) => {
				dropdown
					.addOption(ReserveTransactionType.Deposit, 'Deposit')
					.addOption(ReserveTransactionType.Withdraw, 'Withdraw')
					.setValue(ReserveTransactionType.Deposit)
					.onChange(value => {
						type = value as ReserveTransactionType;
					});
			});

		const getReserveTransactionFileParameter = () => {
			return new ReserveTransactionFileParameter(reserveAccount, transactionValue, period, type);
		};

		new FinanceFileCreationButtonDecorator(plugin.settings)
			.include(this, getReserveTransactionFileParameter, new ReserveTransactionFileSetting(plugin.app));
	}
}
