import { Request, Response, Router } from "express";

const router: Router = Router();

router.get('/', (req: Request, res: Response): void => {
    res.send('Hello World!');
});

router.get("/api", (req: Request, res: Response): void => {
    res.json({message: "Hello from the API!"});
});

export default router;