import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Drawer, IconButton, Toolbar, Divider, Typography, Box, TextField, Button, Avatar } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const styles = (theme) => ({
  drawerPaper: {
    width: '100%',
    maxWidth: 500,
  },
  toolbar: {
    minWidth: '100%',
  },
  content: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: 500,
    boxSizing: 'border-box',
  },
  profileSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    margin: `${theme.spacing(2)}px auto`,
  },
  input: {
    display: "none",
  },
  button: {
    marginTop: theme.spacing(2),
  },
  saveButton: {
    marginTop: theme.spacing(4),
  },
});

function SideDrawer(props) {
  const { classes, onClose, open } = props;

  const [profileData, setProfileData] = useState({
    profilePic: "",
    name: "",
    email: "",
    gender: "",
    dateofBirth: "",
    address: "",
    oldPassword: "",
    newPassword: "",
    //confirmNewPassword: "", // Include confirmNewPassword in the state
  });

  const [profilePic, setProfilePic] = useState(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

   // Fetch user data from localStorage and update profileData state
   useEffect(() => {
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    if (userData) {
      // Convert dateofBirth string to Date object
      const dateOfBirth = new Date(userData.dateofBirth);
      setProfileData({
        ...userData,
        dateofBirth: dateOfBirth,
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Convert dateofBirth to a Date object if the field is "dateofBirth"
    const newValue = name === "dateofBirth" ? new Date(value) : value;
  
    setProfileData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };
  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prevData) => ({
          ...prevData,
          profilePic: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setProfilePic(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Profile Data before setting new password:", profileData);


    let updatedProfileData = { ...profileData };

    // Set newPassword to oldPassword if it's empty
    if (showPasswordFields && !updatedProfileData.newPassword) {
      updatedProfileData.newPassword = updatedProfileData.oldPassword;
    }

    // Password mismatch check only if confirmNewPassword is not empty
    if (updatedProfileData.confirmNewPassword && updatedProfileData.newPassword !== updatedProfileData.confirmNewPassword) {
      alert("New password mismatch.");
      return;
    }

    const formData = new FormData();
    if (profilePic) {
      formData.append("profilePic", profilePic);
    }
    formData.append("name", updatedProfileData.name);
    formData.append("email", updatedProfileData.email);
    formData.append("gender", updatedProfileData.gender);
    formData.append("dateofBirth", updatedProfileData.dateofBirth);
    formData.append("address", updatedProfileData.address);
    formData.append("oldPassword", updatedProfileData.oldPassword);

    if (showPasswordFields) {
      formData.append("newPassword", updatedProfileData.newPassword);
    }

    try {
      const response = await fetch("https://uwb-backend.onrender.com/updateprofile", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error:", error);
    }
  };
    

  const handlePasswordChangeToggle = () => {
    setShowPasswordFields(!showPasswordFields);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      variant="temporary"
      onClose={onClose}
      classes={{ paper: classes.drawerPaper }}
    >
      <Toolbar disableGutters className={classes.toolbar}>
        <Box
          pl={3}
          pr={3}
          display="flex"
          justifyContent="space-between"
          width="100%"
          alignItems="center"
        >
          <Typography variant="h6">User Profile</Typography>
          <IconButton
            onClick={onClose}
            color="primary"
            aria-label="Close Sidedrawer"
            size="large"
          >
          <CloseIcon />
          </IconButton>
        </Box>
      </Toolbar>
      <Divider/>
      <Box className={classes.content}>
        <form onSubmit={handleSubmit} className={classes.profileSection}>
          <input
            accept="image/*"
            className={classes.input}
            id="upload-profile-pic"
            type="file"
            onChange={handleProfilePicChange}
          />
          <label htmlFor="upload-profile-pic" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={profileData.profilePic}
              className={classes.avatar}
            />
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUploadIcon />}
              className={classes.button}
            >
              Upload Profile Picture
            </Button>
          </label>
          
          <TextField
            label="Name"
            name="name"
            value={profileData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />

          <TextField
            label="Email"
            name="email"
            value={profileData.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Gender"
            name="gender"
            value={profileData.gender}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Date of Birth"
            name="dateofBirth"
            type="date"
            value={profileData.dateofBirth ? profileData.dateofBirth.toISOString().split('T')[0] : ""} // Format date as YYYY-MM-DD
            onChange={handleChange}
            fullWidth
            margin="normal"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Address"
            name="address"
            value={profileData.address}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <Button
            variant="contained"
            color="secondary"
            fullWidth
            className={classes.button}
            onClick={handlePasswordChangeToggle}
          >
            {showPasswordFields ? "Cancel Password Change" : "Change Password"}
          </Button>
          {showPasswordFields && (
            <>
              <TextField
                label="Old Password"
                name="oldPassword"
                type="password"
                value={profileData.oldPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="New Password"
                name="newPassword"
                type="password"
                value={profileData.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Confirm New Password"
                name="confirmNewPassword"
                type="password"
                value={profileData.confirmNewPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
            </>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.saveButton}
          >
            Save
          </Button>
        </form>
      </Box>
    </Drawer>
  );
}

SideDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withStyles(styles)(SideDrawer);
