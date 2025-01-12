import { Database } from '../models/database';
import { ISeeder } from './iseeder';
import { PlaylistSeeder } from './playlist';
import { PlaylistTrackSeeder } from './playlist_track';
import { TrackSeeder } from './track';
import { UserSeeder } from './user';

export class Seeder {
    public seed(db: Database): void {
        this._getSeeders().forEach(seeder => seeder.seed(db));
    }

    private _getSeeders(): ISeeder<unknown>[] {
        return [new UserSeeder(), new TrackSeeder(), new PlaylistSeeder(), new PlaylistTrackSeeder()];
    }
}
