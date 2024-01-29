import { mergeResolvers } from "@graphql-tools/merge";

import usersResolver from "./users.resolver";

export default mergeResolvers([usersResolver]);
