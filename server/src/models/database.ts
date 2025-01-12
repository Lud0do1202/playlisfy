import PlaylistTrackModel, { PlaylistTrack } from './playlist_track';
import { Sequelize } from 'sequelize';
import process from 'process';
import configs from '../config/config';
import dotenv from 'dotenv';
import TrackModel, { Track } from './track';
import PlaylistModel, { Playlist } from './playlist';
import UserModel, { User } from './user';
import { ModelRelations } from './model_relations';
dotenv.config({ path: './environments/.env' });

export class Database {
    public Track!: typeof Track;
    public Playlist!: typeof Playlist;
    public PlaylistTrack!: typeof PlaylistTrack;
    public User!: typeof User;
    public sequelize!: Sequelize;
    public Sequelize!: typeof Sequelize;

    public ModelRelations!: ModelRelations[];

    constructor() {
        const env = process.env.NODE_ENV || 'development';
        const config = configs[env];
        const sequelize = new Sequelize(config);

        // Define models
        this.Track = TrackModel(sequelize);
        this.Playlist = PlaylistModel(sequelize);
        this.PlaylistTrack = PlaylistTrackModel(sequelize);
        this.User = UserModel(sequelize);
        this.sequelize = sequelize;
        this.Sequelize = Sequelize;

        // Define model relations
        this.ModelRelations = [this.Track, this.Playlist, this.PlaylistTrack, this.User];

        // Associate models
        this.associate();
    }

    private associate() {
        for (const model of this.ModelRelations) {
            model.associate(this);
        }
    }
}
