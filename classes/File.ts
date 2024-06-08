import { RowDataPacket } from "mysql2";

export default interface File extends RowDataPacket {
    id?: number;
    uploader_id: string;
    name: string;
    original_name: string;
    link_guilds: string[];
    size: number;
    uploaded_at: Date;
    edited_at: Date;
    file_exist: boolean;
}