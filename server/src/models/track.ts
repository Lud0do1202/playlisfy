import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelRelations } from './model_relations';
import { Database } from './database';

export type TrackStatus = 'NOT_STARTED' | 'ENQUEUE_FAILED' | 'ENQUEUED' | 'ANALYSIS_FAILED' | 'ANALYSED';

export interface TrackAttributes {
    id?: number;
    spotifyId: string;
    uri: string;
    name: string;
    artists: string;
    duration: number;
    description?: string;
    status: TrackStatus;
    instruments?: string;
    genres?: string;
    keywords?: string;
    voices?: string;
    bpm?: number;
    moods?: string;
    movements?: string;
    characters?: string;
}

export class Track extends Model<TrackAttributes> implements TrackAttributes {
    id?: number;
    spotifyId!: string;
    uri!: string;
    name!: string;
    artists!: string;
    duration!: number;
    description?: string;
    status!: TrackStatus;
    instruments?: string;
    genres?: string;
    keywords?: string;
    voices?: string;
    bpm?: number;
    moods?: string;
    movements?: string;
    characters?: string;

    static associate(db: Database) {
        Track.belongsToMany(db.PlaylistModel, {
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
            uri: { type: DataTypes.STRING, allowNull: false },
            name: { type: DataTypes.STRING, allowNull: false },
            artists: { type: DataTypes.STRING, allowNull: false },
            duration: { type: DataTypes.INTEGER, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: true },
            status: { type: DataTypes.STRING, allowNull: false },
            instruments: { type: DataTypes.STRING, allowNull: true },
            genres: { type: DataTypes.STRING, allowNull: true },
            keywords: { type: DataTypes.STRING, allowNull: true },
            voices: { type: DataTypes.STRING, allowNull: true },
            bpm: { type: DataTypes.INTEGER, allowNull: true },
            moods: { type: DataTypes.STRING, allowNull: true },
            movements: { type: DataTypes.STRING, allowNull: true },
            characters: { type: DataTypes.STRING, allowNull: true },
        },
        { sequelize },
    );
    return Track as typeof Track & ModelRelations;
};

export default TrackModel;
