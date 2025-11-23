import { userRepository } from "../repositories/userRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserDTO } from "../dtos/createUserDTO";
import { LoginUserDTO } from "../dtos/loginUserDTO";
import { addressRepository } from "../repositories/addressRepository";

export const userService = {
  createUser: async ({ name, email, password, address }: CreateUserDTO) => {
    const exists = await userRepository.findByEmail(email);
    if (exists) throw new Error("Email already registered");

    const hashed = await bcrypt.hash(password, 10);

    let addressId: number | null = null;

    if (address) {
      const newAddress = await addressRepository.create({
        state: address.state,
        city: address.city,
        zipCode: address.zipCode,
        district: address.district,
        street: address.street,
        number: address.number,
        complement: address.complement,
      })

      addressId = newAddress.id
    }

    return userRepository.create({
      name,
      email,
      password: hashed,
      addressId,
    });
  },

  listUsers: () => userRepository.findAll(),

  login: async ({ email, password }: LoginUserDTO) => {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new Error("Email ou senha inválidos.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Email ou senha inválidos.");
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error("JWT_SECRET não foi definido no .env");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      jwtSecret,
      { expiresIn: "30d" }
    );

    return {
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  },
};
