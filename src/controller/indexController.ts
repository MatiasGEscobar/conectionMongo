import { Request, Response } from "express";
import IndexService from "../services/indexService";

const indexService = new IndexService();

export default class IndexController {
    public getController = async (req: Request, res: Response): Promise<void> => {
        try {
            const services = await indexService.getService();
            res.status(200).json({message: "OK", data: services});
        } catch (error) {
            res.status(500).json({message: "Error al obtener la información"});
        }
    }
}