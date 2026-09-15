import { Router } from "express";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";
import { createInteraction, listInteractions } from "../controllers/interactionController";

const router = Router();

router.post("/", createProject);
router.get("/", listProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

router.post("/:id/interactions", createInteraction);
router.get("/:id/interactions", listInteractions);

export default router;
