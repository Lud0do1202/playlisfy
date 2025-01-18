import { Sequelize } from 'sequelize';
import UserModel, { User } from '../models/user';
import { UserCreateDto } from '../dtos/user_dto';

/* -------------------------------------------------------------------------- */
/*                                    REPO                                    */
/* -------------------------------------------------------------------------- */
export class UserRepo {
    /* -------------------------------- INSTANCE -------------------------------- */
    private static _instance: UserRepo;
    public static getInstance(sequelize: Sequelize): UserRepo {
        if (!UserRepo._instance) {
            UserRepo._instance = new UserRepo(sequelize);
        }
        return UserRepo._instance;
    }

    /* ---------------------------------- MODEL --------------------------------- */
    public Model!: typeof User;
    private constructor(sequelize: Sequelize) {
        this.Model = UserModel(sequelize);
    }

    /* -------------------------------- READ ONE -------------------------------- */
    public async getById(id: number) {
        return await this.Model.findByPk(id);
    }

    public async getBySpotifyId(spotifyId: string) {
        return await this.Model.findOne({ where: { spotifyId } });
    }

    public async getByEmail(email: string) {
        return await this.Model.findOne({ where: { email } });
    }

    /* ------------------------------- READ MULTI ------------------------------- */
    public async getAll() {
        return await this.Model.findAll();
    }

    /* --------------------------------- CREATE --------------------------------- */
    public async create(user: UserCreateDto) {
        return await this.Model.create(user);
    }
}
