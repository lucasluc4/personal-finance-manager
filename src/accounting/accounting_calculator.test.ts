import {beforeEach, describe, expect, it, vi} from "vitest";
import {AccountingCalculator} from "./accounting_calculator";
import {Accounting} from "./accounting";
import {ReserveBalance} from "./reserve_balance";
import {PatrimonyResult, TransactionResult, FetchAccountingFromFile} from "./file/fetch_accounting_from_file";

import FinanceManagerPlugin from "main";

vi.mock("./file/fetch_accounting_from_file", async (importOriginal) => {
	const actual = await importOriginal<typeof import("./file/fetch_accounting_from_file")>();
	return {
		...actual,
		FetchAccountingFromFile: vi.fn(),
	};
});

const MockedFetchAccountingFromFile = FetchAccountingFromFile as unknown as ReturnType<typeof vi.fn>;

interface FakeFetcherConfig {
	accounting: Accounting | null;
	reserveTransactions: Map<string, number>;
	patrimony: PatrimonyResult;
	transactions: TransactionResult;
}

function makeFakeFetcher(config: FakeFetcherConfig) {
	return {
		fetchAccounting: vi.fn().mockReturnValue(config.accounting),
		fetchPatrimony: vi.fn().mockReturnValue(config.patrimony),
		fetchReserveTransactions: vi.fn().mockReturnValue(config.reserveTransactions),
		fetchTransactions: vi.fn().mockReturnValue(config.transactions),
	};
}

function useFakeFetcher(config: FakeFetcherConfig) {
	const fakeFetcher = makeFakeFetcher(config);
	MockedFetchAccountingFromFile.mockImplementation(() => fakeFetcher as unknown as FetchAccountingFromFile);
	return fakeFetcher;
}

function findReserveBalance(reserveBalance: ReserveBalance[], reserveAccountName: string) {
	return reserveBalance.find((item) => item.reserveAccountName === reserveAccountName);
}

