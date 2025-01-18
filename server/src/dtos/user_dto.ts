import { UserAttributes } from "../models/user";

export interface UserCreateDto extends Omit<UserAttributes, 'id'> {}
