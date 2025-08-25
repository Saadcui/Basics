import express from "express";
import Password from "../../models/Password.js";

const router = express.Router();

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Password.findByIdAndDelete(id);
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
