import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";

import { error, success } from "../utils/flash";
import { FileModel } from "../models/FileModel";

const guildRouter = Router();

guildRouter.get("/:guildId", (req: Request, res: Response, next: NextFunction) => {
    if (req.params.guildId == null)
        return next(createHttpError(400));

    let guild = null;
    const guildId = req.params.guildId;
    if (req.session.user!.guilds.find(g => g.id == guildId))
        guild = {
            id: guildId
        };

    return res.render("guild", { guild: guild });
});

guildRouter.post("/:guildId/link", async (req: Request, res: Response, next: NextFunction) => {
    const guildId = req.params.guildId;
    if (!req.session.user!.guilds.find(g => g.id == guildId))
        return next(createHttpError(403));

    const returnURL = "/guilds/" + guildId;
    if (!req.body.filename || req.body.filename == "" || req.body.filename == " ") {
        error(req, "Veuillez choisir un fichier");
        return res.redirect(returnURL);
    }

    const file = req.session.user!.files.find(f => f.name == req.body.filename);
    if (!file) {
        error(req, "Erreur Interne : Fichier introuvable");
        return res.redirect(returnURL);
    }

    if (file.link_guilds.includes(guildId))
        return next(createHttpError(409));

    file.link_guilds.push(guildId);
    file.edited_at = new Date();
    FileModel.editLinkGuilds(file);

    success(req, "Fichier relié avec succès");
    return res.redirect(returnURL);
});

guildRouter.get("/:guildId/unlink/:name", async (req: Request, res: Response, next: NextFunction) => {
    const guildId = req.params.guildId;
    if (!req.session.user!.guilds.find(g => g.id == guildId))
        return next(createHttpError(403));

    const returnURL = "/guilds/" + guildId;
    const file = req.session.user!.files.find(f => f.name == req.params.name);
    if (!file) {
        error(req, "Erreur Interne : Fichier introuvable");
        return res.redirect(returnURL);
    }

    if (!file.link_guilds.includes(guildId))
        return next(createHttpError(404));

    file.link_guilds.splice(file.link_guilds.indexOf(guildId), 1);
    file.edited_at = new Date();
    FileModel.editLinkGuilds(file);

    success(req, "Fichier relié avec succès");
    return res.redirect(returnURL);
});

export default guildRouter;