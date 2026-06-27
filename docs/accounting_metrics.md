# Accounting metrics

This document explains how each metric produced by the [`AccountingCalculator`](../src/accounting/accounting_calculator.ts) is calculated, and what data it is based on.

All metrics are calculated for a given `period` (a `YYYY-MM` month) and rely on three sources of manually-inputted data:

- **Patrimony** notes (one per asset, under the configured patrimony folder), each with a `Value` and linked to an [asset](../src/asset/asset_type.ts) of type `DEPOSIT_ACCOUNT`, `INVESTMENT_ACCOUNT` or `REAL_ESTATE`.
- **Transaction** notes (income such as `Salary`/`Bonus`, or `Deposit`/`Withdraw` movements against an asset).
- **Reserve transaction** notes (`Deposit`/`Withdraw` movements against a named reserve account, e.g. an emergency fund).
- The previous month's **Accounting** note, if one exists, used to compute differences between periods.

## Patrimony metrics

- **Real Estate Patrimony**: sum of the `Value` of all patrimony notes whose asset type is `REAL_ESTATE`.
- **Investment Financial Patrimony**: sum of the `Value` of all patrimony notes whose asset type is `INVESTMENT_ACCOUNT`.
- **Deposit Financial Patrimony**: sum of the `Value` of all patrimony notes whose asset type is `DEPOSIT_ACCOUNT`, minus the **Total Reserve** (see below) — reserve money kept in deposit accounts is excluded from the deposit patrimony, since it's already accounted for separately.
- **Financial Patrimony**: `Deposit Financial Patrimony + Investment Financial Patrimony`.
- **Total Net Patrimony**: `Financial Patrimony + Real Estate Patrimony`.
- **Total Patrimony**: `Total Net Patrimony + Total Reserve` — the net patrimony plus the money set aside in reserves.

## Reserve metrics

- **Reserve Diff**: net sum of all reserve transactions in the period (deposits add, withdrawals subtract).
- **Total Reserve**: `Reserve Diff` added to the previous period's **Total Reserve** (or just `Reserve Diff` if there is no previous period).
- **Reserve Balance**: a per-account breakdown of reserve money. For each reserve account, it carries over the previous period's balance and adds that account's reserve transactions for the current period; reserve accounts with no prior history start from the transactions of the current period alone.

## Period-over-period differences

These compare the current period's patrimony figures against the previous period's Accounting note (and are `0` if there is no previous period):

- **Patrimony Diff**: `Total Net Patrimony - previous Total Net Patrimony`.
- **Financial Patrimony Diff**: `Financial Patrimony - previous Financial Patrimony`.
- **Investment Patrimony Diff**: `Investment Financial Patrimony - previous Investment Financial Patrimony`.
- **Deposit Patrimony Diff**: `Deposit Financial Patrimony - previous Deposit Financial Patrimony`.
- **Real Estate Patrimony Diff**: `Real Estate Patrimony - previous Real Estate Patrimony`.

## Income and investment metrics

- **Total Income**: sum of the `Value` of transactions of type `Salary` or `Bonus` in the period.
- **Total Investment Deposit**: net amount deposited into investment accounts during the period (`Deposit` transactions add, `Withdraw` transactions subtract), based on transactions whose asset is of type `INVESTMENT_ACCOUNT`.
- **Investment Interest**: the portion of the change in investment patrimony that isn't explained by deposits/withdrawals, i.e. `Investment Patrimony Diff - Total Investment Deposit`. This represents investment gains (or losses) earned during the period. It is `0` if there is no previous period to compare against.
- **Percentage Investment Interest**: `Investment Interest / Investment Financial Patrimony` — the investment return rate for the period.

## Economy (savings) metrics

- **Net Economy**: `Patrimony Diff - Investment Interest` — how much net patrimony grew during the period once investment gains/losses are stripped out, i.e. the amount actually saved from income and other patrimony movements.
- **Percentage Net Economy**: `Net Economy / Total Income` — the share of income that was saved during the period.
- **Financial Net Economy**: `Financial Patrimony Diff - Investment Interest` — the same idea as Net Economy, but restricted to financial patrimony (deposits + investments), excluding real estate variations.
- **Percentage Financial Net Economy**: `Financial Net Economy / Total Income` — the share of income that was saved into financial patrimony during the period.
