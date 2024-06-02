import { readdirSync } from "fs";

export const guildsID = () => readdirSync("data");