describe("AccountingCalculator", () => {
	let calculator: AccountingCalculator;

	beforeEach(() => {
		vi.clearAllMocks();
		calculator = new AccountingCalculator({} as FinanceManagerPlugin);
	});

	it("calculates totals for the first-ever period (no previous Accounting note)", () => {
		useFakeFetcher({
			accounting: null,
			reserveTransactions: new Map([
				["Emergency Fund", 500],
				["Travel", 200],
			]),
			patrimony: new PatrimonyResult(0, 3000, 1000),
			transactions: new TransactionResult(0, 5000),
		});

		const result = calculator.calculate("2024-05");

		expect(result.getReserveDiff()).toBe(700);
		expect(result.getTotalReserve()).toBe(700);
		expect(result.getDepositFinancialPatrimony()).toBe(2300);
		expect(result.getFinancialPatrimony()).toBe(3300);
		expect(result.getTotalNetPatrimony()).toBe(3300);
		expect(result.getTotalPatrimony()).toBe(4000);
		expect(result.getPatrimonyDiff()).toBe(0);
		expect(result.getFinancialPatrimonyDiff()).toBe(0);
		expect(result.getInvestmentPatrimonyDiff()).toBe(0);
		expect(result.getDepositPatrimonyDiff()).toBe(0);
		expect(result.getRealEstatePatrimonyDiff()).toBe(0);
		expect(result.getInvestmentInterest()).toBe(0);

		expect(result.getReserveBalance()).toHaveLength(2);
		expect(findReserveBalance(result.getReserveBalance(), "Emergency Fund")?.balance).toBe(500);
		expect(findReserveBalance(result.getReserveBalance(), "Travel")?.balance).toBe(200);
	});

	it("calculates diffs, investment interest and net economy for a subsequent period", () => {
		const lastPeriodAccounting = new Accounting(
			"2024-01",
			100000,
			8000,
			5000,
			3000,
			108700,
			108000,
			0,
			0,
			700,
			700,
			[new ReserveBalance("Emergency Fund", 500), new ReserveBalance("Travel", 200)],
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		);

		const fakeFetcher = useFakeFetcher({
			accounting: lastPeriodAccounting,
			reserveTransactions: new Map([
				["Emergency Fund", 100],
				["Travel", -50],
			]),
			patrimony: new PatrimonyResult(100000, 3200, 5300),
			transactions: new TransactionResult(200, 4000),
		});

		const result = calculator.calculate("2024-02");

		expect(fakeFetcher.fetchAccounting).toHaveBeenCalledWith("2024-01");

		expect(result.getReserveDiff()).toBe(50);
		expect(result.getTotalReserve()).toBe(750);
		expect(result.getDepositFinancialPatrimony()).toBe(2450);
		expect(result.getInvestmentFinancialPatrimony()).toBe(5300);
		expect(result.getRealEstatePatrimony()).toBe(100000);
		expect(result.getFinancialPatrimony()).toBe(7750);
		expect(result.getTotalNetPatrimony()).toBe(107750);
		expect(result.getTotalPatrimony()).toBe(108500);

		expect(result.getPatrimonyDiff()).toBe(-250);
		expect(result.getFinancialPatrimonyDiff()).toBe(-250);
		expect(result.getInvestmentPatrimonyDiff()).toBe(300);
		expect(result.getDepositPatrimonyDiff()).toBe(-550);
		expect(result.getRealEstatePatrimonyDiff()).toBe(0);

		expect(result.getInvestmentInterest()).toBe(100);
		expect(result.getPercentageInvestmentInterest()).toBeCloseTo(100 / 5300);

		expect(result.getNetEconomy()).toBe(-350);
		expect(result.getPercentageNetEconomy()).toBeCloseTo(-0.0875);
		expect(result.getFinancialNetEconomy()).toBe(-350);
		expect(result.getPercentageFinancialNetEconomy()).toBeCloseTo(-0.0875);
	});

	it("guards against division by zero when investment patrimony is zero", () => {
		const lastPeriodAccounting = new Accounting(
			"2024-01",
			0, 500, 500, 0, 500, 500, 0, 0, 0, 0, [],
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		);

		useFakeFetcher({
			accounting: lastPeriodAccounting,
			reserveTransactions: new Map(),
			patrimony: new PatrimonyResult(0, 1000, 0),
			transactions: new TransactionResult(0, 1000),
		});

		const result = calculator.calculate("2024-02");

		expect(result.getInvestmentPatrimonyDiff()).toBe(-500);
		expect(result.getInvestmentInterest()).toBe(-500);
		expect(result.getPercentageInvestmentInterest()).toBe(0);
	});

	it("guards against division by zero when income is zero", () => {
		const lastPeriodAccounting = new Accounting(
			"2024-01",
			0, 1000, 0, 1000, 1000, 1000, 0, 0, 0, 0, [],
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		);

		useFakeFetcher({
			accounting: lastPeriodAccounting,
			reserveTransactions: new Map(),
			patrimony: new PatrimonyResult(0, 1500, 0),
			transactions: new TransactionResult(0, 0),
		});

		const result = calculator.calculate("2024-02");

		expect(result.getPatrimonyDiff()).toBe(500);
		expect(result.getPercentageNetEconomy()).toBe(0);
		expect(result.getPercentageFinancialNetEconomy()).toBe(0);
	});

	it("carries reserve balances forward and starts fresh for a brand-new account", () => {
		const lastPeriodAccounting = new Accounting(
			"2024-01",
			0, 0, 0, 0, 700, 0, 0, 0, 700, 700,
			[new ReserveBalance("Emergency Fund", 500), new ReserveBalance("Travel", 200)],
			0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0
		);

		useFakeFetcher({
			accounting: lastPeriodAccounting,
			reserveTransactions: new Map([
				["Emergency Fund", 100],
				["Car Fund", 300],
			]),
			patrimony: new PatrimonyResult(0, 0, 0),
			transactions: new TransactionResult(0, 0),
		});

		const result = calculator.calculate("2024-02");
		const reserveBalance = result.getReserveBalance();

		expect(reserveBalance).toHaveLength(3);
		expect(findReserveBalance(reserveBalance, "Emergency Fund")?.balance).toBe(600);
		expect(findReserveBalance(reserveBalance, "Travel")?.balance).toBe(200);
		expect(findReserveBalance(reserveBalance, "Car Fund")?.balance).toBe(300);
	});

	describe("lessOneMonth (verified indirectly via the previous-period lookup)", () => {
		it.each([
			["2024-01", "2023-12"],
			["2024-02", "2024-01"],
			["2024-11", "2024-10"],
			["2024-12", "2024-11"],
		])("for period %s, looks up previous period %s", (period, expectedPreviousPeriod) => {
			const fakeFetcher = useFakeFetcher({
				accounting: null,
				reserveTransactions: new Map(),
				patrimony: new PatrimonyResult(0, 0, 0),
				transactions: new TransactionResult(0, 0),
			});

			calculator.calculate(period);

			expect(fakeFetcher.fetchAccounting).toHaveBeenCalledWith(expectedPreviousPeriod);
		});
	});
});
