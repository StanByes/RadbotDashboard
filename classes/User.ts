import { Guild } from "../utils/api";

export default class User {
    public access_token: string;
    public refresh_token: string;

    public id?: string;
    public name?: string;
    public avatar?: string;

    public guilds?: Guild[];

    public constructor(access_token: string, refresh_token: string) {
        this.access_token = access_token;
        this.refresh_token = refresh_token;
    }
}