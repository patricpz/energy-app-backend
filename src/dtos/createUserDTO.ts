export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  constantMedidor: number;
  ruralZone?: boolean;
  whiteFare?: boolean;
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

