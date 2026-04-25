import { Router } from "express";
import { graphAlgo } from "../controllers/graph.controller";

const router = Router();

router.post("/:algo" , graphAlgo );

export default router;