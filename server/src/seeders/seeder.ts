import { ISeeder } from './iseeder';
import { UserSeeder } from './user';

export class Seeder {
    public seed(): void {
        this._getSeeders().forEach(seeder => seeder.seed());
    }

    private _getSeeders(): ISeeder<unknown>[] {
        return [new UserSeeder()];
    }
}
