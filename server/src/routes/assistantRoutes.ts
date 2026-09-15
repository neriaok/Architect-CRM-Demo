import { Router } from "express";
import { ask } from "../controllers/assistantController";

const router = Router();

router.post("/ask", ask);

export default router;
