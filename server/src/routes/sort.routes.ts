import { Router } from "express";
import { bubbleSort } from "../controllers/sort.controller";

const router = Router();

router.post("/:algo" , bubbleSort);

export default router;