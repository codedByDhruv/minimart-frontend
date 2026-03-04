import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider
} from "@mui/material";

import { useEffect, useState } from "react";
import { getProfile } from "../services/user/profileService";
import { placeOrder } from "../services/user/orderService";
import toast from "react-hot-toast";

const OrderDialog = ({ open, onClose, cart, total, refreshCart }) => {

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) fetchAddresses();
  }, [open]);

  const fetchAddresses = async () => {
    try {
      const res = await getProfile();

      setAddresses(res.data.addresses);

      const defaultAddr = res.data.addresses.find(a => a.isDefault);

      if (defaultAddr) setSelectedAddress(defaultAddr._id);

    } catch {
      toast.error("Failed to load addresses");
    }
  };

  const handleOrder = async () => {

    if (!selectedAddress) {
      toast.error("Please select address");
      return;
    }

    try {
      setLoading(true);

      await placeOrder(selectedAddress);

      toast.success("Order placed successfully 🎉");

      refreshCart();
      onClose();

    } catch (err) {
      toast.error(err?.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">

      <DialogTitle>Order Summary</DialogTitle>

      <DialogContent>

        {/* CART SUMMARY */}
        <Typography fontWeight={600} mb={2}>
          Items
        </Typography>

        {cart?.items?.map((item) => (
          <Box
            key={item.product._id}
            display="flex"
            justifyContent="space-between"
            mb={1}
          >
            <Typography>
              {item.product.name} × {item.quantity}
            </Typography>

            <Typography>
              ₹{item.product.price * item.quantity}
            </Typography>
          </Box>
        ))}

        <Divider sx={{ my: 2 }} />

        <Typography fontWeight={700}>
          Total: ₹{total}
        </Typography>

        <Divider sx={{ my: 3 }} />

        {/* ADDRESS SECTION */}
        <Typography fontWeight={600} mb={1}>
          Select Address
        </Typography>

        <RadioGroup
          value={selectedAddress}
          onChange={(e) => setSelectedAddress(e.target.value)}
        >

          {addresses.map((addr) => (
            <FormControlLabel
              key={addr._id}
              value={addr._id}
              control={<Radio />}
              label={
                <Box>
                  <Typography fontWeight={600}>
                    {addr.fullName}
                  </Typography>

                  <Typography fontSize={14}>
                    {addr.street}, {addr.city}
                  </Typography>

                  <Typography fontSize={14}>
                    {addr.state} - {addr.postalCode}
                  </Typography>

                  <Typography fontSize={14}>
                    {addr.phone}
                  </Typography>
                </Box>
              }
            />
          ))}

        </RadioGroup>

        <Divider sx={{ my: 3 }} />

        {/* PAYMENT */}
        <Typography fontWeight={600}>
          Payment Method
        </Typography>

        <Typography color="text.secondary">
          Cash On Delivery (COD)
        </Typography>

      </DialogContent>

      <DialogActions>

        <Button onClick={onClose}>
          Cancel
        </Button>

        <Button
          variant="contained"
          sx={{ bgcolor: "#111" }}
          onClick={handleOrder}
          disabled={loading}
        >
          Confirm Order
        </Button>

      </DialogActions>

    </Dialog>
  );
};

export default OrderDialog;