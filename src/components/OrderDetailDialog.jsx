import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  Button,
  Divider
} from "@mui/material";

const OrderDetailDialog = ({ open, onClose, order }) => {

  const BASE_URL = import.meta.env.VITE_ECOM_BASE_URL;

  if (!order) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="md"
      PaperProps={{
        sx: { borderRadius: 3 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Order Details
      </DialogTitle>

      <DialogContent>

        {/* SHIPPING ADDRESS */}
        <Box mb={3}>
          <Typography fontWeight={700} mb={1}>
            Shipping Address
          </Typography>

          <Typography>{order.shippingAddress.fullName}</Typography>
          <Typography>{order.shippingAddress.street}</Typography>
          <Typography>
            {order.shippingAddress.city}, {order.shippingAddress.state}
          </Typography>
          <Typography>
            {order.shippingAddress.country} - {order.shippingAddress.postalCode}
          </Typography>
          <Typography>
            Phone: {order.shippingAddress.phone}
          </Typography>
        </Box>

        <Divider sx={{ my: 3 }} />

        {/* ORDER ITEMS */}
        <Typography fontWeight={700} mb={2}>
          Order Items
        </Typography>

        {order.orderItems.map((item) => (
          <Box
            key={item.product}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mb={2}
          >
            <Box display="flex" gap={2} alignItems="center">

              <img
                src={`${BASE_URL}/uploads/${item.image}`}
                alt={item.name}
                style={{
                  width: 70,
                  height: 70,
                  objectFit: "contain",
                  borderRadius: 8,
                  background: "#f5f5f5"
                }}
              />

              <Box>
                <Typography fontWeight={600}>
                  {item.name}
                </Typography>

                <Typography fontSize={14} color="text.secondary">
                  Qty: {item.quantity}
                </Typography>

                <Typography fontSize={14} color="text.secondary">
                  Price: ₹{item.price}
                </Typography>
              </Box>

            </Box>

            <Typography fontWeight={600}>
              ₹{item.price * item.quantity}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 3 }} />

        {/* ORDER SUMMARY */}
        <Typography fontWeight={700} mb={2}>
          Order Summary
        </Typography>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="text.secondary">
            Items Price
          </Typography>
          <Typography>
            ₹{order.itemsPrice}
          </Typography>
        </Box>

        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography color="text.secondary">
            Shipping
          </Typography>
          <Typography>
            ₹{order.shippingPrice}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight={700}>
            Total Amount
          </Typography>
          <Typography fontWeight={700}>
            ₹{order.totalPrice}
          </Typography>
        </Box>

      </DialogContent>

      <DialogActions>
        <Button
          onClick={onClose}
          sx={{
            color: "#111",
            textTransform: "none"
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default OrderDetailDialog;