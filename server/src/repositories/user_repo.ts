import { User } from '../models/user';
import { UserCreateDto } from '../dtos/user_dto';
import { Playlist } from '../models/playlist';
import { Track } from '../models/track';

/* -------------------------------------------------------------------------- */
/*                                    REPO                                    */
/* -------------------------------------------------------------------------- */
export class UserRepo {
    /* -------------------------------- INSTANCE -------------------------------- */
    private static _instance: UserRepo;
    public static getInstance(
        UserModel: typeof User,
        PlaylistModel: typeof Playlist,
        TrackModel: typeof Track,
    ): UserRepo {
        if (!UserRepo._instance) {
            UserRepo._instance = new UserRepo(UserModel, PlaylistModel, TrackModel);
        }
        return UserRepo._instance;
    }

    /* ---------------------------------- MODEL --------------------------------- */
    public UserModel!: typeof User;
    public PlaylistModel!: typeof Playlist;
    public TrackModel!: typeof Track;
    private constructor(UserModel: typeof User, PlaylistModel: typeof Playlist, TrackModel: typeof Track) {
        this.UserModel = UserModel;
        this.PlaylistModel = PlaylistModel;
        this.TrackModel = TrackModel;
    }

    /* -------------------------------- READ ONE -------------------------------- */
    public async getById(id: number) {
        return await this.UserModel.findByPk(id);
    }

    public async getBySpotifyId(spotifyId: string) {
        return await this.UserModel.findOne({ where: { spotifyId } });
    }

    public async getByEmail(email: string) {
        return await this.UserModel.findOne({ where: { email } });
    }

    /* ------------------------------- READ MULTI ------------------------------- */
    public async getAll() {
        return await this.UserModel.findAll({
            include: [
                {
                    model: this.PlaylistModel,
                    as: 'playlists',
                    include: [
                        {
                            model: this.TrackModel,
                            as: 'tracks',
                        },
                    ],
                },
            ],
        });
    }

    /* --------------------------------- CREATE --------------------------------- */
    public async create(user: UserCreateDto) {
        await this.UserModel.create(user);
    }
}
