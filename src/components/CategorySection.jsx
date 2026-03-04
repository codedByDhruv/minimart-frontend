import React from 'react'
import { Box, Card, Grid, Typography } from '@mui/material'
import CheckroomOutlinedIcon from "@mui/icons-material/CheckroomOutlined";
import DevicesOutlinedIcon from "@mui/icons-material/DevicesOutlined";
import FitnessCenterOutlinedIcon from "@mui/icons-material/FitnessCenterOutlined";
import KitchenOutlinedIcon from "@mui/icons-material/KitchenOutlined";

const CategorySection = () => {
  return (
    <div>
      {/* ================= STATIC CATEGORIES ================= */}
      <Box sx={{ py: 10, bgcolor: "#f9f9f9", px: 2 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={6}>
          Shop by Category
        </Typography>

        <Grid
          container
          spacing={4}
          maxWidth={1100}
          mx="auto"
          justifyContent="center"
        >
          {[
            {
              title: "Clothing",
              icon: <CheckroomOutlinedIcon fontSize="large" />,
            },
            {
              title: "Electronics",
              icon: <DevicesOutlinedIcon fontSize="large" />,
            },
            {
              title: "Fitness",
              icon: <FitnessCenterOutlinedIcon fontSize="large" />,
            },
            {
              title: "Home Appliances",
              icon: <KitchenOutlinedIcon fontSize="large" />,
            },
          ].map((cat) => (
            <Grid item xs={12} sm={6} md={3} key={cat.title}>
              <Card
                sx={{
                  p: 4,
                  borderRadius: 4,
                  textAlign: "center",
                  transition: "0.3s",
                  cursor: "pointer",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box color="#111" mb={2}>
                  {cat.icon}
                </Box>
                <Typography fontWeight={600}>{cat.title}</Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default CategorySection
