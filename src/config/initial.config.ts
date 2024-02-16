import dotenv from "dotenv";
dotenv.config();

export const PORT :string | number = process.env.SERVER_PORT || 8000;
export const dbUrl :string = process.env.DATABASE_URL;
export const dbName :string = process.env.DATABASE_NAME || 'authenticationDB';