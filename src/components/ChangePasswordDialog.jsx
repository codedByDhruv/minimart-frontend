import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  Alert
} from "@mui/material";
import { useState } from "react";
import toast from "react-hot-toast";
import { changePassword } from "../services/authService";

const ChangePasswordDialog = ({ open, onClose, onSuccess }) => {

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {

    if (!oldPassword || !newPassword) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await changePassword({
        oldPassword,
        newPassword
      });

      toast.success(res.message);

      onSuccess();

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">

      <DialogTitle>Change Password</DialogTitle>

      <DialogContent>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TextField
          fullWidth
          label="Old Password"
          type="password"
          margin="normal"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <TextField
          fullWidth
          label="New Password"
          type="password"
          margin="normal"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{ bgcolor: "#111", textTransform: "none" }}
        >
          {loading ? <CircularProgress size={20} /> : "Update Password"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default ChangePasswordDialog;