import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelRelations } from './model_relations';
import { Database } from '../models/database';

export interface PlaylistTrackAttributes {
    trackId: number;
    playlistId: number;
}

export class PlaylistTrack extends Model<PlaylistTrackAttributes> implements PlaylistTrackAttributes {
    trackId!: number;
    playlistId!: number;

    static associate(__db: Database) {}
}

const PlaylistTrackModel = (sequelize: Sequelize) => {
    PlaylistTrack.init(
        {
            trackId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Tracks',
                    key: 'id',
                },
                allowNull: false,
            },
            playlistId: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                references: {
                    model: 'Playlists',
                    key: 'id',
                },
                allowNull: false,
            },
        },
        { sequelize },
    );
    return PlaylistTrack as typeof PlaylistTrack & ModelRelations;
};

export default PlaylistTrackModel;
