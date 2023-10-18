import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase";
import { Statement } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

let statementsRepositoryInMemory: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;

let getStatementOperationUseCase: GetStatementOperationUseCase;

enum OperationType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw",
}

describe("Get Statement Operation", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    statementsRepositoryInMemory = new InMemoryStatementsRepository();
    createStatementUseCase = new CreateStatementUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      usersRepositoryInMemory,
      statementsRepositoryInMemory
    );
  });

  it("Should be able to get info from a statement", async () => {
    const user = await createUserUseCase.execute({
      name: "user_test",
      email: "user@mail.com",
      password: "1234",
    });

    const { id } = user;

    const statement = await createStatementUseCase.execute({
      user_id: id as string,
      type: OperationType.DEPOSIT,
      amount: 250,
      description: "desc",
    });

    const statement_id = statement.id as string;

    const res = await getStatementOperationUseCase.execute({
      user_id: id as string,
      statement_id,
    });

    expect(res).toBeInstanceOf(Statement);
  });

  it("Should not be able to get info from a statement with invalid user id", () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "user_test",
        email: "user@mail.com",
        password: "1234",
      });

      const { id } = user;

      const statement = await createStatementUseCase.execute({
        user_id: id as string,
        type: OperationType.DEPOSIT,
        amount: 250,
        description: "desc",
      });

      const statement_id = statement.id as string;

      await getStatementOperationUseCase.execute({
        user_id: "abc",
        statement_id,
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to get info from a statement with invalid id", () => {
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
        amount: 250,
        description: "desc",
      });

      const res = await getStatementOperationUseCase.execute({
        user_id: id as string,
        statement_id: "abc",
      });

      console.log(res);
    }).rejects.toBeInstanceOf(AppError);
  });
});
