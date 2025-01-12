import { UserAttributes } from '../models/user';
import { Database } from '../models/database';
import { ISeeder } from './iseeder';

export class UserSeeder implements ISeeder<UserAttributes> {
    seed(db: Database): void {
        const users = this.getValues();
        users.forEach(user => db.User.create(user));
    }

    getValues(): UserAttributes[] {
        return [
            {
                id: 1,
                spotifyId: '1',
                email: 'email1@example.com',
            },
            {
                id: 2,
                spotifyId: '2',
                email: 'email2@gmail.com',
            },
        ];
    }
}
