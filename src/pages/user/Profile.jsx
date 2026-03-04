import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  CircularProgress,
  IconButton,
  Chip
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import StarIcon from "@mui/icons-material/Star";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import AddressDialog from "../../components/AddressDialog";

import {
  getProfile,
  updateProfile,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress
} from "../../services/user/profileService";
import ChangePasswordDialog from "../../components/ChangePasswordDialog";
import { clearSession } from "../../services/authService";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [pwdDialog, setPwdDialog] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: ""
  });

  const fetchProfile = async () => {
    try {
      const res = await getProfile();

      setProfile(res.data);

      setForm({
        name: res.data.name,
        email: res.data.email,
        phone: res.data.phone
      });

    } catch (err) {
      toast.error("Failed to fetch profile");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

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

    if (!form.name.trim()) {
        temp.name = "Full name is required";
    }

    if (!form.phone) {
        temp.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(form.phone)) {
        temp.phone = "Phone number must be 10 digits";
    }

    setErrors(temp);

    return Object.keys(temp).length === 0;
    };

    const handleUpdate = async () => {

        if (!validate()) return;

        try {
            await updateProfile(form);
            toast.success("Profile updated");
            fetchProfile();
        } catch (err) {
            toast.error(err?.response?.data?.message);
        }
    };

  const handleAddAddress = async (data) => {
    try {
      await addAddress(data);
      toast.success("Address added");
      setDialogOpen(false);
      fetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleUpdateAddress = async (data) => {
    try {
      await updateAddress(editAddress._id, data);
      toast.success("Address updated");
      setDialogOpen(false);
      setEditAddress(null);
      fetchProfile();
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const handleDelete = async (id) => {
    await deleteAddress(id);
    toast.success("Address deleted");
    fetchProfile();
  };

  const handleDefault = async (id) => {
    await setDefaultAddress(id);
    toast.success("Default address updated");
    fetchProfile();
  };

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ py: 10, px: 2 }}>
      <Box maxWidth={1100} mx="auto">

        <Typography variant="h4" fontWeight={700} mb={5}>
          My Profile
        </Typography>

        {/* PROFILE INFO */}
        <Card sx={{ borderRadius: 4, mb: 6 }}>
          <CardContent>

            <Typography variant="h6" mb={3}>
              Personal Info
              <Button
                variant="outlined"
                sx={{ mt: 2, ml: 2, textTransform: "none" }}
                onClick={() => setPwdDialog(true)}
              >
                Change Password
              </Button>
            </Typography>

            <Grid container spacing={3}>

              <Grid item xs={12} md={4}>
                <TextField
                    label="Full Name"
                    name="name"
                    fullWidth
                    value={form.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    sx={{
                        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        borderColor: "#111"
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                        color: "#111"
                        }
                    }}
                    />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                  label="Email"
                  fullWidth
                  disabled
                  value={form.email}
                />
              </Grid>

              <Grid item xs={12} md={4}>
                <TextField
                    label="Phone"
                    name="phone"
                    fullWidth
                    value={form.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    sx={{
                        "& .MuiOutlinedInput-root.Mui-focused fieldset": {
                        borderColor: "#111"
                        },
                        "& .MuiInputLabel-root.Mui-focused": {
                        color: "#111"
                        }
                    }}
                    />
              </Grid>

            </Grid>

            <Button
              variant="contained"
              sx={{ mt: 4, bgcolor: "#111", textTransform: "none" }}
              onClick={handleUpdate}
            >
              Update Profile
            </Button>

          </CardContent>
        </Card>

        {/* ADDRESS HEADER */}
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h5" fontWeight={600}>
            Saved Addresses
          </Typography>

          <Button
            variant="contained"
            sx={{ bgcolor: "#111", textTransform: "none" }}
            onClick={() => {
              setEditAddress(null);
              setDialogOpen(true);
            }}
          >
            + Add Address
          </Button>
        </Box>

        {/* ADDRESS GRID */}
        <Grid container spacing={3}>

          {profile.addresses.length === 0 && (
            <Typography>No address added yet</Typography>
          )}

          {profile.addresses.map((addr) => (
            <Grid item xs={12} md={6} key={addr._id}>

              <Card sx={{ borderRadius: 3 }}>
                <CardContent>

                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mb={1}
                  >
                    <Typography fontWeight={600}>
                      {addr.fullName}
                    </Typography>

                    {addr.isDefault && (
                      <Chip
                        icon={<StarIcon />}
                        label="Default"
                        color="warning"
                        size="small"
                      />
                    )}
                  </Box>

                  <Typography fontSize={14}>
                    {addr.street}
                  </Typography>

                  <Typography fontSize={14}>
                    {addr.city}, {addr.state}
                  </Typography>

                  <Typography fontSize={14}>
                    {addr.country} - {addr.postalCode}
                  </Typography>

                  <Typography fontSize={14} mt={1}>
                    Phone: {addr.phone}
                  </Typography>

                  <Box mt={2} display="flex" gap={1}>

                    <IconButton
                      onClick={() => {
                        setEditAddress(addr);
                        setDialogOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() => handleDelete(addr._id)}
                    >
                      <DeleteIcon />
                    </IconButton>

                    <IconButton
                      color="warning"
                      onClick={() => handleDefault(addr._id)}
                    >
                      <StarIcon />
                    </IconButton>

                  </Box>

                </CardContent>
              </Card>

            </Grid>
          ))}

        </Grid>

        <AddressDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          editData={editAddress}
          onSave={editAddress ? handleUpdateAddress : handleAddAddress}
        />

        <ChangePasswordDialog
          open={pwdDialog}
          onClose={() => setPwdDialog(false)}
          onSuccess={() => {
            clearSession();
            window.location.href = "/login";
          }}
        />
      </Box>
    </Box>
  );
};

export default Profile;