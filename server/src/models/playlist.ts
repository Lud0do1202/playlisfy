import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelRelations } from './model_relations';
import { Database } from '../models/database';

export interface PlaylistAttributes {
    id: number;
    spotifyId: string;
    name: string;
    description: string;
    userId: number;
}

export class Playlist extends Model<PlaylistAttributes> implements PlaylistAttributes {
    id!: number;
    spotifyId!: string;
    name!: string;
    description!: string;
    userId!: number;

    static associate(db: Database) {
        // Tracks
        Playlist.belongsToMany(db.Track, {
            through: db.PlaylistTrack,
            foreignKey: 'playlistId',
            otherKey: 'trackId',
            as: 'tracks',
        });

        // User
        Playlist.belongsTo(db.User, {
            foreignKey: 'userId',
            as: 'user',
        });
    }
}

const PlaylistModel = (sequelize: Sequelize) => {
    Playlist.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            spotifyId: { type: DataTypes.STRING, unique: true, allowNull: true },
            name: { type: DataTypes.STRING, allowNull: false },
            description: { type: DataTypes.STRING, allowNull: false },
            userId: { type: DataTypes.INTEGER, allowNull: false },
        },
        { sequelize },
    );
    return Playlist as typeof Playlist & ModelRelations;
};

export default PlaylistModel;
