import { Options } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config({ path: './environments/.env' });

const configs: Record<string, Options> = {
    development: {
        username: process.env.POSTGRES_USER as string,
        password: process.env.POSTGRES_PASSWORD as string,
        database: process.env.POSTGRES_DB as string,
        host: process.env.POSTGRES_HOST as string,
        port: process.env.POSTGRES_PORT as unknown as number,
        dialect: 'postgres',
    },
    test: {
        username: 'root',
        password: '',
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: 'root',
        password: '',
        database: 'database_production',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
};

export default configs;
