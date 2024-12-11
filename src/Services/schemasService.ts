import z from "zod";
import { Address } from "../Class/user";

// Schema para validar os dados de entrada do usuário
export const schemaUser = z.object({
  name: z
    .string()
    .min(6)
    .max(100)
    .regex(/^(?=.*[\p{L}])[\p{L}\s]{6,}$/u, {
      // Verificando se há caracteres do alfabeto e permitindo acentos
      message:
        "Name must be at least 8 characters and contain only letters and spaces",
    }),
  email: z.string().email(),
  password: z
    .string()
    .min(6)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
      message:
        "Password must have at least 8 characters, 1 uppercase letter, 1 number and 1 special character",
    }),
  dob: z.date().min(new Date("1900-01-01")),
  address: z.object({}),
  location: z.object({}),
  description: z.string().min(10),
});

// Schema para atualizar informações comuns do usuário
export const schemaUserUpdate = z.object({
  id: z.string().max(24),
  name: z
    .string()
    .min(6)
    .max(100)
    .regex(/^(?=.*[\p{L}])[\p{L}\s]{6,}$/u, {
      // Verificando se há caracteres do alfabeto e permitindo acentos
      message:
        "Name must be at least 8 characters and contain only letters and spaces",
    }),
  dob: z.date().min(new Date("1900-01-01")),
  address: z.string().min(8),
  description: z.string().min(10),
});

// Schema para atualizar a senha do usuário
export const schemaPassUpdate = z.object({
  id: z.string(),
  email: z.string().email(),
  newPass: z
    .string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/, {
      message:
        "Password must have at least 8 characters, 1 uppercase letter, 1 number and 1 special character",
    }),
});

// Schema para verificar informações de login
export const schemaLogin = z.object({
  email: z.string().email(),
  password: z.string(),
});
