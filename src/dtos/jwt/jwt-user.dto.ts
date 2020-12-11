import Users from "../../models/users.entity";

export default class JwtUser {
    id: string;
    username: string;
    fullname: string;
    status: string;

    constructor(user: Partial<Users>) {
        this.id = user.id;
        this.username = user.username;
        this.fullname = user.fullname;
        this.status = user.status;
    }
}
