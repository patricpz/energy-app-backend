import { userRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";

interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
}

export const userService = {
  createUser: async ({ name, email, password }: CreateUserDTO) => {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);

    return userRepository.create({
      name,
      email,
      password: hashed,
    });
  },

  listUsers: () => userRepository.findAll(),
};
