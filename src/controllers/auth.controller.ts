import AuthService from "../services/auth.service";
import {Body, Controller, ForbiddenException, Get, HttpStatus, Post, Res} from "@nestjs/common";
import LoginDto from "../dtos/LoginDto";
import UserStatus from "../enums/user-status.enum";
import {ResponseEntity} from "../utils/response-util/response.class";
import {Response } from "express";
import Routes from "../config/app.routes";

@Controller()
class AuthController {

    constructor(private readonly authService: AuthService) {}

    @Post(Routes.POST_LOGIN)
    async login(@Body() payload: LoginDto, @Res() response: Response): Promise<void> {

        const credential = await this.authService.login(payload)

        if (credential && credential.userStatus === UserStatus.ACTIVE) {
            const body: ResponseEntity<string> = {
                status: {
                    code: HttpStatus.CREATED,
                    description: 'Created',
                },
                data: credential.body,
            }

            response.cookie(process.env.TOKEN_NAME, credential.sessionId, {
                maxAge: Number(process.env.TOKEN_EXPIRATION) * 1000,
                httpOnly: true,
                secure: true,
            });

            response.json(body)

        } else throw new ForbiddenException('invalid account.');
    }

    @Get(Routes.POST_SIGN_OUT)
    async logout(@Res() response: Response): Promise<void> {

        response.clearCookie(process.env.TOKEN_NAME)
        await this.authService.logout()

        const body: ResponseEntity<string> = {
            status: {
                code: HttpStatus.OK,
                description: 'Ok',
            },
        }

        response.json(body)
    }
}

export default AuthController
