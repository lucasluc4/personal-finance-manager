import {Accounting} from "./accounting";
import {FetchAccountingFromFile} from "./file/fetch_accounting_from_file";
import {ReserveBalance} from "./reserve_balance";

import FinanceManagerPlugin from 'main';

export class AccountingCalculator {
	private readonly plugin: FinanceManagerPlugin;

	constructor(plugin: FinanceManagerPlugin) {
		this.plugin = plugin;
	}

	calculate(period: string): Accounting {

		const fetchAccounting = new FetchAccountingFromFile(this.plugin);

		const lastPeriodAccounting = fetchAccounting.fetchAccounting(this.lessOneMonth(period));

		const reserveTransactions = fetchAccounting.fetchReserveTransactions(period);
		const reserveDiff = this.calculateReserveDiff(reserveTransactions);
		const reserveBalance = this.calculateReserveBalance(reserveTransactions, lastPeriodAccounting);
		const totalReserve = lastPeriodAccounting ?
			reserveDiff + lastPeriodAccounting.getTotalReserve() : reserveDiff

		const periodPatrimony = fetchAccounting.fetchPatrimony(period);

		const totalDepositPatrimony = periodPatrimony.getTotalDepositPatrimony() - totalReserve;
		const totalInvestmentPatrimony = periodPatrimony.getTotalInvestmentPatrimony();
		const totalRealEstatePatrimony = periodPatrimony.getTotalRealEstatePatrimony();

		const totalFinancialPatrimony = totalDepositPatrimony + totalInvestmentPatrimony;
		const totalNetPatrimony = totalFinancialPatrimony + totalRealEstatePatrimony;
		const totalPatrimony = totalNetPatrimony + totalReserve;

		const patrimonyDiff = lastPeriodAccounting ?
			totalNetPatrimony - lastPeriodAccounting.getTotalNetPatrimony() : 0;
		const financialPatrimonyDiff = lastPeriodAccounting ?
			totalFinancialPatrimony - lastPeriodAccounting.getFinancialPatrimony() : 0;
		const investmentPatrimonyDiff = lastPeriodAccounting ?
			totalInvestmentPatrimony - lastPeriodAccounting.getInvestmentFinancialPatrimony() : 0;
		const depositFinancialPatrimonyDiff = lastPeriodAccounting ?
			totalDepositPatrimony - lastPeriodAccounting.getDepositFinancialPatrimony() : 0;
		const realEstatePatrimonyDiff = lastPeriodAccounting ?
			totalRealEstatePatrimony - lastPeriodAccounting.getRealEstatePatrimony() : 0;

		const transactionResult = fetchAccounting.fetchTransactions(period);
		const income = transactionResult.getIncome();
		const investmentDeposit = transactionResult.getInvestmentDeposit();

		const investmentInterest = lastPeriodAccounting ? investmentPatrimonyDiff - investmentDeposit : 0;
		const percentageInvestmentInterest = totalInvestmentPatrimony ?
			investmentInterest / totalInvestmentPatrimony : 0;

		const netEconomy = patrimonyDiff - investmentInterest;
		const percentageNetEconomy = income ? netEconomy / income : 0;
		const financialNetEconomy = financialPatrimonyDiff - investmentInterest;
		const percentageFinancialNetEconomy = income ?  financialNetEconomy / income : 0;

		return new Accounting(
			period,
			totalRealEstatePatrimony,
			totalFinancialPatrimony,
			totalInvestmentPatrimony,
			totalDepositPatrimony,
			totalPatrimony,
			totalNetPatrimony,
			income,
			investmentDeposit,
			totalReserve,
			reserveDiff,
			reserveBalance,
			patrimonyDiff,
			financialPatrimonyDiff,
			investmentPatrimonyDiff,
			depositFinancialPatrimonyDiff,
			realEstatePatrimonyDiff,
			investmentInterest,
			percentageInvestmentInterest,
			netEconomy,
			percentageNetEconomy,
			financialNetEconomy,
			percentageFinancialNetEconomy
		)
	}

	private lessOneMonth(period: string): string {
		const year = Number(period.substring(0, 4));
		const month = Number(period.substring(5));

		if (month === 1) {
			return `${year-1}-12`;
		}

		if (month <= 10) {
			return `${year}-0${month-1}`;
		}

		return `${year}-${month-1}`;
	}

	private calculateReserveDiff(reserveTransactions: Map<string, number>): number {
		let reserveDiff = 0;

		reserveTransactions.forEach((value, key) => {
			reserveDiff += value;
		});

		return reserveDiff;
	}

	private calculateReserveBalance(reserveTransactions: Map<string, number>, lastPeriodAccounting: Accounting | null) {
		const reserveBalance = new Array<ReserveBalance>();
		const alreadyCalculatedAccount = new Map<string, boolean>();

		if (lastPeriodAccounting && lastPeriodAccounting.getReserveBalance()) {
			lastPeriodAccounting.getReserveBalance().forEach((item) => {
				const transactionDiff = reserveTransactions.get(item.reserveAccountName) || 0;
				reserveBalance.push(new ReserveBalance(item.reserveAccountName,
					item.balance + transactionDiff));
				alreadyCalculatedAccount.set(item.reserveAccountName, true);
			});
		}

		reserveTransactions.forEach((value, key) => {
			if (!alreadyCalculatedAccount.has(key)) {
				reserveBalance.push(new ReserveBalance(key, value));
			}
		});

		return reserveBalance;
	}
}
