import { Router } from "express";
import clientRoutes from "./clientRoutes";
import projectRoutes from "./projectRoutes";

const router = Router();

router.use("/clients", clientRoutes);
router.use("/projects", projectRoutes);

export default router;
