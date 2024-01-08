import { config } from "dotenv";
config();

import express from "express";
import cors from "cors";
import chalk from "chalk";
import mongoose from "mongoose";

import FormRouter from "./Routers/FormRouter";
import AuthRouter from "./Routers/AuthRouter";
import UserRouter from "./Routers/UserRouter";
import auth from "./Middlewares/auth";

const app = express();
const port = process.env.PORT || 3010;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(auth);
app.use("/form", FormRouter);
app.use("/auth", AuthRouter);
app.use("/user", UserRouter);

try {
    app.listen(port, () => console.log(chalk.bold.green(`Server started on port ${port}`)));
    mongoose
        .connect(`${process.env.MONGO_URL}/quiz`)
        .then((res) => console.log(chalk.bold.green("Connected to DB")))
        .catch((error) => console.log(error));
} catch (error) {
    console.log(error);
}
