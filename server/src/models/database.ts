import { Sequelize } from 'sequelize';
import process from 'process';
import configs from '../config/config';
import dotenv from 'dotenv';
import { UserRepo } from '../repositories/user_repo';
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

    /* -------------------------------- SEQUELIZE ------------------------------- */
    public sequelize!: Sequelize;
    public Sequelize!: typeof Sequelize;

    /* ------------------------------- CONSTRUCTOR ------------------------------ */
    private constructor() {
        const env = process.env.NODE_ENV || 'development';
        const config = configs[env];
        const sequelize = new Sequelize(config);

        // Define models
        this.sequelize = sequelize;
        this.Sequelize = Sequelize;
        this.User = UserRepo.getInstance(sequelize);

        // Associate models
        const relations = [this.User.Model];
        for (const model of relations) {
            model.associate(this);
        }
    }
}

const DB = Database.getInstance();

export { DB, Database };
