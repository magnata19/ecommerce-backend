import { z } from 'zod';

export const SignUpSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
})

export const AddressSchema = z.object({
  lineOne: z.string(),
  lineTwo: z.string().optional(),
  pincode: z.string(),
  country: z.string(),
  city: z.string()
})