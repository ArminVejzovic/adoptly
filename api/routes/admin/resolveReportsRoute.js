import express from "express";
import {
  getAllAnimals,
  deleteAnimalWithReason,
  getAllComments,
  deleteCommentWithReason,
  getAllUsers,
  deleteUserWithReason
} from "../../controllers/admin/ResolveReportsController.js";

const router = express.Router();

router.get("/animals", getAllAnimals);
router.delete("/animals/:id", deleteAnimalWithReason);

router.get("/comments", getAllComments);
router.delete("/comments/:id", deleteCommentWithReason);

router.get("/users", getAllUsers);
router.delete("/users/:id", deleteUserWithReason);

export default router;
