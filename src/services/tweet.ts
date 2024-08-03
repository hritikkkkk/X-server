import { prismaClient } from "../client/db";
import { CreateTweet } from "../interfaces";

class TweetService {
  public static async createTweet(payload: CreateTweet) {
    return prismaClient.tweet.create({
      data: {
        content: payload.content,
        imageURL: payload.imageURL,
        author: { connect: { id: payload.userId } },
      },
    });
  }
  public static getAllTweets() {
    return prismaClient.tweet.findMany({ orderBy: { createdAt: "desc" } });
  }
  public static getTweetsByAuthorId(authorId: string) {
    return prismaClient.tweet.findMany({
      where: { authorId: authorId },
    });
  }
}

export default TweetService;
