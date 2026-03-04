import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Link,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../services/authService";
import Logo from "../../assets/images/Logo.png";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle register
  const handleRegister = async () => {
    const { name, email, password, phone } = form;
    if (!name || !email || !password || !phone) {
      setError("All fields are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      await register(form);

      // ✅ redirect after success
      navigate("/");
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  // Submit on Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f3f4f6",
        px: { xs: 2, sm: 3 },
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          maxWidth: 420,
          borderRadius: 4,
          border: "1px solid #e5e7eb",
          backgroundColor: "#ffffff",
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          {/* Logo */}
          <Box display="flex" justifyContent="center" mb={2}>
            <img
              src={Logo}
              alt="Minimart Logo"
              style={{ width: 60, maxWidth: "100%" }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h5"
            fontWeight={700}
            textAlign="center"
            gutterBottom
          >
            Create Account
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            mb={3}
          >
            Join Minimart and start shopping today
          </Typography>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Name */}
          <TextField
            fullWidth
            label="Full Name"
            name="name"
            margin="normal"
            value={form.name}
            disabled={loading}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />

          {/* Email */}
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            margin="normal"
            value={form.email}
            disabled={loading}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />

          {/* Phone */}
          <TextField
            fullWidth
            label="Phone Number"
            name="phone"
            margin="normal"
            value={form.phone}
            disabled={loading}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />

          {/* Password */}
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            margin="normal"
            value={form.password}
            disabled={loading}
            onChange={handleChange}
            onKeyDown={handleKeyPress}
          />

          {/* Register Button */}
          <Button
            fullWidth
            variant="contained"
            size="large"
            onClick={handleRegister}
            disabled={
              !form.name || !form.email || !form.password || !form.phone || loading
            }
            sx={{
              mt: 3,
              py: 1.4,
              borderRadius: 50,
              fontWeight: 600,
              textTransform: "none",
              bgcolor: "#111",
              "&:hover": { bgcolor: "#000" },
            }}
          >
            {loading ? (
              <CircularProgress size={22} sx={{ color: "#fff" }} />
            ) : (
              "Create Account"
            )}
          </Button>

          {/* Links */}
          <Box textAlign="center" mt={3}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Link component="button" onClick={() => navigate("/login")}>
                Login
              </Link>
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Register;