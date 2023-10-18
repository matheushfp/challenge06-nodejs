import { AppError } from "../../../../shared/errors/AppError";
import { User } from "../../entities/User";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let usersRepositoryInMemory: InMemoryUsersRepository;
let showUserProfileUseCase: ShowUserProfileUseCase;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(async () => {
    usersRepositoryInMemory = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      usersRepositoryInMemory
    );

    createUserUseCase = new CreateUserUseCase(usersRepositoryInMemory);
  });

  it("Should be able to show user info", async () => {
    // create an user
    const user = await createUserUseCase.execute({
      name: "user_test",
      email: "usertest@mail.com",
      password: "abc",
    });

    const { id } = user;

    const profile = await showUserProfileUseCase.execute(id as string);

    expect(profile).toBeInstanceOf(User);
  });

  it("Should not be able to show user info if id is invalid", async () => {
    expect(async () => {
      await showUserProfileUseCase.execute("abcd");
    }).rejects.toBeInstanceOf(AppError);
  });
});
