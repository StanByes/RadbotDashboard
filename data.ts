import { lstatSync, readFileSync } from "fs";
import { join } from "path";

export const botGuilds = (): string[] => JSON.parse(readFileSync("data/guilds.json", "utf-8"));

export const getDirPath = (uploaderId: string) => `data/${uploaderId}/Soundboard`;
export const getFilePath = (uploaderId: string, name: string) => join(getDirPath(uploaderId), name);

export const getFileStat = (uploaderId: string, name: string) => lstatSync(getFilePath(uploaderId, name));