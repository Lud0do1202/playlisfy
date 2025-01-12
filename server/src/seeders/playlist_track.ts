import { PlaylistTrackAttributes } from '../models/playlist_track';
import { Database } from '../models/database';
import { ISeeder } from './iseeder';

export class PlaylistTrackSeeder implements ISeeder<PlaylistTrackAttributes> {
    seed(db: Database): void {
        const playlistTracks = this.getValues();
        playlistTracks.forEach(track => db.PlaylistTrack.create(track));
    }

    getValues(): PlaylistTrackAttributes[] {
        return [
            {
                trackId: 1,
                playlistId: 1,
            },
            {
                trackId: 2,
                playlistId: 1,
            },
            {
                trackId: 1,
                playlistId: 2,
            },
            {
                trackId: 3,
                playlistId: 2,
            },
        ];
    }
}
