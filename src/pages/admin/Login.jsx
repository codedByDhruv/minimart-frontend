import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login ,saveSession } from "../../services/authService";
import Logo from "../../assets/images/Logo.png"; // ✅ Logo import

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return;

    try {
      setLoading(true);

      const { token, user } = await login(email, password);

      // ❌ Block normal users
      if (user.role !== "admin") {
        alert("Access denied. Admins only.");
        return;
      }

      // ✅ Save session
      saveSession(token, user);

      navigate("/admin");
    } catch (error) {
      alert(error);
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
        bgcolor: "#f9fafb",
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: 380,
          borderRadius: 3,
          border: "1px solid #e5e7eb",
        }}
      >
        <CardContent sx={{ p: 4 }}>
          {/* ✅ Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src={Logo}
              alt="Minimart Logo"
              style={{ width: 70, height: "auto" }}
            />
          </Box>

          {/* Title */}
          <Typography variant="h5" fontWeight={700} textAlign="center">
            Minimart Admin
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Sign in to access the dashboard
          </Typography>

          {/* Email */}
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            margin="normal"
            value={email}
            disabled={loading}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            disabled={loading}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Login Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleLogin}
            disabled={!email || !password || loading}
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 2,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#111",
              "&:hover": { bgcolor: "#000" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Login"
            )}
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Login;