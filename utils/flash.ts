import { Request } from "express";

export function success(req: Request, message: string) {
    set(req, false, message);
}

export function error(req: Request, message: string) {
    set(req, true, message);
}

function set(req: Request, error: boolean, message: string) {
    req.session.flash = {
        error,
        message
    }
}