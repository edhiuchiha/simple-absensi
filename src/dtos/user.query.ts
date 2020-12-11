export default class UsersQueryDTO {
    term?: string;
    order?: 'username' | 'email' | 'order';
    sort?: 'asc' | 'desc';
    page?: number;
}
