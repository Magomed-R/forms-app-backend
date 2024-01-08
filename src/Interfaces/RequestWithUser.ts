import { Request } from "express";

interface IQuestion {
    title?: string;
    questions?: [
        {
            case?: string;
            answers?: [
                {
                    name?: string;
                    isAnswer?: boolean;
                }
            ];
        }
    ];
    cover?: string;
    description?: string;
    isOpen?: {
        type?: boolean;
        default?: true;
    };
}

export default interface RequestWithUser extends Request {
    user?: {
        _id?: string;
        name?: string;
        mail?: string;
        password?: string;
        avatar?: string;
        forms?: string[] | IQuestion[];
        save: () => void;
    };
}
