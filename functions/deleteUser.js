const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

exports.deleteUser = async (req, res) => {
  return cors(req, res, async () => {
    try {
      const { uid } = req.body;

      if (!uid) {
        return res.status(400).json({
          success: false,
          error: "User ID is required",
        });
      }

      await admin.auth().deleteUser(uid);

      res.status(200).json({
        success: true,
        message: "User authentication deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({
        success: false,
        error: error.message || "Failed to delete user authentication",
      });
    }
  });
};
