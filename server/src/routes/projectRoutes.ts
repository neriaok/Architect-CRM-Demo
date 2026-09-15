import { Router } from "express";
import {
  createProject,
  listProjects,
  getProject,
  updateProject,
  updateProjectStage,
  deleteProject,
} from "../controllers/projectController";
import { createInteraction, listInteractions } from "../controllers/interactionController";
import { createContact, listContacts } from "../controllers/contactController";

const router = Router();

router.post("/", createProject);
router.get("/", listProjects);
router.get("/:id", getProject);
router.put("/:id", updateProject);
router.patch("/:id/stage", updateProjectStage);
router.delete("/:id", deleteProject);

router.post("/:id/interactions", createInteraction);
router.get("/:id/interactions", listInteractions);

router.post("/:id/contacts", createContact);
router.get("/:id/contacts", listContacts);

export default router;
