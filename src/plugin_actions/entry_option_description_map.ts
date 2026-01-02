import { EntryOptionType } from "./entry_option_type";

export class EntryOptionDescriptionMap {
	private readonly entryOptionDescriptionMap: Map<EntryOptionType, string>;

	constructor() {
		this.entryOptionDescriptionMap = new Map();
		this.entryOptionDescriptionMap.set(EntryOptionType.AddAsset, 'Create new asset');
		this.entryOptionDescriptionMap.set(EntryOptionType.AddPatrimony, 'Create new patrimony entry');
		this.entryOptionDescriptionMap.set(EntryOptionType.AddTransaction, 'Create new transaction');
		this.entryOptionDescriptionMap.set(EntryOptionType.AddReserveAccount, 'Create new reserve account');
		this.entryOptionDescriptionMap.set(EntryOptionType.AddReserveTransaction, 'Create new reserve transaction');
		this.entryOptionDescriptionMap.set(EntryOptionType.CreateAccounting, 'Create new accounting');
	}

	getDescription(entryOptionType: EntryOptionType): string {
		const entryOptionDescription = this.entryOptionDescriptionMap.get(entryOptionType);
		if (entryOptionDescription) {
			return entryOptionDescription;
		}

		return entryOptionType;
	}
}
