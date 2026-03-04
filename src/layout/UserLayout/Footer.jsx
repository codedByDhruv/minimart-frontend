import { Box, Typography, IconButton, Divider } from "@mui/material";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import TwitterIcon from "@mui/icons-material/Twitter";
import Logo from "../../assets/images/Logo.png";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#111",
        color: "#fff",
        mt: 6,
      }}
    >
      {/* Top Section */}
      <Box
        sx={{
          maxWidth: 1200,
          mx: "auto",
          px: 3,
          py: 5,
          textAlign: "center",
        }}
      >
        {/* Brand */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          gap={1}
          mb={1}
        >
          <img src={Logo} alt="Minimart" style={{ width: 36, borderRadius: "10%" }} />
          <Typography variant="h6" fontWeight={700}>
            Minimart
          </Typography>
        </Box>

        {/* Description */}
        <Typography
          variant="body2"
          sx={{ color: "#ccc", maxWidth: 500, mx: "auto" }}
        >
          Your one-stop shop for quality products at the best prices.
          Fast delivery, secure payments, and a seamless shopping experience.
        </Typography>

        {/* Social Icons */}
        <Box mt={3}>
          <IconButton sx={{ color: "#fff", "&:hover": { bgcolor: "#222" } }}>
            <FacebookIcon />
          </IconButton>
          <IconButton sx={{ color: "#fff", "&:hover": { bgcolor: "#222" } }}>
            <InstagramIcon />
          </IconButton>
          <IconButton sx={{ color: "#fff", "&:hover": { bgcolor: "#222" } }}>
            <TwitterIcon />
          </IconButton>
        </Box>

        {/* Contact */}
        <Typography variant="body2" sx={{ color: "#ccc", mt: 2 }}>
          support@minimart.com
        </Typography>
      </Box>

      <Divider sx={{ borderColor: "#333" }} />

      {/* Bottom */}
      <Box sx={{ textAlign: "center", py: 2 }}>
        <Typography variant="body2" sx={{ color: "#aaa" }}>
          © {new Date().getFullYear()} Minimart. All rights reserved.
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;