import { User } from "@prisma/client";
import JWT from "jsonwebtoken";
import { JWTUser } from "../interfaces";
import serverConfig from "../config/serverConfig";

class JWTService {
  public static generateTokenForUser(user: User) {
    const payload: JWTUser = {
      id: user?.id,
      email: user?.email,
    };
    const token = JWT.sign(payload, serverConfig.JWT_SECRET as string);
    return token;
  }

  public static decodeToken(token: string) {
    try {
      return JWT.verify(token, serverConfig.JWT_SECRET as string) as JWTUser;
    } catch (error) {
      return null;
    }
  }
}

export default JWTService;
