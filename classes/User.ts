import { Guild } from "../utils/api";
import dayjs, { Dayjs } from "dayjs";

export default class User {
    public access_token: string;
    public refresh_token: string;
    public expires_at: string;

    public id?: string;
    public name?: string;
    public avatar?: string;

    public guilds?: Guild[];

    public constructor(access_token: string, refresh_token: string, expires_in: number) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
        this.expires_at = dayjs().add(expires_in, "seconds").format();
    }
}