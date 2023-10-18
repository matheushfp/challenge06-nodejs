import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let createUserUseCase: CreateUserUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Create Statement", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a statement (deposit)", async () => {
    const user = await createUserUseCase.execute({
      name: "user_test",
      email: "user@mail.com",
      password: "1234",
    });

    const { id } = user;

    const deposit = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "desc",
    });

    expect(deposit).toHaveProperty("id");
    expect(deposit.type).toEqual("deposit");
  });

  it("Should be able to create a statement (withdraw)", async () => {
    const user = await createUserUseCase.execute({
      name: "user_test",
      email: "user@mail.com",
      password: "1234",
    });

    const { id } = user;

    await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: "desc",
    });

    const res = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "desc",
    });

    expect(res).toHaveProperty("id");
    expect(res.type).toEqual("withdraw");
  });

  it("Should not be able to create a statement (withdraw) with insufficient funds", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "user_test",
        email: "user@mail.com",
        password: "1234",
      });

      const { id } = user;

      await createStatementUseCase.execute({
        user_id: id as string,
        type: OperationType.DEPOSIT,
        amount: 200,
        description: "desc",
      });

      await createStatementUseCase.execute({
        user_id: id as string,
        type: OperationType.WITHDRAW,
        amount: 500,
        description: "desc",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
