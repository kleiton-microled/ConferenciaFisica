import { Patio } from "src/app/apps/tools/model/patio.model";

export class User {
    id?: number;
    username?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    token?: string;
    email?: string;
    avatar?: string;
    location?: string;
    title?: string;

    roles?: string[];
    permissions?: string[];
    patio?: Patio;
}
