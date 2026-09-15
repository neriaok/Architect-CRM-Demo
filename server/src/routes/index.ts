import { Router } from "express";
import clientRoutes from "./clientRoutes";
import projectRoutes from "./projectRoutes";
import assistantRoutes from "./assistantRoutes";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);
router.use("/assistant", assistantRoutes);

export default router;
