import { Request, Response, Router } from "express";
import IndexController from "../controller/indexController";

const router: Router = Router();

const indexController = new IndexController();

router.get('/', indexController.getController);


export default router;