import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelRelations } from './model_relations';
import { Database } from './database';

export interface PlaylistAttributes {
    id?: number;
    spotifyId: string;
    name: string;
    description: string;
    userId: number;
}

export class Playlist extends Model<PlaylistAttributes> implements PlaylistAttributes {
    id?: number;
    spotifyId!: string;
    name!: string;
    description!: string;
    userId!: number;

    static associate(db: Database) {
        // User
        Playlist.belongsTo(db.UserModel, {
            foreignKey: 'userId',
            as: 'user',
        });

        // Tracks
        Playlist.belongsToMany(db.TrackModel, {
            through: db.PlaylistTrackModel,
            foreignKey: 'playlistId',
            otherKey: 'trackId',
            as: 'tracks',
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
