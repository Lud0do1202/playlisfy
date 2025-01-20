import { PlaylistAttributes } from '../models/playlist';
import { DB } from '../models/database';
import { ISeeder } from './iseeder';

export class PlaylistSeeder implements ISeeder<PlaylistAttributes> {
    seed(): void {
        const playlists = this.getValues();
        playlists.forEach(playlist => DB.PlaylistModel.create(playlist));
    }

    getValues(): PlaylistAttributes[] {
        return [
            {
                name: 'Azerty',
                description: 'La description de la playlist',
                spotifyId: '4dZOdE4Lnyg4ihgw4hwRTq',
                userId: 1,
            },
        ];
    }
}
