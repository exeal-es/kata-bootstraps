import { mock, mockReset } from "jest-mock-extended";

jest.useFakeTimers()

interface IConsole {
  print(line: string): void;
}

const consoleService: IConsole = mock<IConsole>();

describe("AccountService", () => {
  beforeEach(() => {
    mockReset(consoleService);
    jest.setSystemTime(new Date('2012-01-10'))
  })
  
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
      "Date       || Amount || Balance\n10/01/2012 || 1000 || 1000"
    );
  });

  it("account service can handle 2 deposits", () => {
    const accountService: IAccountService = new AccountService(consoleService);
    accountService.deposit(1000);
    jest.setSystemTime(new Date('2012-01-13'))
    accountService.deposit(2000);

    accountService.printStatement();

    expect(consoleService.print).toHaveBeenCalledWith(
      "Date       || Amount || Balance\n10/01/2012 || 1000 || 1000\n13/01/2012 || 2000 || 3000"
    );
  });

  it("account service can handle 2 deposits and a withdraw", () => {
    const accountService: IAccountService = new AccountService(consoleService);
    accountService.deposit(1000);
    jest.setSystemTime(new Date('2012-01-13'))
    accountService.deposit(2000);
    jest.setSystemTime(new Date('2012-01-14'))
    accountService.withdraw(-500)

    accountService.printStatement();

    expect(consoleService.print).toHaveBeenCalledWith(
      "Date       || Amount || Balance\n10/01/2012 || 1000 || 1000\n13/01/2012 || 2000 || 3000\n14/01/2012 || -500 || 2500"
    );
  });

  it("account service cannot deposit negative amount", () => {
    const accountService: IAccountService = new AccountService(consoleService);
    accountService.deposit(-1000);

    accountService.printStatement();

    expect(consoleService.print).toHaveBeenCalledWith(
      "Date       || Amount || Balance"
    );
  });

  it("account service cannot withdraw positive amount", () => {
    const accountService: IAccountService = new AccountService(consoleService);
    accountService.withdraw(1000);

    accountService.printStatement();

    expect(consoleService.print).toHaveBeenCalledWith(
      "Date       || Amount || Balance"
    );
  });
});

interface IAccountLine {
  date: Date;
  amount: number;
  balance: number;
  toLine(): string;
}

class AccountLine implements IAccountLine {
  SPACER = ' || '

  constructor(public date: Date, public amount: number, public balance: number) {}

  toLine(): string {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit' };

    return this.date.toLocaleString('es-ES', options) + this.SPACER + this.amount + this.SPACER + this.balance;
  }
}

class AccountService implements IAccountService {
  private headers = "Date       || Amount || Balance";
  private accountLines: IAccountLine[] = [];
  private accountBalance = 0

  constructor(private console: IConsole) {}

  deposit(amount: number): void {
    if (amount < 0) {
      return
    }
    this.handleOperation(amount)
  }
  withdraw(amount: number): void {
    if (amount > 0) {
      return
    }
    this.handleOperation(amount)
  }
  printStatement(): void {
    // const lines = this.accountLines.reduce((acc, line) => {
    //   acc += '\n' + line.toLine()
    //   return acc
    // }, this.headers)
    var lines = this.headers;
    this.accountLines.forEach((line) => {
      lines += '\n'
      lines += line.toLine();
    })
    this.console.print(lines);
  }

  private handleOperation(amount: number): void {
    this.accountBalance += amount;
    const line = new AccountLine(new Date(), amount, this.accountBalance)
    this.accountLines.push(line);
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
