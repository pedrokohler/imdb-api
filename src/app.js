import express from "express";
import routes from "./routes";

const app = express();

export default app;

routes(app);
