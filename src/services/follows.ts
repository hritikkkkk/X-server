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
}

export default FollowService;
