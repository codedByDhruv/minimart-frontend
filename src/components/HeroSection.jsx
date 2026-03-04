import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* ================= HERO ================= */}
      <Box
        sx={{
          minHeight: { xs: 420, md: 520 },
          bgcolor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: 2,
        }}
      >
        <Box>
          <Typography variant="h3" fontWeight={700} gutterBottom>
            Shop Smart with Minimart
          </Typography>
          <Typography variant="h6" color="text.secondary" mb={3}>
            Discover amazing products at unbeatable prices.
          </Typography>

          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: "#111",
              px: 5,
              py: 1.5,
              borderRadius: 50,
              textTransform: "none",
              "&:hover": { bgcolor: "#000" },
            }}
            onClick={() => navigate("/products")}
          >
            Shop Now
          </Button>
        </Box>
      </Box>
    </div>
  )
}

export default HeroSection
