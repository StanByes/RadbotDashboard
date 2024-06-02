import { guildsID } from "../data";
import User from "../classes/User";

export const API_ENDPOINT = "https://discord.com/api";

function refreshToken(user: User) {

}

export async function getUserInfo(user: User) {
    const request = await fetch(API_ENDPOINT + "/users/@me", {method: "GET", headers: header(user)});
    return await request.json() as DiscordUser;
}

export async function getUserGuilds(user: User) {
    const request = await fetch(API_ENDPOINT + "/users/@me/guilds", {method: "GET", headers: header(user)});
    const data: Guild[] = await request.json();

    const result: Guild[] = [];
    for (let i = 0; i < data.length; i++)
        if (guildsID().includes(data[i].id))
            result.push(data[i]);

    return result;
}

function header(user: User) {
    return {Authorization: "Bearer " + user.access_token};
}


type DiscordUser = {
    id: string,
    global_name: string,
    discriminator: string,
    avatar: string,
    verified: boolean,
    email: string,
    flags: number,
    banner: string,
    accent_color: number,
    premium_type: number,
    public_flags: number,
    avatar_decoration_data: {
        sku_id: string,
        asset: string
    }
}

export interface Guild {
    id: string,
    name: string,
    icon: string
}