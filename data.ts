import { readdirSync, statSync } from "fs";

export const guildsID = () => readdirSync("data");
export const getFileByGuild = (guildId: string) => {
    const files = readdirSync("data/" + guildId + "/Soundboard")
    const result = [];
    for (let file of files)
        result.push({
            name: file,
            size: statSync("data/" + guildId + "/Soundboard/" + file).size
        });
    
    return result;
};