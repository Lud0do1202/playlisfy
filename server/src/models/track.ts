import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelRelations } from './model_relations';
import { Database } from '../models/database';

type TrackStatus = 'NOT_STARTED' | 'ENQUEUE_FAILED' | 'ENQUEUED' | 'ANALYSIS_FAILED' | 'ANALYSED';

export interface TrackAttributes {
    id: number;
    spotifyId: string;
    name: string;
    artists: string;
    duration: number;
    description: string | null;
    status: TrackStatus;
    instruments: string[] | null;
    genres: string[] | null;
    keywords: string[] | null;
    voices: string[] | null;
    bpm: number | null;
    moods: string[] | null;
    movements: string[] | null;
    characters: string[] | null;
}

export class Track extends Model<TrackAttributes> implements TrackAttributes {
    id!: number;
    spotifyId!: string;
    name!: string;
    artists!: string;
    duration!: number;
    description!: string | null;
    status!: TrackStatus;
    instruments!: string[] | null;
    genres!: string[] | null;
    keywords!: string[] | null;
    voices!: string[] | null;
    bpm!: number | null;
    moods!: string[] | null;
    movements!: string[] | null;
    characters!: string[] | null;

    static associate(db: Database) {
        Track.belongsToMany(db.Playlist, {
            through: 'PlaylistTracks',
            foreignKey: 'trackId',
            otherKey: 'playlistId',
            as: 'playlists',
        });
    }
}

const TrackModel = (sequelize: Sequelize) => {
    Track.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            spotifyId: { type: DataTypes.STRING, unique: true, allowNull: true },
            name: { type: DataTypes.STRING, allowNull: false },
            artists: { type: DataTypes.STRING, allowNull: false },
            duration: { type: DataTypes.INTEGER, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: true },
            status: { type: DataTypes.STRING, allowNull: false },
            instruments: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
            genres: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
            keywords: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
            voices: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
            bpm: { type: DataTypes.INTEGER, allowNull: true },
            moods: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
            movements: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
            characters: { type: DataTypes.ARRAY(DataTypes.STRING), allowNull: true },
        },
        { sequelize },
    );
    return Track as typeof Track & ModelRelations;
};

export default TrackModel;
