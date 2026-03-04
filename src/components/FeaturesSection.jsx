import React from 'react'
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import ReplayOutlinedIcon from "@mui/icons-material/ReplayOutlined";
import { Box, Card, Grid, Typography } from '@mui/material';

const FeaturesSection = () => {
  return (
    <div>
      
      {/* ================= FEATURES ================= */}
      <Box sx={{ py: 8, px: 2, maxWidth: 1200, mx: "auto" }}>
        <Grid container
          spacing={4}
          maxWidth={1100}
          mx="auto"
          justifyContent="center">
          {[
            {
              icon: <LocalShippingOutlinedIcon fontSize="large" />,
              title: "Free Delivery",
              desc: "On orders above ₹499",
            },
            {
              icon: <SecurityOutlinedIcon fontSize="large" />,
              title: "Secure Payment",
              desc: "100% protected payments",
            },
            {
              icon: <ReplayOutlinedIcon fontSize="large" />,
              title: "Easy Returns",
              desc: "7-day return policy",
            },
          ].map((item) => (
            <Grid item xs={12} md={4} key={item.title}>
              <Card
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 4,
                  textAlign: "center",
                  bgcolor: "#fafafa",
                  transition: "0.3s",
                  "&:hover": {
                    boxShadow: 6,
                    transform: "translateY(-6px)",
                  },
                }}
              >
                <Box color="#111" mb={2}>
                  {item.icon}
                </Box>
                <Typography fontWeight={600}>{item.title}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.desc}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </div>
  )
}

export default FeaturesSection
