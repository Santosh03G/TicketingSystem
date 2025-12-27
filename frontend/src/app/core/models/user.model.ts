export enum Role {
    ADMIN = 'ADMIN',
    STAFF = 'STAFF',
    USER = 'USER'
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: Role;
    joinedAt?: string;
    password?: string; // Optional for updates/display
}
