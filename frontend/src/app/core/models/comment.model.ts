import { User } from './user.model';
import { Ticket } from './ticket.model';

export interface Comment {
    id: number;
    content: string;
    author: User;
    ticket?: Ticket;
    createdAt: string;
}
