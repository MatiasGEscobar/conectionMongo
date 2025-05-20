import { Application } from "express";
import router from "./startRoutes";
import express from "express";

export const setUpRoutes = (app: Application): void => {                //FUNCIONALIDAD QUE PERMITE AGRUPAR TODAS LAS RUTAS
    app.use(express.json())
    app.use("/", router);
}                                       