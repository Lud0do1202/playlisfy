export interface ISeeder<T> {
    getValues(): T[];
    seed(): void;
}
