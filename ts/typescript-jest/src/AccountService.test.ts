import { mock } from "jest-mock-extended";

interface IConsole {
  print(line: string): void;
}

const consoleService: IConsole = mock<IConsole>();

describe("AccountService", () => {
  it("creates correctly", () => {
    const accountService = new AccountService(consoleService);

    expect(accountService).toBeDefined();
  });

  it("account service prints headers when have no statements", () => {
    const accountService: IAccountService = new AccountService(consoleService);

    accountService.printStatement();

    expect(consoleService.print).toHaveBeenCalledWith(
      "Date       || Amount || Balance"
    );
  });

  it("account service can handle a deposit", () => {
    const accountService: IAccountService = new AccountService(consoleService);
    accountService.deposit(1000);

    accountService.printStatement();

    expect(consoleService.print).toHaveBeenCalledWith(
      "Date       || Amount || Balance\n10/01/2012 || 1000   || 1000"
    );
  });
});

interface IAccountLine {
  date: Date;
  amount: number;
  balance: number;
}

class AccountService implements IAccountService {
  private headers = "Date       || Amount || Balance";
  private accountLines: IAccountLine[] = [];

  constructor(private console: IConsole) {}

  deposit(amount: number): void {
    this.accountLines.push({ date: new Date(), amount, balance: amount });
  }
  withdraw(amount: number): void {
    throw new Error("Method not implemented.");
  }
  printStatement(): void {
    this.console.print(this.headers);
  }
}

interface IAccountService {
  deposit(amount: number): void;
  withdraw(amount: number): void;
  printStatement(): void;
}

// Date       || Amount || Balance
// 14/01/2012 || -500   || 2500
// 13/01/2012 || 2000   || 3000
// 10/01/2012 || 1000   || 1000
