import { TrackCreateDto } from '../dtos/track_dto';
import { Track } from '../models/track';

/* -------------------------------------------------------------------------- */
/*                                    REPO                                    */
/* -------------------------------------------------------------------------- */
export class TrackRepo {
    /* -------------------------------- INSTANCE -------------------------------- */
    private static _instance: TrackRepo;
    public static getInstance(TrackModel: typeof Track): TrackRepo {
        if (!TrackRepo._instance) {
            TrackRepo._instance = new TrackRepo(TrackModel);
        }
        return TrackRepo._instance;
    }

    /* ---------------------------------- MODEL --------------------------------- */
    public TrackModel!: typeof Track;
    private constructor(TrackModel: typeof Track) {
        this.TrackModel = TrackModel;
    }

    /* -------------------------------- READ ONE -------------------------------- */
    public async getById(id: number) {
        return await this.TrackModel.findByPk(id);
    }

    public async getBySpotifyId(spotifyId: string) {
        return await this.TrackModel.findOne({ where: { spotifyId } });
    }

    /* ------------------------------- READ MULTI ------------------------------- */
    public async getAll() {
        return await this.TrackModel.findAll();
    }

    /* --------------------------------- CREATE --------------------------------- */
    public async create(track: TrackCreateDto) {
        await this.TrackModel.create({ ...track, status: 'NOT_STARTED' });
    }
}
