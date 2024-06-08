import User from "../classes/User";
import env from "../env";

export const API_ENDPOINT = "https://discord.com/api";

export async function refreshToken(user: User) {
    const data = {
        grant_type: "refresh_token",
        refresh_token: user.refresh_token,
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET
    };

    const request = await fetch(API_ENDPOINT + "/oauth2/token", {
        body: new URLSearchParams(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    });
    return await request.json() as AccessTokenResponse;
}

export async function getUserInfo(user: User) {
    const request = await fetch(API_ENDPOINT + "/users/@me", {method: "GET", headers: header(user)});
    return await request.json() as DiscordUser;
}

export async function getUserGuilds(user: User) {
    const request = await fetch(API_ENDPOINT + "/users/@me/guilds", {method: "GET", headers: header(user)});
    return await request.json() as Guild[];
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

export type Guild = {
    id: string,
    name: string,
    icon: string
}

export type AccessTokenResponse = {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    score: string
}