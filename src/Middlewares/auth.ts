import jwt, { JwtPayload } from "jsonwebtoken";
import { Response, NextFunction } from "express";
import User from "../Models/User";
import RequestWithUser from "../Interfaces/RequestWithUser";

export default async function (req: RequestWithUser, res: Response, next: NextFunction) {

    try {
        const method = req.method.toLowerCase();
        if (
            req.path == "/auth/login" ||
            req.path == "/auth/signup" ||
            (req.path.includes("form") && method == "get") ||
            (req.path.includes("/user/") && method == "get")
        )
            return next();

        const token = req.headers["authorization"]?.split(" ")[1];
        if (req.path == '/form/answer' && !token) next() 
        if (!token) return res.sendStatus(401);

        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET || "") as JwtPayload;

        if (!user.id) return res.sendStatus(401);

        const account = await User.findOne({ _id: user.id });
        if (!account) return res.sendStatus(401);

        if (!req.body) req.body = {};
        req.user = account.toObject();

        next();
    } catch (error) {
        return res.sendStatus(400);
    }
}
