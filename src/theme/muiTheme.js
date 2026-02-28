import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: {
        main: "#4f46e5", // Indigo (modern SaaS color)
      },
      background: {
        default: mode === "dark" ? "#0f172a" : "#f5f7fb",
        paper: mode === "dark" ? "#020617" : "#ffffff",
      },
    },
    typography: {
      fontFamily: "Poppins, sans-serif",
    },
    shape: {
      borderRadius: 12,
    },
  });
