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

    const newUser = await userRepository.create({
      name,
      email,
      password: hashed,
    });

    if (address) {
      await addressRepository.create({
        state: address.state,
        city: address.city,
        zipCode: address.zipCode,
        district: address.district,
        street: address.street,
        number: address.number,
        complement: address.complement,
        userId: newUser.id,
      })

    }

    return newUser;
  },

  listUsers: () => userRepository.findAll(),

  findUser: async (id: number) => {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("usuário não encontrado!");
    }

    return user;
  },

  update: async (id: number, data: any) => {
    const { password, email, ...rest } = data;

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    if (email) {
      const existing = await userRepository.findByEmail(email);
      if (existing && existing.id !== id) {
        throw new Error("E-mail já está cadastrado");
      }
    }

    const updateData: any = {
      ...rest,
    };

    if (email) updateData.email = email;
    if (hashedPassword) updateData.password = hashedPassword;

    return userRepository.update(id, updateData);
  },

  delete: async (id: number) => {
    const user = await userRepository.findById(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    return userRepository.delete(id);
  },

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
