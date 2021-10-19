import {mock} from "jest-mock-extended";

interface IConsole {
  print(line: string): void
}

const consoleService: IConsole = mock<IConsole>()

describe("AccountService", () => {
  it("creates correctly", () => {
    const accountService = new AccountService(consoleService);
    expect(accountService).toBeDefined();
  });

  it("account service prints headers when have no statements", () => {
    
    const accountService: IAccountService = new AccountService(consoleService);

    accountService.printStatement();

    expect(consoleService.print).toHaveBeenCalledWith('Date       || Amount || Balance')
  });
});

class AccountService implements IAccountService {
  constructor(private console: IConsole) {}

  deposit(amount: number): void {
    throw new Error("Method not implemented.");
  }
  withdraw(amount: number): void {
    throw new Error("Method not implemented.");
  }
  printStatement(): void {
    this.console.print('Date       || Amount || Balance')
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
