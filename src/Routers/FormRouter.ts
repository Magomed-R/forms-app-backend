import { Router } from "express";
import Form from "../Models/Form";

const formRouter = Router();

formRouter
    .route("/")
    .get(async (req, res) => {
        let forms = await Form.find({ isOpen: true }).populate('author');
        return res.json(forms);
    })
    .post(async (req: any, res) => {
        const { title, questions, isOpen = true } = req.body;

        if (!title || !questions) return res.sendStatus(405);

        let form = new Form({
            title: title,
            questions: questions,
            author: req.user._id,
            isOpen: isOpen,
        });

        await form.save();

        req.user.forms.push(form._id)
        req.user.save()

        res.sendStatus(200);
    })
    .put(async (req: any, res) => {
        const { id, title, questions } = req.body;

        if (!id || !title || !questions) return res.sendStatus(405);

        let form = await Form.findOne({ _id: id });

        if (!form) return res.sendStatus(404);
        if (req.user._id.toString() != form?.author?.toString()) return res.sendStatus(403);

        form.title = title;
        form.questions = questions;
        form.save();

        res.sendStatus(200);
    })
    .delete(async (req: any, res) => {
        const { id } = req.body;
        if (!id) return res.sendStatus(405);

        let form = await Form.findOne({ _id: id });
        if (!form) return res.sendStatus(404);
        if (req.user._id.toString() != form?.author?.toString()) return res.sendStatus(403);

        Form.deleteOne({ _id: id });

        res.sendStatus(200);
    });

formRouter.route("/:id").get(async (req, res) => {
    try {
        let form = await Form.findOne({ _id: req.params.id }).populate('author');

        if (!form) {
            return res.sendStatus(404);
        }

        return res.json(form);
    } catch (error) {
        res.sendStatus(400);
    }
});

export default formRouter;
