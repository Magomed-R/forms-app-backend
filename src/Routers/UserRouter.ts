import { Router } from "express";
import User from "../Models/User";

const userRouter = Router();

userRouter.get("/:id", async (req, res) => {
    if (!req.params.id) return res.sendStatus(400);

    const user = await User.findOne({ _id: req.params.id }).populate("forms");

    if (!user) return res.sendStatus(404);

    await user.populate("forms.author");

    if (!user) return res.sendStatus(404);

    res.json(user);
});

export default userRouter;
