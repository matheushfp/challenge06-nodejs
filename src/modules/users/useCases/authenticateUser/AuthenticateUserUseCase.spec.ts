import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let autenthicateUserUseCase: AuthenticateUserUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate User", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    autenthicateUserUseCase = new AuthenticateUserUseCase(
      usersRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);

    // create an user
    await createUserUseCase.execute({
      name: "user_test",
      email: "usertest@mail.com",
      password: "abc",
    });
  });

  it("Should be able to authenticate an user and receive the token", async () => {
    const res = await autenthicateUserUseCase.execute({
      email: "usertest@mail.com",
      password: "abc",
    });

    expect(res).toHaveProperty("token");
  });

  it("Should not be able to authenticate an user with wrong email", () => {
    expect(async () => {
      await autenthicateUserUseCase.execute({
        email: "testuser@mail.com",
        password: "abc",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("Should not be able to authenticate an user with wrong password", () => {
    expect(async () => {
      await autenthicateUserUseCase.execute({
        email: "usertest@mail.com",
        password: "123",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
