import express from 'express';
import routes from './routes';
import { DB } from './models/database';
import dotenv from 'dotenv';
import { SyncOptions } from 'sequelize';
import { Seeder } from './seeders/seeder';
dotenv.config({ path: './environments/.env' });

// Initialize express
const app = express();
const port = process.env.EXPRESS_PORT;

// Middlewares
app.use(express.json());
app.use('/', routes);

// Environment variables
const env = {
    forceSync: process.env.SQ_FORCE_SYNC === 'true',
    seedDb: process.env.SQ_SEED_DB === 'true',
};

// Initialize database
const options: SyncOptions = { force: env.forceSync };
DB.sequelize.sync(options).then(() => {
    // Start server
    app.listen(port, () => {
        console.log(`\nServer is running on port ${port}...`);
    });

    // Seed database
    if (env.seedDb) {
        new Seeder().seed();
    }
});

/* -------------------------------------------------------------------------- */
/*                                   SANDBOX                                  */
/* -------------------------------------------------------------------------- */
app.get('/', (req, res) => {
    DB.User.getAll()
        .then(results => {
            const result = `-----> All playlists: ${JSON.stringify(results, null, 2)}`;
            res.send(result);
        })
        .catch(error => {
            console.log('-----> Error: ', error);
            res.status(500).send('An error occurred');
        });
});
