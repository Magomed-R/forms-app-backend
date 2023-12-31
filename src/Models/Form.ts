import { Schema, model } from "mongoose";

const historySchema = new Schema(
    {
        user_id: {
            type: Schema.Types.ObjectId,
            ref: "user",
        },
        correctAnswers: [Boolean],
    },
    {
        timestamps: true,
    }
);

const formSchema = new Schema({
    title: String,
    questions: [
        {
            case: String,
            answers: [
                {
                    name: String,
                    isAnswer: Boolean,
                },
            ],
        },
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: "user",
    },
    history: [historySchema],
    cover: String,
    description: String,
    isOpen: {
        type: Boolean,
        default: true,
    },
});

export default model("form", formSchema);
