exports.getMe = async (req, res) => {
  try {
    const user = await req.user.populate({
      path: "notes",
      match: { deletedAt: null },
      options: { sort: { createdAt: -1 } },
    });

    res.status(200).json({
      success: true,
      notesCount: user.notes.length,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};