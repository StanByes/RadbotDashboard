import databasePool from "./db";
import File from "../classes/File";
import { ResultSetHeader } from "mysql2";
import { existsSync } from "fs";
import { getFilePath, getFileStat } from "../data";

const tableName = "files";

export namespace FileModel {
    export async function getFilesByUploader(uploaderID: string) {
        const query = `SELECT * FROM \`${tableName}\` WHERE \`uploader_id\` = ? ORDER BY \`uploaded_at\` ASC`;
        const [results] = await databasePool.execute<File[]>({
            sql: query,
            values: [uploaderID]
        });

        for (let i = 0; i < results.length; i++) {
            // Check if file exists //
            results[i].file_exist = existsSync(getFilePath(uploaderID, results[i].name));

            // Parse link_guilds to Array //
            results[i].link_guilds = JSON.parse(results[i].link_guilds as unknown as string);

            // Get Weight //
            results[i].size = results[i].file_exist ? getFileStat(uploaderID, results[i].name).size : 0;
        }

        return results;
    }

    export async function insertFile(file: File) {
        const query = `INSERT INTO \`${tableName}\` (uploader_id, name, original_name, link_guilds, uploaded_at, edited_at) VALUES (?, ?, ?, ?, NOW(), NOW())`;
        const [res] = await databasePool.execute<ResultSetHeader>({
            sql: query,
            values: [file.uploader_id, file.name, file.original_name, JSON.stringify(file.link_guilds)]
        });

        return res.affectedRows != 0;
    }

    export async function editLinkGuilds(file: File) {
        const query = `UPDATE \`${tableName}\` SET \`link_guilds\` = ?, \`edited_at\` = NOW() WHERE \`uploader_id\` = ? AND \`name\` = ?`;
        const [res] = await databasePool.execute<ResultSetHeader>({
            sql: query,
            values: [JSON.stringify(file.link_guilds), file.uploader_id, file.name]
        });

        return res.affectedRows != 0;
    }

    export async function renameFile(file: File, newName: string) {
        const query = `UPDATE \`${tableName}\` SET \`name\` = ?, \`edited_at\` = NOW() WHERE \`uploader_id\` = ? AND \`name\` = ?`;
        const [res] = await databasePool.execute<ResultSetHeader>({
            sql: query,
            values: [newName, file.uploader_id, file.name]
        });

        return res.affectedRows != 0;
    }

    export async function deleteFile(file: File) {
        const query = `DELETE FROM \`${tableName}\` WHERE \`uploader_id\` = ? AND \`name\` = ?`;
        const [res] = await databasePool.execute<ResultSetHeader>({
            sql: query,
            values: [file.uploader_id, file.name]
        });

        return res.affectedRows != 0;
    }
}