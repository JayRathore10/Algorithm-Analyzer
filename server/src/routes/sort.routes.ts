import { Router } from "express";
import { sorting } from "../controllers/sort.controller";

const router = Router();

router.post("/:algo" , sorting);

export default router;