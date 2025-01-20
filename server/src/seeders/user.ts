import { UserAttributes } from '../models/user';
import { DB } from '../models/database';
import { ISeeder } from './iseeder';

export class UserSeeder implements ISeeder<UserAttributes> {
    seed(): void {
        const users = this.getValues();
        users.forEach(user => DB.UserModel.create(user));
    }

    getValues(): UserAttributes[] {
        return [
            {
                spotifyId: 'djxz2lnzx86zc64xz3b1jt0wn',
                email: 'ludo.traina@gmail.com',
                spotifyAccessToken:
                    'BQD0Uh8I2C-Zjh2Tx6stnoNE31eWxtCepP61pKSBuGZ9mwWEQCBMllptQZgf7v1mGjyNTgUXEJjmw9n1BZeesYFpH7FCed16LY8KNN9ZFcHaWsIsal6lPBmPjOHVJAuY1uOUyHW1bYIgOoUd80O8esOX4SqsbVLNH7ehUBcuCPlnMsHDyxOWEtMYSzhTfoHofXN5LVHHiIDhorRzaVOYAQar9HlG3aFyQ3p1ROH-ncVsyox0cqsrnhdJjHgBJ0n3V96M2uXSdSlDk6h0v9j-Swp3',
                spotifyRefreshToken:
                    'AQAqa2bHydVma4lNCtdXzb3VycKHLU6iOXXew0JMp5PBPDxnYVRNF9dmYhsR4uIDt6a2s6ZgAseTByGeKm_5UhQgcC6q9l5GghhZU6gpZntCst_FjM9K7380WCmV3hdTZkA',
            },
        ];
    }
}
