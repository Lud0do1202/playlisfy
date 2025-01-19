import { Sequelize } from 'sequelize';
import PlaylistModel, { Playlist, PlaylistAttributes } from '../models/playlist';
import { PlaylistCreateDto } from '../dtos/playlist_dto';
import axios from 'axios';

/* -------------------------------------------------------------------------- */
/*                                    REPO                                    */
/* -------------------------------------------------------------------------- */
export class PlaylistRepo {
    /* -------------------------------- INSTANCE -------------------------------- */
    private static _instance: PlaylistRepo;
    public static getInstance(sequelize: Sequelize): PlaylistRepo {
        if (!PlaylistRepo._instance) {
            PlaylistRepo._instance = new PlaylistRepo(sequelize);
        }
        return PlaylistRepo._instance;
    }

    /* ---------------------------------- MODEL --------------------------------- */
    public Model!: typeof Playlist;
    private constructor(sequelize: Sequelize) {
        this.Model = PlaylistModel(sequelize);
    }

    /* -------------------------------- READ ONE -------------------------------- */
    public async getById(id: number) {
        return await this.Model.findByPk(id);
    }

    public async getBySpotifyId(spotifyId: string) {
        return await this.Model.findOne({ where: { spotifyId } });
    }

    /* ------------------------------- READ MULTI ------------------------------- */
    public async getAll() {
        return await this.Model.findAll();
    }

    /* --------------------------------- CREATE --------------------------------- */
    public async create(dto: PlaylistCreateDto) {
        // Create the playlist in Spotify
        const url = `https://api.spotify.com/v1/users/${dto.userSpotifyId}/playlists`;
        const body = {
            name: dto.name,
            description: dto.description || '',
            public: false,
        }
        const headers = {
            Authorization: `Bearer ${dto.spotifyAccessToken}`,
        }

        try {
            const response = await axios.post<{id: string, name: string}>(url, body, { headers });
            const data = response.data;
            const playlist : PlaylistAttributes = {
                name: data.name,
                description: body.description,
                spotifyId: data.id,
                userId: dto.userId,
            };

            return await this.Model.create(playlist);
        } catch (__error) {
            return null;
        }

    }
}
