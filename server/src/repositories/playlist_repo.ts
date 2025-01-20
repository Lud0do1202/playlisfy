import { Playlist, PlaylistAttributes } from '../models/playlist';
import { PlaylistCreateDto } from '../dtos/playlist_dto';
import axios from 'axios';
import { PlaylistTrack } from '../models/playlist_track';

/* -------------------------------------------------------------------------- */
/*                                    REPO                                    */
/* -------------------------------------------------------------------------- */
export class PlaylistRepo {
    /* -------------------------------- INSTANCE -------------------------------- */
    private static _instance: PlaylistRepo;
    public static getInstance(PlaylistModel: typeof Playlist, PlaylistTrackModel: typeof PlaylistTrack): PlaylistRepo {
        if (!PlaylistRepo._instance) {
            PlaylistRepo._instance = new PlaylistRepo(PlaylistModel, PlaylistTrackModel);
        }
        return PlaylistRepo._instance;
    }

    /* ---------------------------------- MODEL --------------------------------- */
    public PlaylistModel!: typeof Playlist;
    public PlaylistTrackModel!: typeof PlaylistTrack;
    private constructor(PlaylistModel: typeof Playlist, PlaylistTrackModel: typeof PlaylistTrack) {
        this.PlaylistModel = PlaylistModel;
        this.PlaylistTrackModel = PlaylistTrackModel;
    }

    /* -------------------------------- READ ONE -------------------------------- */
    public async getById(id: number) {
        return await this.PlaylistModel.findByPk(id);
    }

    public async getBySpotifyId(spotifyId: string) {
        return await this.PlaylistModel.findOne({ where: { spotifyId } });
    }

    /* ------------------------------- READ MULTI ------------------------------- */
    public async getAll() {
        return await this.PlaylistModel.findAll();
    }

    /* --------------------------------- CREATE --------------------------------- */
    public async create(dto: PlaylistCreateDto) {
        // Create the playlist in Spotify
        const url = `https://api.spotify.com/v1/users/${dto.userSpotifyId}/playlists`;
        const body = {
            name: dto.name,
            description: dto.description || '',
            public: false,
        };
        const headers = {
            Authorization: `Bearer ${dto.spotifyAccessToken}`,
        };

        const response = await axios.post<{ id: string; name: string }>(url, body, { headers });
        const data = response.data;
        const playlist: PlaylistAttributes = {
            name: data.name,
            description: body.description,
            spotifyId: data.id,
            userId: dto.userId,
        };

        await this.PlaylistModel.create(playlist);
    }

    /* --------------------------------- TRACKS --------------------------------- */
    public async addTracks(playlistId: number, trackIds: number[]) {
        for (const trackId of trackIds) {
            await this.PlaylistTrackModel.create({ playlistId, trackId });
        }
    }
}
