import { Schema, model } from "mongoose";

const userSchema = new Schema({
    mail: String,
    name: String,
    password: String,
    avatar: String,
    forms: [
        {
            type: Schema.Types.ObjectId,
            ref: "form",
        },
    ],
});

export default model("user", userSchema);
