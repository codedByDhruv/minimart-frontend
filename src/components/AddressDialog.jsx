import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid
} from "@mui/material";

import { useState, useEffect } from "react";

const AddressDialog = ({ open, onClose, onSave, editData }) => {

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: ""
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
      setForm({
        fullName: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: ""
      });
    }

    setErrors({});
  }, [editData, open]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });

    setErrors({
      ...errors,
      [e.target.name]: ""
    });
  };

  const validate = () => {
    let temp = {};

    if (!form.fullName.trim())
      temp.fullName = "Full name is required";

    if (!form.phone)
      temp.phone = "Phone is required";
    else if (!/^[0-9]{10}$/.test(form.phone))
      temp.phone = "Phone must be 10 digits";

    if (!form.street.trim())
      temp.street = "Street address required";

    if (!form.city.trim())
      temp.city = "City required";

    if (!form.state.trim())
      temp.state = "State required";

    if (!form.postalCode)
      temp.postalCode = "Postal code required";
    else if (!/^[0-9]{6}$/.test(form.postalCode))
      temp.postalCode = "Postal code must be 6 digits";

    if (!form.country.trim())
      temp.country = "Country required";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    onSave(form);
  };

  const inputStyle = {
    "& .MuiOutlinedInput-root": {
      borderRadius: 2,
      "&.Mui-focused fieldset": {
        borderColor: "#111"
      }
    },
    "& .MuiInputLabel-root.Mui-focused": {
      color: "#111"
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: { borderRadius: 4 }
      }}
    >
      <DialogTitle sx={{ fontWeight: 600 }}>
        {editData ? "Update Address" : "Add Address"}
      </DialogTitle>

      <DialogContent>

        <Grid container spacing={2} mt={1}>

          <Grid item xs={12}>
            <TextField
              label="Full Name"
              name="fullName"
              fullWidth
              value={form.fullName}
              onChange={handleChange}
              error={!!errors.fullName}
              helperText={errors.fullName}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Phone"
              name="phone"
              fullWidth
              value={form.phone}
              onChange={handleChange}
              error={!!errors.phone}
              helperText={errors.phone}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={12}>
            <TextField
              label="Street"
              name="street"
              fullWidth
              value={form.street}
              onChange={handleChange}
              error={!!errors.street}
              helperText={errors.street}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="City"
              name="city"
              fullWidth
              value={form.city}
              onChange={handleChange}
              error={!!errors.city}
              helperText={errors.city}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="State"
              name="state"
              fullWidth
              value={form.state}
              onChange={handleChange}
              error={!!errors.state}
              helperText={errors.state}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Postal Code"
              name="postalCode"
              fullWidth
              value={form.postalCode}
              onChange={handleChange}
              error={!!errors.postalCode}
              helperText={errors.postalCode}
              sx={inputStyle}
            />
          </Grid>

          <Grid item xs={6}>
            <TextField
              label="Country"
              name="country"
              fullWidth
              value={form.country}
              onChange={handleChange}
              error={!!errors.country}
              helperText={errors.country}
              sx={inputStyle}
            />
          </Grid>

        </Grid>

      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>

        <Button
          onClick={onClose}
          sx={{
            color: "#111",
            textTransform: "none"
          }}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            bgcolor: "#111",
            textTransform: "none",
            borderRadius: 2,
            "&:hover": {
              bgcolor: "#000"
            }
          }}
        >
          Save Address
        </Button>

      </DialogActions>
    </Dialog>
  );
};

export default AddressDialog;