import {EntryOptionType} from "./entry_option_type";
import FinanceManagerPlugin from 'main';

import {AddAssetModal} from "src/asset/modal/add_asset_modal";
import {AddPatrimonyModal} from "src/patrimony/modal/add_patrimony_modal";
import {AddTransactionModal} from "src/transaction/modal/add_transaction_modal";
import {AddReserveAccountModal} from "src/reserve_account/modal/add_reserve_account_modal";
import {AddReserveTransactionModal} from "../reserve_transaction/modal/add_reserve_transaction_modal";
import {CreateAccountingModal} from "../accounting/modal/create_accounting_modal";

export class EntryModalMap {
	private readonly plugin: FinanceManagerPlugin;

	constructor(plugin: FinanceManagerPlugin) {
		this.plugin = plugin;
	}

	getRegisteredTypes(): EntryOptionType[] {
		return [
			EntryOptionType.AddAsset,
			EntryOptionType.AddPatrimony,
			EntryOptionType.AddTransaction,
			EntryOptionType.AddReserveAccount,
			EntryOptionType.AddReserveTransaction,
			EntryOptionType.CreateAccounting,
		]
	}

	getModal(type: EntryOptionType) {
		switch (type) {
			case EntryOptionType.AddAsset:
				return new AddAssetModal(this.plugin);
			case EntryOptionType.AddPatrimony:
				return new AddPatrimonyModal(this.plugin);
			case EntryOptionType.AddTransaction:
				return new AddTransactionModal(this.plugin);
			case EntryOptionType.AddReserveAccount:
				return new AddReserveAccountModal(this.plugin);
			case EntryOptionType.AddReserveTransaction:
				return new AddReserveTransactionModal(this.plugin);
			case EntryOptionType.CreateAccounting:
				return new CreateAccountingModal(this.plugin);
		}
	}
}
