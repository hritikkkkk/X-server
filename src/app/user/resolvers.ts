import { User } from "@prisma/client";
import { GraphqlContext } from "../../interfaces";
import UserService from "../../services/user";
import TweetService from "../../services/tweet";
import FollowService from "../../services/follows";

const queries = {
  verifyGoogleToken: async (parent: any, { token }: { token: string }) => {
    const resultToken = await UserService.verifyGoogleAuthToken(token);
    return resultToken;
  },
  getCurrentUser: async (parent: any, args: any, ctx: GraphqlContext) => {
    const id = ctx.user?.id;
    if (!id) return null;

    const user = await UserService.getUserById(id);
    return user;
  },
  getUserById: async (
    parent: any,
    { id }: { id: string },
    ctx: GraphqlContext
  ) => UserService.getUserById(id),
};

const extraResolvers = {
  User: {
    tweets: (parent: User) => TweetService.getTweetsByAuthorId(parent.id),
    followers: (parent: User) => {
      return FollowService.followers(parent.id);
    },
    following: async (parent: User) => {
      return FollowService.following(parent.id);
    },
  },
};

const mutations = {
  followUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("You are not authenticated");
    await UserService.followUser(ctx.user.id, to);
    return true;
  },
  unfollowUser: async (
    parent: any,
    { to }: { to: string },
    ctx: GraphqlContext
  ) => {
    if (!ctx.user || !ctx.user.id) throw new Error("You are not authenticated");
    await UserService.unfollowUser(ctx.user.id, to);
    return true;
  },
};

export const resolvers = { queries, extraResolvers, mutations };
