import { Router } from "express";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController";

const router = Router();

router.post("/", createProject);
router.get("/", listProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.delete("/:id", deleteProject);

export default router;
