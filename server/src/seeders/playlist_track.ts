import { PlaylistTrackAttributes } from '../models/playlist_track';
import { DB } from '../models/database';
import { ISeeder } from './iseeder';

export class PlaylistTrackSeeder implements ISeeder<PlaylistTrackAttributes> {
    seed(): void {
        const playlistTracks = this.getValues();
        playlistTracks.forEach(playlistTrack => DB.PlaylistTrackModel.create(playlistTrack));
    }

    getValues(): PlaylistTrackAttributes[] {
        return [
            {
                playlistId: 1,
                trackId: 1,
            },
        ];
    }
}
