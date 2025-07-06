import Animal from "../../models/Animal.js";
import User from "../../models/User.js";
import Comment from "../../models/Comment.js";
import { sendEmail } from "../../utils/emailService.js";

export const getAllAnimals = async (req, res) => {
  try {
    const animals = await Animal.find()
      .populate("owner", "username email")
      .populate("species", "name");

    res.json(animals);
  } catch (err) {
    res.status(500).json({ message: "Error fetching animals." });
  }
};

export const deleteAnimalWithReason = async (req, res) => {
  try {
    const { reason } = req.body;
    const animal = await Animal.findById(req.params.id).populate("owner");

    if (!animal) return res.status(404).json({ message: "Animal not found." });

    await animal.deleteOne();

    await sendEmail({
      to: animal.owner.email,
      subject: "Your animal listing has been removed",
      text: `Dear ${animal.owner.username},

Your animal "${animal.name}" has been removed by an administrator.

Reason: ${reason}

If you have questions, contact support.`
    });

    res.json({ message: "Animal deleted and user notified." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting animal." });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate("user", "username email");
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching comments." });
  }
};

export const deleteCommentWithReason = async (req, res) => {
  try {
    const { reason } = req.body;
    const comment = await Comment.findById(req.params.id).populate("user");

    if (!comment) return res.status(404).json({ message: "Comment not found." });

    await comment.deleteOne();

    await sendEmail({
      to: comment.user.email,
      subject: "Your comment has been removed",
      text: `Dear ${comment.user.username},

Your comment was removed by an administrator.

Reason: ${reason}

If you have questions, contact support.`
    });

    res.json({ message: "Comment deleted and user notified." });
  } catch (err) {
    res.status(500).json({ message: "Error deleting comment." });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("username email role isBanned");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users." });
  }
};

export const deleteUserWithReason = async (req, res) => {
  try {
    const { reason } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    if (user.role === "owner") {
      const animals = await Animal.find({ owner: user._id });

     
      for (const animal of animals) {
        await animal.deleteOne();
      }
    }

    
    await user.deleteOne();

    await sendEmail({
      to: user.email,
      subject: "Account Deleted",
      text: `Dear ${user.username},

Your account has been deleted by an administrator.

Reason: ${reason}

${user.role === "owner" ? "All your animal listings have also been removed." : ""}

If you have questions, contact support.`
    });

    res.json({ message: `User deleted and user notified.${user.role === "owner" ? " All animals deleted." : ""}` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting user." });
  }
};