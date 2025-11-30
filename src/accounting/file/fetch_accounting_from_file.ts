import {TFile, normalizePath} from "obsidian";
import { Accounting } from "../accounting";
import {ReserveBalance} from "../reserve_balance";
import {AssetType} from "../../asset/asset_type";
import {ReserveTransactionType} from "../../reserve_transaction/reserve_transaction_type";
import {TransactionType} from "../../transaction/transaction_type";

import FinanceManagerPlugin from 'main';

export class PatrimonyResult {
	private readonly totalRealEstatePatrimony: number;
	private readonly totalInvestmentPatrimony: number;
	private readonly totalDepositPatrimony: number;

	constructor(totalRealEstatePatrimony: number, totalDepositPatrimony: number, totalInvestmentPatrimony: number) {
		this.totalRealEstatePatrimony = totalRealEstatePatrimony;
		this.totalDepositPatrimony = totalDepositPatrimony;
		this.totalInvestmentPatrimony = totalInvestmentPatrimony;
	}

	getTotalRealEstatePatrimony() {
		return this.totalRealEstatePatrimony;
	}

	getTotalDepositPatrimony() {
		return this.totalDepositPatrimony;
	}

	getTotalInvestmentPatrimony() {
		return this.totalInvestmentPatrimony;
	}
}

export class TransactionResult {
	private readonly investmentDeposit: number;
	private readonly income: number;

	constructor(investmentDeposit: number, income: number) {
		this.investmentDeposit = investmentDeposit;
		this.income = income;
	}

	getInvestmentDeposit() {
		return this.investmentDeposit;
	}

	getIncome() {
		return this.income;
	}
}

export class FetchAccountingFromFile {
	private readonly plugin: FinanceManagerPlugin;

	constructor(plugin: FinanceManagerPlugin) {
		this.plugin = plugin;
	}

