import { User } from "@prisma/client";
import { prismaClient } from "../client/db";

class FollowService {
  public static async followers(id: string) {
    const result = await prismaClient.follows.findMany({
      where: { following: { id: id } },
      include: {
        follower: true,
      },
    });
    return result.map((res) => res.follower);
  }
  public static async following(id: string) {
    const result = await prismaClient.follows.findMany({
      where: { follower: { id: id } },
      include: {
        following: true,
      },
    });
    return result.map((res) => res.following);
  }
  public static async getRecommendedUsers(userId: string) {
    const myFollowings = await prismaClient.follows.findMany({
      where: {
        follower: { id: userId },
      },
      include: {
        following: {
          include: { followers: { include: { following: true } } },
        },
      },
    });

    const users: User[] = [];

    for (const followings of myFollowings) {
      for (const followingOfFollowedUser of followings.following.followers) {
        if (
          followingOfFollowedUser.following.id !== userId &&
          myFollowings.findIndex(
            (e) => e?.followingId === followingOfFollowedUser.following.id
          ) < 0
        ) {
          users.push(followingOfFollowedUser.following);
        }
      }
    }
    return users;
  }
}

export default FollowService;
