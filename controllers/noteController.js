const mongoose = require("mongoose");
const Note = require("../models/Note");

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const handleError = (error, res) => {
  if (error.name === "ValidationError") {
    const messages = Object.values(error.errors).map((e) => e.message);
    return res.status(400).json({ success: false, message: messages });
  }
  if (error.name === "CastError") {
    return res
      .status(400)
      .json({ success: false, message: "Invalid data type provided" });
  }
  res.status(500).json({ success: false, message: "Server error" });
};

// Owner check: Does the note belong to this same user (and is it not deleted)?
const findOwnNote = (id, userId, includeDeleted = false) => {
  const query = { _id: id, user: userId };
  if (!includeDeleted) query.deletedAt = null;
  return Note.findOne(query);
};

// CREATE
exports.createNote = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const note = await Note.create({
      title,
      content,
      category,
      user: req.user._id,
    });
    res.status(201).json({
      success: true,
      message: "Note created successfully",
      data: note,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// LIST my notes
// ?archived=true  -> archive 
// ?deleted=true   -> soft-delete (trash)
exports.getNotes = async (req, res) => {
  try {
    const { archived, deleted, category } = req.query;

    const filter = { user: req.user._id };
    filter.deletedAt = deleted === "true" ? { $ne: null } : null;
    if (deleted !== "true") filter.isArchived = archived === "true";
    if (category) filter.category = String(category).toLowerCase();

    const notes = await Note.find(filter).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: notes.length,
      data: notes,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// GET one
exports.getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    const note = await findOwnNote(id, req.user._id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    // populate: include the user's details along with the note
    await note.populate("user", "username email");

    res.status(200).json({ success: true, data: note });
  } catch (error) {
    handleError(error, res);
  }
};

// UPDATE
exports.updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    const note = await findOwnNote(id, req.user._id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    const { title, content, category } = req.body;
    if (title !== undefined) note.title = title;
    if (content !== undefined) note.content = content;
    if (category !== undefined) note.category = category;

    await note.save();

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      data: note,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// ARCHIVE / UNARCHIVE (toggle)
exports.toggleArchive = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    const note = await findOwnNote(id, req.user._id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.isArchived = !note.isArchived;
    await note.save();

    res.status(200).json({
      success: true,
      message: note.isArchived ? "Note archived" : "Note unarchived",
      data: note,
    });
  } catch (error) {
    handleError(error, res);
  }
};

// SOFT DELETE
exports.deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    const note = await findOwnNote(id, req.user._id);
    if (!note) {
      return res.status(404).json({ success: false, message: "Note not found" });
    }

    note.deletedAt = new Date();
    await note.save();

    res.status(200).json({
      success: true,
      message: "Note moved to trash (soft-deleted)",
    });
  } catch (error) {
    handleError(error, res);
  }
};

// RESTORE
exports.restoreNote = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isValidId(id)) {
      return res.status(400).json({ success: false, message: "Invalid note ID" });
    }

    const note = await findOwnNote(id, req.user._id, true);
    if (!note || !note.deletedAt) {
      return res
        .status(404)
        .json({ success: false, message: "Deleted note not found" });
    }

    note.deletedAt = null;
    await note.save();

    res.status(200).json({
      success: true,
      message: "Note restored successfully",
      data: note,
    });
  } catch (error) {
    handleError(error, res);
  }
};