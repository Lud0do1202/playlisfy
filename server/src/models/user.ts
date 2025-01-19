import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelRelations } from './model_relations';
import { Database } from '../models/database';

export interface UserAttributes {
    id?: number;
    spotifyId: string;
    email: string;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    id?: number;
    spotifyId!: string;
    email!: string;
    spotifyAccessToken?: string;
    spotifyRefreshToken?: string;

    static associate(db: Database) {
        // Playlists
        User.hasMany(db.Playlist.Model, {
            foreignKey: 'userId',
            as: 'playlists',
        });
    }
}

const UserModel = (sequelize: Sequelize) => {
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            spotifyId: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                unique: true,
                allowNull: false,
            },
            spotifyAccessToken: {
                type: DataTypes.STRING(1000),
                allowNull: true,
            },  
            spotifyRefreshToken: {
                type: DataTypes.STRING (1000),
                allowNull: true,
            },
        },
        { sequelize },
    );
    return User as typeof User & ModelRelations;
};

export default UserModel;
