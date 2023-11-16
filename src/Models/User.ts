import { Schema, model } from "mongoose";

const historySchema = new Schema(
    {
        form_id: {
            type: Schema.Types.ObjectId,
            ref: "form",
        },
    },
    {
        timestamps: true,
    }
);

const userSchema = new Schema({
    mail: String,
    name: String,
    password: String,
    history: [historySchema],
    forms: [
        {
            type: Schema.Types.ObjectId,
            ref: "form",
        },
    ],
});

export default model("user", userSchema);