	fetchAccounting(period: string): Accounting | null {
		const accountingPath = this.plugin.settings.accountingFolder;
		const file = this.plugin.app.vault.getFileByPath(normalizePath(accountingPath + "/" + period + ".md"));
		if (!file) {
			return null;
		}

		const frontmatter = this.plugin.app.metadataCache.getFileCache(file)?.frontmatter;
		if (!frontmatter) {
			return null;
		}

		return new Accounting(
			period,
			frontmatter["Real Estate Patrimony"] as number,
			frontmatter["Financial Patrimony"] as number,
			frontmatter["Investment Financial Patrimony"] as number,
			frontmatter["Deposit Financial Patrimony"] as number,
			frontmatter["Total Patrimony"] as number,
			frontmatter["Total Net Patrimony"] as number,
			frontmatter["Total Income"] as number,
			frontmatter["Total Investment Deposit"] as number,
			frontmatter["Total Reserve"] as number,
			frontmatter["Reserve Diff"] as number,
			JSON.parse(frontmatter["Reserve Balance"].replace(/'/g, "\"")) as ReserveBalance[],
			frontmatter["Patrimony Diff"] as number,
			frontmatter["Financial Patrimony Diff"] as number,
			frontmatter["Investment Patrimony Diff"] as number,
			frontmatter["Deposit Patrimony Diff"] as number,
			frontmatter["Real Estate Patrimony Diff"] as number,
			frontmatter["Investment Interest"] as number,
			frontmatter["Percentage Investment Interest"] as number,
			frontmatter["Net Economy"] as number,
			frontmatter["Percentage Net Economy"] as number,
			frontmatter["Financial Net Economy"] as number,
			frontmatter["Percentage Financial Net Economy"] as number,
		);
	}

	fetchPatrimony(period: string): PatrimonyResult {
		const patrimonyPath = this.plugin.settings.accountingFolder;
		const folder = this.plugin.app.vault.getFolderByPath(
			normalizePath(patrimonyPath + "/" + period.replace("-", "/")));

		let totalRealEstatePatrimony = 0;
		let totalDepositPatrimony = 0;
		let totalInvestmentPatrimony = 0;

		if (folder) {
			folder.children.forEach((child) => {
				if (child instanceof TFile && child.extension === "md") {
					const patrimonyFile = child as TFile;

					const patrimonyFrontmatter =
						this.plugin.app.metadataCache.getFileCache(patrimonyFile)?.frontmatter;
					if (patrimonyFrontmatter) {

						const patrimonyValue = patrimonyFrontmatter.Value;
						let assetType = AssetType.DepositAccount;

						const assetsFolder = this.plugin.settings.assetFolder;
						const assetFile = this.plugin.app.vault.getFileByPath(
							normalizePath(assetsFolder + "/" + patrimonyFile.basename + ".md"));
						if (assetFile) {
							const assetFrontmatter =
								this.plugin.app.metadataCache.getFileCache(assetFile)?.frontmatter;
							if (assetFrontmatter) {
								if (assetFrontmatter.Type) {
									assetType = assetFrontmatter.Type as AssetType;
								}
							}
						}

						if (assetType === AssetType.DepositAccount) {
							totalDepositPatrimony += patrimonyValue;
						} else if (assetType === AssetType.InvestmentAccount) {
							totalInvestmentPatrimony += patrimonyValue;
						} else if (assetType === AssetType.RealEstate) {
							totalRealEstatePatrimony += patrimonyValue;
						}
					}
				}
			});
		}

		return new PatrimonyResult(totalRealEstatePatrimony, totalDepositPatrimony, totalInvestmentPatrimony);
	}

	fetchReserveTransactions(period: string): Map<string, number> {
		const map = new Map<string, number>();

		const reserveTransactionsFolder = this.plugin.settings.reserveTransactionFolder;
		const folder = this.plugin.app.vault.getFolderByPath(
			normalizePath(reserveTransactionsFolder + "/" + period.replace("-", "/")));
		if (folder) {
			folder.children.forEach((child) => {
				if (child instanceof TFile && child.extension === "md") {
					const transactionFile = child as TFile;

					const transactionFrontmatter =
						this.plugin.app.metadataCache.getFileCache(transactionFile)?.frontmatter;
					if (transactionFrontmatter) {
						const value = transactionFrontmatter.Type === ReserveTransactionType.Withdraw ?
							(transactionFrontmatter.Value * (-1)) : transactionFrontmatter.Value ;

						const reserveAccountName = transactionFrontmatter["Reserve Account"];

						if (map.has(reserveAccountName)) {
							map.set(reserveAccountName, map.get(reserveAccountName) + value);
						} else {
							map.set(reserveAccountName, value);
						}
					}
				}
			});
		}

		return map;
	}

	fetchTransactions(period: string): TransactionResult {
		let totalInvestmentDeposit = 0;
		let totalIncome = 0;

		const transactionsFolder = this.plugin.settings.transactionsFolder;
		const folder = this.plugin.app.vault.getFolderByPath(
			normalizePath(transactionsFolder + "/" + period.replace("-", "/")));
		if (folder) {
			folder.children.forEach((child) => {
				if (child instanceof TFile && child.extension === "md") {
					const transactionFile = child as TFile;

					const transactionFrontmatter =
						this.plugin.app.metadataCache.getFileCache(transactionFile)?.frontmatter;
					if (transactionFrontmatter) {

						if (transactionFrontmatter.Type === TransactionType.Salary
							|| transactionFrontmatter.Type === TransactionType.Bonus) {
							totalIncome += transactionFrontmatter.Value as number;
						} else {
							let assetType = AssetType.DepositAccount;

							const assetName = transactionFrontmatter.Asset as string;
							const assetsFolder = this.plugin.settings.assetFolder;
							const assetFile = this.plugin.app.vault.getFileByPath(
								normalizePath(assetsFolder + "/" + assetName + ".md"));
							if (assetFile) {
								const assetFrontmatter =
									this.plugin.app.metadataCache.getFileCache(assetFile)?.frontmatter;
								if (assetFrontmatter) {
									const fileAssetType = assetFrontmatter.Type as AssetType;
									if (fileAssetType) {
										assetType = fileAssetType;
									}
								}
							}

							if (assetType === AssetType.InvestmentAccount) {
								if (transactionFrontmatter.Type === TransactionType.Deposit) {
									totalInvestmentDeposit += transactionFrontmatter.Value;
								}

								if (transactionFrontmatter.Type === TransactionType.Withdraw) {
									totalInvestmentDeposit -= transactionFrontmatter.Value
								}
							}
						}
					}
				}
			});
		}

		return new TransactionResult(totalInvestmentDeposit, totalIncome);
	}
}
