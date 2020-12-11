import GuardService from './security/guard.service';
import AppService from './utility/app.service';
import RedisStoreService from './utility/redis-store.service';
import CookieGuard from './security/cookie.guard';
import CookieStrategy from './security/cookie.strategy';
import UsersService from "./users.service";
import AuthService from "./auth.service";

const services = [
    GuardService,
    AppService,
    RedisStoreService,
    CookieGuard,
    CookieStrategy,
    UsersService,
    AuthService
];

export default services;
