import {normalizePath} from "obsidian";
import {FinanceFileSetting} from "../../general/modal_decorator/file/finance_file_setting";
import {Accounting} from "../accounting";
import { FinanceManagerPluginSettings } from "main";

export class AccountingFileSetting implements FinanceFileSetting<Accounting> {
	getFileContent(value: Accounting): string {
		return "---\n" +
			"Real Estate Patrimony: " + value.getRealEstatePatrimony().toFixed(2) + "\n" +
			"Financial Patrimony: " + value.getFinancialPatrimony().toFixed(2) + "\n" +
			"Investment Financial Patrimony: " + value.getInvestmentFinancialPatrimony().toFixed(2) + "\n" +
			"Deposit Financial Patrimony: " + value.getDepositFinancialPatrimony().toFixed(2) + "\n" +
			"Total Patrimony: " + value.getTotalPatrimony().toFixed(2) + "\n" +
			"Total Net Patrimony: " + value.getTotalNetPatrimony().toFixed(2) + "\n" +
			"Total Income: " + value.getTotalIncome().toFixed(2) + "\n" +
			"Total Investment Deposit: " + value.getTotalInvestmentDeposit().toFixed(2) + "\n" +
			"Total Reserve: " + value.getTotalReserve().toFixed(2) + "\n" +
			"Reserve Diff: " + value.getReserveDiff().toFixed(2) + "\n" +
			"Reserve Balance: \"" +
				JSON.stringify(value.getReserveBalance()).replace(/"/g, "'") + "\"\n" +
			"Patrimony Diff: " + value.getPatrimonyDiff().toFixed(2) + "\n" +
			"Financial Patrimony Diff: " + value.getFinancialPatrimonyDiff().toFixed(2) + "\n" +
			"Investment Patrimony Diff: " + value.getInvestmentPatrimonyDiff().toFixed(2) + "\n" +
			"Deposit Patrimony Diff: " + value.getDepositPatrimonyDiff().toFixed(2) + "\n" +
			"Real Estate Patrimony Diff: " + value.getRealEstatePatrimonyDiff().toFixed(2) + "\n" +
			"Investment Interest: " + value.getInvestmentInterest().toFixed(2) + "\n" +
			"Percentage Investment Interest: " + value.getPercentageInvestmentInterest().toFixed(6) + "\n" +
			"Net Economy: " + value.getNetEconomy().toFixed(2) + "\n" +
			"Percentage Net Economy: " + value.getPercentageNetEconomy().toFixed(6) + "\n" +
			"Financial Net Economy: " + value.getFinancialNetEconomy().toFixed(2) + "\n" +
			"Percentage Financial Net Economy: " + value.getPercentageFinancialNetEconomy().toFixed(6) + "\n" +
			"---\n";
	}

	getFileName(value: Accounting, settings: FinanceManagerPluginSettings): string {
		return value.getPeriod() + ".md";
	}

	getPath(value: Accounting, settings: FinanceManagerPluginSettings): string {
		return normalizePath(settings.accountingFolder);
	}

	validate(value: Accounting): boolean {
		return true;
	}

}
