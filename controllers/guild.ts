import { NextFunction, Request, Response, Router } from "express";
import createHttpError from "http-errors";
import multer from "multer";
import audioExtensions from "audio-extensions/audioExtensions.json";
import { renameSync }from "fs";

import { getFileByGuild, guildsID } from "../data";
import { error, success } from "../utils/flash";

const guildRouter = Router();

guildRouter.get("/:guildId", (req: Request, res: Response, next: NextFunction) => {
    if (req.params.guildId == null)
        return next(createHttpError(400));

    let guild = null;
    const guildId = req.params.guildId;
    if (guildsID().includes(guildId)) {
        guild = {
            id: guildId,
            files: getFileByGuild(guildId)
        };
    }

    return res.render("guild", { guild: guild });
});

guildRouter.post("/:guildId/upload", multer({ dest: "uploads/"}).single("file"), (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.name || !req.file || req.body.name == "" || req.body.name == " ") {
        error(req, "Veuillez définir un nom et choisir un fichier");
        return res.redirect("/guilds/" + req.params.guildId);
    }
    const file = req.file;

    const fileSplitName = file.originalname.split(".");
    const extension = fileSplitName[fileSplitName.length - 1];

    if (!audioExtensions.includes(extension)) {
        error(req, "Veuillez choisir un fichier audio");
        return res.redirect("/guilds/" + req.params.guildId);
    }

    renameSync(file.path, `data/${req.params.guildId}/Soundboard/${req.body.name.replaceAll(" ", "_")}.${extension}`);
    success(req, "Fichier ajouté avec succès");
    return res.redirect("/guilds/" + req.params.guildId);
})

export default guildRouter;