import { Schema, model } from "mongoose";

let formSchema = new Schema({
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
    isOpen: {
        type: Boolean,
        default: true
    }
});

export default model("form", formSchema);
