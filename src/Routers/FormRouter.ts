import { Router } from "express";
import Form from "../Models/Form";
import RequestWithUser from "../Interfaces/RequestWithUser";

interface IAnswer {
    _id: string;
    name: string;
    isAnswer: boolean;
}

const formRouter = Router();

formRouter
    .route("/")
    .get(async (req, res) => {
        let forms = await Form.find({ isOpen: true }, { "questions.answers.isAnswer": 0 }).populate("author");
        return res.json(forms);
    })
    .post(async (req: RequestWithUser, res) => {
        const { title, questions, isOpen = true, description, cover } = req.body;

        if (!title || !questions) return res.sendStatus(405);

        let form = new Form({
            title: title,
            questions: questions,
            author: req.user!._id,
            isOpen: isOpen,
            description: description,
            cover: cover
        });

        await form.save();

        req.user!.forms!.push(form._id.toString());
        req.user!.save();

        res.sendStatus(200);
    })
    .put(async (req: RequestWithUser, res) => {
        const { id, title, questions, description, cover } = req.body;

        if (!id || !title || !questions) return res.sendStatus(405);

        let form = await Form.findOne({ _id: id });

        if (!form) return res.sendStatus(404);
        if (req.user!._id!.toString() != form?.author?.toString()) return res.sendStatus(403);

        form.title = title;
        form.questions = questions;
        form.description = description
        form.cover = cover
        form.save();

        res.sendStatus(200);
    })
    .delete(async (req: RequestWithUser, res) => {
        const { id } = req.body;
        if (!id) return res.sendStatus(405);

        let form = await Form.findOne({ _id: id });
        if (!form) return res.sendStatus(404);
        if (req.user!._id!.toString() != form?.author?.toString()) return res.sendStatus(403);

        await Form.deleteOne({ _id: id })

        req.user!.forms!.splice(req.user!.forms!.findIndex((el: any) => el._id.toString() == id), 1)
        await req.user!.save()

        res.sendStatus(200);
    });

formRouter.get("/:id", async (req: RequestWithUser, res) => {
    try {
        let form = await Form.findOne({ _id: req.params.id }, { "questions.answers.isAnswer": 0 }).populate("author");

        if (!form) {
            return res.sendStatus(404);
        }

        return res.json(form);
    } catch (error) {
        res.sendStatus(400);
    }
});

formRouter.put("/check", async (req: RequestWithUser, res) => {
    const form_id: string = req.body.form_id;
    const answers: string[] = req.body.answers;

    let form = await Form.findOne({ _id: form_id });

    if (!form) return res.sendStatus(404);

    let rightAnswers: boolean[] = []

    for (let i = 0; i < form.questions.length; i++) {
        for (let j = 0; j < form.questions[i].answers.length; j++) {
            if (form.questions[i].answers[j].isAnswer && form.questions[i].answers[j].name == answers[i]) rightAnswers.push(true)
            else rightAnswers.push(false)
        }
    }

    form.history.push({
        user_id: req.user!._id,
        correctAnswers: rightAnswers
    })
    await form.save()

    res.json({ isCorrect: rightAnswers });
});

export default formRouter;
