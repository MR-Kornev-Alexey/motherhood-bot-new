import {Request, Response} from "express";
import prisma from "../config/db.config.js";
import UsersController from "./UsersController.js";

class DataController {
    static async getAllWebinars(req: Request, res: Response) {
        try {
            console.log("get===")
            const groups = await prisma.links.findMany({
            });
            return res.json({data: groups});
        } catch (error) {
            return res
                .status(500)
                .json({message: "Something went wrong.please try again!"});
        }
    }
}

export default DataController;
