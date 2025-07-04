import bcryptjs from "bcryptjs";
import { SALT_ROUNDS } from "../constants/constants";

export async function hashPassword(password: string) {
  const salt = await bcryptjs.genSalt(Number(SALT_ROUNDS));

  const hashedPassword = bcryptjs.hash(password, salt);

  return hashedPassword;
}

export async function checkHashedPassword(
  password: string,
  hashPassword: string
) {
  const isValid = await bcryptjs.compare(password, hashPassword);

  if (!isValid) {
    return false;
  } else {
    return true;
  }
}
