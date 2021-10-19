describe("AccountService", () => {
  it("creates correctly", () => {
    const accountService = new AccountService();
    expect(accountService).toBeDefined();
  });

  it("account service prints headers when have no statements", () => {
    const accountService: IAccountService = new AccountService();

    accountService.printStatement();

    // Date       || Amount || Balance
  });
});

class AccountService implements IAccountService {
  constructor() {}
  deposit(amount: number): void {
    throw new Error("Method not implemented.");
  }
  withdraw(amount: number): void {
    throw new Error("Method not implemented.");
  }
  printStatement(): void {
    throw new Error("Method not implemented.");
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
