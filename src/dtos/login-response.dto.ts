import UserStatus from "../enums/user-status.enum";

export default class LoginResponseDTO {
    userId: string;
    userStatus: UserStatus;
    sessionId: string;
    body: string;
}
