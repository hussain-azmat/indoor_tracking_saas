// import React from "react";
// import PropTypes from "prop-types";
// import { Drawer, IconButton, Toolbar, Divider, Typography, Box } from "@mui/material";
// import withStyles from '@mui/styles/withStyles';
// import CloseIcon from "@mui/icons-material/Close";

// // const drawerWidth = 1550;
// const drawerWidth = 500;
// const styles = {
//   toolbar: {
//     minWidth: drawerWidth
//   }
// };

// function SideDrawer(props) {
//   const { classes, onClose, open } = props;
//   return (
//     <Drawer anchor="right" open={open} variant="temporary" onClose={onClose}>
//       <Toolbar disableGutters className={classes.toolbar}>
//         <Box
//           pl={3}
//           pr={3}
//           display="flex"
//           justifyContent="space-between"
//           width="100%"
//           alignItems="center"
//         >
//           <Typography variant="h6">User Profile</Typography>
//           <IconButton
//             onClick={onClose}
//             color="primary"
//             aria-label="Close Sidedrawer"
//             size="large">
//             <CloseIcon />
//           </IconButton>
//         </Box>
//       </Toolbar>
//       <Divider />
//     </Drawer>
//   );
// }

// SideDrawer.propTypes = {
//   classes: PropTypes.object.isRequired,
//   open: PropTypes.bool.isRequired,
//   onClose: PropTypes.func.isRequired
// };

// export default withStyles(styles)(SideDrawer);


import React, { useState } from "react";
import PropTypes from "prop-types";
import { Drawer, IconButton, Toolbar, Divider, Typography, Box, TextField, Button, Avatar } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

// const drawerWidth = 500;
// const styles = {
//   toolbar: {
//     minWidth: drawerWidth
//   },
//   content: {
//     padding: "16px",
//   },
  
//   avatar: {
//     width: "100px",
//     height: "100px",
//     margin: "16px auto",
//   },
//   input: {
//     display: "none",
//   },
//   button: {
//     marginTop: "16px",
//   },
//   saveButton: {
//     marginTop: "32px",
//   }
// };


const styles = (theme) => ({
  drawerPaper: {
    width: '100%', // This makes the drawer take 100% of the screen width
    maxWidth: 500, // You can adjust this value to your desired drawer width
  },
  toolbar: {
    minWidth: '100%',
  },
  content: {
    padding: theme.spacing(3),
    width: '100%',
    maxWidth: 500, // Adjust this value if you want the content to have a max-width
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

  // State for form fields
  const [profileData, setProfileData] = useState({
    profilePic: "",
    name: "",
    email: "",
    gender: "",
    dob: "",
    address: "",
  });

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle profile picture change
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
    }
  };

  // Handle form submission

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Profile Data:", profileData);

    const formData = new FormData();
    formData.append("profilePic", profileData.profilePic);
    formData.append("name", profileData.name);
    formData.append("email", profileData.email);
    formData.append("gender", profileData.gender);
    formData.append("dob", profileData.dob);
    formData.append("address", profileData.address);

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
  
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log("Profile Data:", profileData);

  //   // Make an API call to update profile data
  //   try {
  //     const response = await fetch('https://uwb-backend.onrender.com/updateprofile', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(profileData),
  //     });

  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }

  //     const result = await response.json();
  //     console.log("Success:", result);
  //     // Handle success (e.g., show a success message, update state, etc.)
  //   } catch (error) {
  //     console.error("Error:", error);
  //     // Handle error (e.g., show an error message)
  //   }
  // };

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   // Placeholder for API call
  //   console.log("Profile Data:", profileData);
  //   // Send profileData to the server here
  // };

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
      <Divider />
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
            name="dob"
            type="date"
            value={profileData.dob}
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
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            className={classes.saveButton}
            onClick={onClose}
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