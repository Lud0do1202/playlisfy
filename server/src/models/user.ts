import { DataTypes, Model, Sequelize } from 'sequelize';
import { ModelRelations } from './model_relations';
import { Database } from '../models/database';

export interface UserAttributes {
    id: number;
    spotifyId: string;
    email: string;
}

export class User extends Model<UserAttributes> implements UserAttributes {
    id!: number;
    spotifyId!: string;
    email!: string;

    static associate(db: Database) {
        // Playlists
        User.hasMany(db.Playlist, {
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
        },
        { sequelize },
    );
    return User as typeof User & ModelRelations;
};

export default UserModel;
