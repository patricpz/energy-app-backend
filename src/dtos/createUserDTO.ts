import { Prisma } from "../generated/prisma/client";

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  constantMedidor: number;
  energyDistributorId: number;
  ruralZone?: boolean;
  whiteFare?: boolean;
  tsee?: boolean;
  cipValue?: string;
  address?: {
    state: string;
    city: string;
    zipCode: string;
    district: string;
    street: string;
    number: string;
    complement?: string;
  }
}

