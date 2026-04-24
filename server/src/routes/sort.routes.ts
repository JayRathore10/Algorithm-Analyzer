import { Router } from "express";
import { bubbleSort } from "../controllers/sort.controller";

const router = Router();

router.post("/bubble-sort" , bubbleSort);

export default router;