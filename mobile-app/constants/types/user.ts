export interface User {
    username: string;
    email: string;
    password: string;
    role: string;
}

export interface UserLoginState {
    email: string;
    password: string;
}