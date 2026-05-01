import { Router } from "express";
import { searching } from "../controllers/searching.controller";

const router = Router();

router.post("/:algo" , searching);