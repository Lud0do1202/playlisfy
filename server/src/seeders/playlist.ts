import { PlaylistAttributes } from '../models/playlist';
import { Database } from '../models/database';
import { ISeeder } from './iseeder';

export class PlaylistSeeder implements ISeeder<PlaylistAttributes> {
    seed(db: Database): void {
        const playlists = this.getValues();
        playlists.forEach(playlist => db.Playlist.create(playlist));
    }

    getValues(): PlaylistAttributes[] {
        return [
            {
                id: 1,
                spotifyId: '1',
                name: 'Playlist 1',
                description: 'Description 1',
                userId: 2,
            },
            {
                id: 2,
                spotifyId: '2',
                name: 'Playlist 2',
                description: 'Description 2',
                userId: 2,
            },
        ];
    }
}
