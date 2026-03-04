import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../services/authService";
import Logo from "../../assets/images/Logo.png";

const ResetPassword = () => {
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await resetPassword(token, password);

      toast.success(res.message);

      navigate("/login");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f3f4f6",
        px: 2,
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 420, borderRadius: 4 }}>
        <CardContent sx={{ p: 5 }}>
          <Box display="flex" justifyContent="center" mb={2}>
            <img src={Logo} alt="Logo" style={{ width: 60 }} />
          </Box>

          <Typography variant="h5" fontWeight={700} textAlign="center">
            Reset Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Enter your new password
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="New Password"
            type="password"
            margin="normal"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />

          <TextField
            fullWidth
            label="Confirm Password"
            type="password"
            margin="normal"
            value={confirmPassword}
            disabled={loading}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleReset}
            disabled={!password || !confirmPassword || loading}
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: 50,
              bgcolor: "#111",
              textTransform: "none",
              "&:hover": { bgcolor: "#000" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Reset Password"
            )}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;