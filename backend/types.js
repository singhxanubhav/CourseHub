import { z } from "zod";

export const userSignup = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string()
});

export const userSignin = z.object({
  email: z.string().email(),
  password: z.string()
});