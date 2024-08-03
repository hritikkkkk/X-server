import { Tweet } from "@prisma/client";
import { CreateTweet, GraphqlContext } from "../../interfaces";
import UserService from "../../services/user";
import TweetService from "../../services/tweet";

const queries = {
  getAllTweets: () => TweetService.getAllTweets(),
};

const mutations = {
  createTweet: async (
    parent: any,
    { payload }: { payload: CreateTweet },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user) throw new Error("You are not authenticated");
    const tweet = await TweetService.createTweet({
      ...payload,
      userId: ctx.user.id,
    });
    return tweet;
  },
};

const extraResolvers = {
  Tweet: {
    author: (parent: Tweet) => UserService.getUserById(parent.authorId),
  },
};

export const resolvers = { queries, mutations, extraResolvers };
