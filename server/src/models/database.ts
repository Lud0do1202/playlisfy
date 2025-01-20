import { Sequelize } from 'sequelize';
import process from 'process';
import configs from '../config/config';
import dotenv from 'dotenv';
import { UserRepo } from '../repositories/user_repo';
import { PlaylistRepo } from '../repositories/playlist_repo';
import { TrackRepo } from '../repositories/track_repo';
import UserModel, { User } from './user';
import PlaylistModel, { Playlist } from './playlist';
import TrackModel, { Track } from './track';
import PlaylistTrackModel, { PlaylistTrack } from './playlist_track';
dotenv.config({ path: './environments/.env' });

class Database {
    /* -------------------------------- INSTANCE -------------------------------- */
    private static _instance: Database;
    public static getInstance(): Database {
        if (!Database._instance) {
            Database._instance = new Database();
        }
        return Database._instance;
    }

    /* ---------------------------------- REPO ---------------------------------- */
    public User!: UserRepo;
    public Playlist!: PlaylistRepo;
    public Track!: TrackRepo;

    /* --------------------------------- MODELS --------------------------------- */
    public sequelize!: Sequelize;
    public Sequelize!: typeof Sequelize;
    public UserModel!: typeof User;
    public PlaylistModel!: typeof Playlist;
    public TrackModel!: typeof Track;
    public PlaylistTrackModel!: typeof PlaylistTrack;

    /* ------------------------------- CONSTRUCTOR ------------------------------ */
    private constructor() {
        const env = process.env.NODE_ENV || 'development';
        const config = configs[env];
        const sequelize = new Sequelize(config);

        // Init models
        this.sequelize = sequelize;
        this.Sequelize = Sequelize;
        this.UserModel = UserModel(sequelize);
        this.PlaylistModel = PlaylistModel(sequelize);
        this.TrackModel = TrackModel(sequelize);
        this.PlaylistTrackModel = PlaylistTrackModel(sequelize);

        // Define repositories
        this.User = UserRepo.getInstance(this.UserModel, this.PlaylistModel, this.TrackModel);
        this.Playlist = PlaylistRepo.getInstance(this.PlaylistModel, this.PlaylistTrackModel);
        this.Track = TrackRepo.getInstance(this.TrackModel);

        // Associate models
        const relations = [this.UserModel, this.PlaylistModel, this.TrackModel, this.PlaylistTrackModel];
        for (const model of relations) {
            model.associate(this);
        }
    }
}

const DB = Database.getInstance();

export { DB, Database };
