import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Balance", () => {
  beforeEach(() => {
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getBalanceUseCase = new GetBalanceUseCase(
      statementsRepositoryInMemory,
      usersRepositoryInMemory
    );
  });

  it("Should be able to get user balance", async () => {
    const user = await createUserUseCase.execute({
      name: "user_test",
      email: "user@mail.com",
      password: "1234",
    });

    const { id } = user;

    await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "desc",
    });

    await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.WITHDRAW,
      amount: 75,
      description: "desc",
    });

    const res = await getBalanceUseCase.execute({ user_id: id as string });

    expect(res).toHaveProperty("balance");
    expect(res).toHaveProperty("statement");
  });

  it("Should not be able to get balance if user id is invalid", async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: "abcd" });
    }).rejects.toBeInstanceOf(AppError);
  });
});
