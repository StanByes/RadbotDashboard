import { NextFunction, Request, Response, Router } from "express";
import { copyFile, copyFileSync, existsSync, lstatSync, renameSync, rmSync } from "fs";
import createHttpError from "http-errors";
import multer from "multer";
import path from "path";
import audioExtensions from "audio-extensions/audioExtensions.json";
import { error, success } from "../utils/flash";
import { FileModel } from "../models/FileModel";
import File from "../classes/File";
import { getDirPath, getFilePath } from "../data";

const fileRouter = Router();

fileRouter.get("/:name", (req: Request, res: Response, next: NextFunction) => {
    const userId = req.session.user!.id!
    if (!existsSync(getDirPath(userId)))
        return next(createHttpError(500));

    const name = req.params.name;
    const filePath = getFilePath(userId, name);
    if (!existsSync(filePath) || !lstatSync(filePath).isFile())
        return next(createHttpError(404));

    return res.sendFile(path.resolve(__dirname, "..", filePath));
});

fileRouter.post("/", multer({ dest: "uploads/"}).single("file"), async (req: Request, res: Response, next: NextFunction) => {
    const returnURL = "/profile";
    if (!req.body.name || !req.file || req.body.name == "" || req.body.name == " ") {
        error(req, "Veuillez définir un nom et choisir un fichier");
        return res.redirect(returnURL);
    }
    const file = req.file;

    const fileSplitName = file.originalname.split(".");
    const extension = fileSplitName[fileSplitName.length - 1];

    if (!audioExtensions.includes(extension)) {
        error(req, "Veuillez choisir un fichier audio");
        return res.redirect(returnURL);
    }

    const name = req.body.name.replaceAll(" ", "_") + "." + extension;
    if (req.session.user!.files.find(f => f.name == name)) {
        error(req, "Vous avez déjà utilisé ce nom pour un fichier");
        return res.redirect(returnURL);
    }

    copyFile(file.path, getFilePath(req.session.user!.id, name), (err: any) => {
        if (err)
            throw err;

        rmSync(file.path);
    })

    const fileObj: File = {
        uploader_id: req.session.user!.id,
        constructor: {
            name: "RowDataPacket"
        },
        name: name,
        original_name: file.originalname,
        link_guilds: [],
        size: file.size,
        uploaded_at: new Date(),
        edited_at: new Date(),
        file_exist: true
    };
    
    if (!await FileModel.insertFile(fileObj))
        return next(createHttpError(500));

    req.session.user!.files.push(fileObj);

    success(req, "Fichier ajouté avec succès");
    return res.redirect(returnURL);
});

fileRouter.post("/:name", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user)
        return next(createHttpError(500));

    const user = req.session.user;

    const returnURL = "/profile";
    if (!req.body.name || req.body.name == "" || req.body.name == " ") {
        error(req, "Veuillez définir un nouveau nom");
        return res.redirect(returnURL);
    }

    const oldName = req.params.name;
    const file = user.files.find(f => f.name == oldName);
    if (!file)
        return next(createHttpError(404));

    const fileSplitName = oldName.split(".");
    const extension = fileSplitName[fileSplitName.length - 1];

    const newName = req.body.name + "." + extension;
    if (!await FileModel.renameFile(file, newName))
        return next(createHttpError(500));

    renameSync(getFilePath(user.id, oldName), getFilePath(user.id, newName));
    file.name = newName;
    file.edited_at = new Date();

    success(req, "Fichier renommé avec succès");
    return res.redirect(returnURL);
})

fileRouter.get("/delete/:name", async (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.user)
        return next(createHttpError(500));

    const user = req.session.user;
    const name = req.params.name;

    const file = user.files.find(f => f.name == name);
    if (!file)
        return next(createHttpError(404));
    
    if (!await FileModel.deleteFile(file))
        return next(createHttpError(500));

    if (file.file_exist)
        rmSync(getFilePath(user.id!, name));

    user.files.splice(user.files.indexOf(file), 1);
    
    success(req, "Fichier supprimé avec succès");
    return res.redirect("/profile");
})

export default fileRouter;