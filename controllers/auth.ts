import { NextFunction, Request, Response } from "express";
import env from "../env";
import { API_ENDPOINT, AccessTokenResponse, getUserGuilds, getUserInfo } from "../utils/api";
import User from "../classes/User";
import logger from "../logger";
import { existsSync, mkdirSync } from "fs";
import { FileModel } from "../models/FileModel";
import { botGuilds } from "../data";

const redirectURI = (!env.APP_URL.endsWith("/") ? env.APP_URL + "/" : env.APP_URL) + "oauth_redirect";

export function login(req: Request, res: Response) {
    if (req.session.user != null)
        return res.redirect("/");

    const authorizeData = {
        client_id: env.CLIENT_ID,
        response_type: "code",
        redirect_uri: redirectURI,
        scope: "identify guilds"
    }
    return res.redirect("https://discord.com/oauth2/authorize?" + new URLSearchParams(authorizeData));
}

export async function oauthRedirect(req: Request, res: Response, next: NextFunction) {
    if (!req.query.code)
        return next(400);

    const data = {
        grant_type: "authorization_code",
        code: req.query.code as string,
        redirect_uri: redirectURI,
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET
    };

    const accessTokenRequest: AccessTokenResponse = await fetch(API_ENDPOINT + "/oauth2/token", {
        body: new URLSearchParams(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    }).then(async (r) => {
        try {
            return await r.json();
        } catch (err: any) {
            next(err);
            return null;
        }
    }) as any;
    
    const user = new User(accessTokenRequest.access_token, accessTokenRequest.refresh_token, accessTokenRequest.expires_in);
    const userInfo = await getUserInfo(user);
    
    user.id = userInfo.id;
    user.name = userInfo.global_name;
    user.avatar = userInfo.avatar;

    user.guilds = (await getUserGuilds(user)).filter(g => botGuilds().includes(g.id));
    user.files = await FileModel.getFilesByUploader(user.id);

    // Create data folder
    if (!existsSync(`data/${user.id}`)) {
        mkdirSync(`data/${user.id}`);
        mkdirSync(`data/${user.id}/Soundboard`);
    }

    req.session.user = user;
    req.session.regenerate(() => {
        req.session.save();
    });

    logger.log("auth", "Token created for " + user.name + " ( " + user.id + " )");
    res.redirect("/");
}

export async function logout(req: Request, res: Response, next: NextFunction) {
    if (req.session.user == null)
        return next(401);

    const data = {
        token: req.session.user!.access_token,
        token_type_hint: "access_token",
        client_id: env.CLIENT_ID,
        client_secret: env.CLIENT_SECRET
    };

    await fetch(API_ENDPOINT + "/oauth2/token/revoke", {
        body: new URLSearchParams(data),
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        method: "POST"
    }).then(async (r) => {
        try {
            return await r.json();
        } catch (err: any) {
            next(err);
            return null;
        }
    });

    logger.log("auth", "Token revoked for " + req.session.user!.name + " ( " + req.session.user!.id + " )");
    req.session.destroy(() => {
        return res.redirect("/");
    });
}