import { Database } from '../models/database';

export interface ISeeder<T> {
    getValues(): T[];
    seed(db: Database): void;
}
