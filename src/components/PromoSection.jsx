import { Box, Button, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom';

const PromoSection = () => {
  const navigate = useNavigate();
  
  return (
    <div>
    {/* ================= PROMO ================= */}
      <Box
        sx={{
          py: 10,
          textAlign: "center",
          bgcolor: "#111",
          color: "#fff",
          px: 2,
        }}
      >
        <Typography variant="h4" fontWeight={700} gutterBottom>
          Big Summer Sale
        </Typography>
        <Typography mb={3}>
          Up to 50% off on selected items.
        </Typography>

        <Button
          variant="contained"
          sx={{
            bgcolor: "#fff",
            color: "#111",
            px: 5,
            borderRadius: 50,
            "&:hover": { bgcolor: "#eee" },
          }}
          onClick={() => navigate("/products")}
        >
          Explore Deals
        </Button>
      </Box>
    </div>
  )
}

export default PromoSection
