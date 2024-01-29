import { UsersService } from "../../services/users.service";
import { Resolvers } from "../generated/graphql";

export default {
  Query: {
    getUsers: async (_, args) => {
      return UsersService.getAll({ filter: args.filter, sort: args.sort });
    },

    async getUser(_, { id }) {
      return UsersService.getById(id);
    },
  },

  Mutation: {
    async createUser(_, { data }) {
      return UsersService.create(data);
    },

    async updateUser(_, { id, data }) {
      return UsersService.update(id, data);
    },

    async deleteUser(_, { id }) {
      return UsersService.delete(id);
    },
  },
} as Resolvers;
