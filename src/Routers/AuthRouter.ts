import { config } from "dotenv";
config();

import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Models/User";
import RequestWithUser from "../Interfaces/RequestWithUser";

const accessTokenKey = process.env.ACCESS_TOKEN_SECRET || "";
const authRouter = Router();

interface User {
    _id: string;
    mail: string;
    name: string;
    password?: string;
    history: string[];
    forms: string[];
}

authRouter.get("/", (req: RequestWithUser, res: Response) => {
    res.json(req.user);
});

authRouter.route("/login").post(async function (req: Request, res: Response) {
    const { mail, password } = req.body;

    let user: User | null = await User.findOne({ mail: mail });

    if (!user) return res.sendStatus(401);
    if (!(await bcrypt.compare(password, user.password!))) return res.sendStatus(403);

    const data = jwt.sign({ id: user._id }, accessTokenKey);
    res.json(data);
});

authRouter.route("/signup").post(async function (req: Request, res: Response) {
    const { name, password, mail } = req.body;

    if (password.length < 4) return res.sendStatus(403);
    if (!name || !mail || !password) return res.sendStatus(405);

    const hashedPassword = await bcrypt.hash(password, 7);

    let user = await User.findOne({ mail: mail });

    if (user) return res.sendStatus(302);

    let NewUser = new User({
        name: name,
        password: hashedPassword,
        mail: mail,
        forms: [],
    });

    await NewUser.save();

    res.json({ accessToken: jwt.sign({ id: NewUser._id }, accessTokenKey) });
});

export default authRouter;
