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
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { forgotPassword } from "../../services/authService";
import Logo from "../../assets/images/Logo.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!email) {
      setError("Email is required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await forgotPassword(email);

      toast.success(res.message);

      // redirect to login
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
      <Card
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent sx={{ p: 5 }}>
          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img src={Logo} alt="Logo" style={{ width: 60 }} />
          </Box>

          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Forgot Password
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Enter your email to receive a reset link
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <TextField
            fullWidth
            label="Email Address"
            margin="normal"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleSubmit}
            disabled={!email || loading}
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
              "Send Reset Link"
            )}
          </Button>

          <Box textAlign="center" mt={3}>
            <Button sx={{
              p: 1.4,
              borderRadius: 50,
              bgcolor: "#111",
              textTransform: "none",
              "&:hover": { bgcolor: "#000" },
              color: "#fff"
            }} onClick={() => navigate("/login")}>Back to Login</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgotPassword;