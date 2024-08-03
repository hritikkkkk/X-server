import axios from "axios";
import JWTService from "./jwt";
import { prismaClient } from "../client/db";
import { GoogleTokenResult } from "../interfaces";

class UserService {
  public static async verifyGoogleAuthToken(token: string) {
    const googleToken = token;
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOauthURL.searchParams.set("id_token", googleToken);

    const { data } = await axios.get<GoogleTokenResult>(
      googleOauthURL.toString(),
      {
        responseType: "json",
      }
    );

    const user = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
          profileImageURL: data.picture,
        },
      });
    }

    const userInDb = await prismaClient.user.findUnique({
      where: { email: data.email },
    });

    if (!userInDb) throw new Error("User with this email not found");

    const userToken = JWTService.generateTokenForUser(userInDb);

    return userToken;
  }
  public static async getUserById(id: string) {
    return  prismaClient.user.findUnique({ where: { id } });
  }
}

export default UserService;
