import { UserAttributes } from '../models/user';
import { DB } from '../models/database';
import { ISeeder } from './iseeder';

export class UserSeeder implements ISeeder<UserAttributes> {
    seed(): void {
        const users = this.getValues();
        users.forEach(user => DB.User.create(user));
    }

    getValues(): UserAttributes[] {
        return [
            {
                spotifyId: '1',
                email: 'email1@example.com',
            },
            {
                spotifyId: '2',
                email: 'email2@gmail.com',
            },
        ];
    }
}
