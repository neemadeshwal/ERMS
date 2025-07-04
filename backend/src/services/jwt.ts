import jwt, { JwtPayload } from "jsonwebtoken";
import { JWTUSER } from "../types/types";
import { JWT_SECRET } from "../constants/constants";

class JWTService {
  public static generateTokenFromUser(user: any) {
    const payload: JWTUSER = {
      id: user?._id || user?.id, // MongoDB uses _id, but fallback to id
      email: user?.email,
    };

    const token = jwt.sign(payload, JWT_SECRET!, {
      expiresIn: "7d", // Add expiration time
    });
    return token;
  }

  public static decodeToken(token: string): JwtPayload | null {
    try {
      const user = jwt.verify(token, JWT_SECRET!) as JwtPayload;
      return user;
    } catch (error) {
      return null;
    }
  }

  // Optional: Add a method to check if token is expired
  public static isTokenExpired(token: string): boolean {
    try {
      const decoded = jwt.verify(token, JWT_SECRET!) as JwtPayload;
      const currentTime = Math.floor(Date.now() / 1000);
      return decoded.exp ? decoded.exp < currentTime : false;
    } catch (error) {
      return true; // If verification fails, consider it expired
    }
  }
}

export default JWTService;
