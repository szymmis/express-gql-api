import express from "express";

import { useGraphQL } from "./graphql";

const app = express();
useGraphQL(app);

export default app;
