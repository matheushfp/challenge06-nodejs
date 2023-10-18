import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create User", () => {
  beforeEach(() => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to create a user", async () => {
    const user = await createUserUseCase.execute({
      name: "user_test",
      email: "user@mail.com",
      password: "1234",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create a user with an email already in use", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "user_test",
        email: "user@mail.com",
        password: "1234",
      });

      await createUserUseCase.execute({
        name: "user2_test",
        email: "user@mail.com",
        password: "abcd",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
