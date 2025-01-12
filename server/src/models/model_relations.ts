import { Database } from '../models/database';

export interface ModelRelations {
    associate(db: Database): void;
}
