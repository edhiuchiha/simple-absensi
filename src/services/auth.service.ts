import {InjectRepository} from "@nestjs/typeorm";
import Users from "../models/users.entity";
import {Repository} from "typeorm";
import HashUtil from "../utils/common-util/hash.util";
import UsersService from "./users.service";
import LoginDto from "../dtos/LoginDto";
import {Logger} from "@nestjs/common";
import JwtUser from "../dtos/jwt/jwt-user.dto";
import GuardService from "./security/guard.service";
import JwtPayload from "../dtos/jwt/jwt-payload.dto";
import LoginResponseDTO from "../dtos/login-response.dto";
import UserStatus from "../enums/user-status.enum";
import moment = require("moment");
import RedisStoreService from "./utility/redis-store.service";

const CONTEXT = 'AuthService'

class AuthService {
    constructor(
        @InjectRepository(Users)
        private readonly usersRepository: Repository<Users>,
        private readonly hashUtils: HashUtil,
        private readonly userService: UsersService,
        private readonly guardService: GuardService,
        private readonly redisService: RedisStoreService
    ) {}

    async login(payload: LoginDto): Promise<LoginResponseDTO>{

        let loginResponse: LoginResponseDTO = null;
        const user = await this.userService.findByEmailOrUsername(payload.email)

        if(!user) return null

        try {
            const isValidPassword = await this.hashUtils.compare(payload.password, user.password)

            if(isValidPassword){
                const session = await this.createSession(user)
                loginResponse = {
                    userId: user.id,
                    userStatus: UserStatus[user.status],
                    sessionId: session.token,
                    body: session.body
                }

            } else Logger.warn('Invalid account credential.', `${CONTEXT}@login` , true);

            if (user.status === UserStatus.ACTIVE) {
                user.lastLogin = moment().toDate();
                await this.userService.update(user);
            } else Logger.log(`Account status ${user.status} (not active).`, `${CONTEXT}@login`, true);

            return loginResponse
        } catch (e){
            Logger.error('something went wrong', e, `${CONTEXT}@login`, true);
            return null;
        }
    }

    private async createSession(userData: Users): Promise<{token: string, body: string}> {

        const user: JwtUser = new JwtUser(userData);
        const payload: JwtPayload = { user }

        const body: string = this.guardService.sign(payload);
        const token: string = this.guardService.sign({
            user: payload.user
        });

        await this.redisService.set('token', token)

        return { token, body };

    }

    async logout(): Promise<void>{
        await this.redisService.unlink('token')
    }
}

export default AuthService
