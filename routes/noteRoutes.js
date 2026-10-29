const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  toggleArchive,
  deleteNote,
  restoreNote,
} = require("../controllers/noteController");


router.use(protect);

router.post("/", createNote);
router.get("/", getNotes);
router.get("/:id", getNoteById);
router.put("/:id", updateNote);
router.patch("/:id/archive", toggleArchive);
router.patch("/:id/restore", restoreNote);
router.delete("/:id", deleteNote);

module.exports = router;