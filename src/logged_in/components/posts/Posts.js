import React, { useState, useCallback, useEffect } from "react";
//import { Link } from 'react-router-dom';
import PropTypes from "prop-types";
import PostContent from "./PostContent";
import AddPost from "./AddPost";
import SiteDetailsPage from "./SiteDetailsPage";
//import { Card, Box, Typography } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import axios from "axios"; // Import axios here

const styles = (theme) => ({
  img: {
    width: "100%",
    height: "auto",
    marginBottom: 8,
  },
  card: {
    boxShadow: theme.shadows[2],
  },
  noDecoration: {
    textDecoration: "none !important",
  },
  title: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.secondary.main,
    "&:hover": {
      color: theme.palette.secondary.dark,
    },
    "&:active": {
      color: theme.palette.primary.dark,
    },
  },
  link: {
    transition: theme.transitions.create(["background-color"], {
      duration: theme.transitions.duration.complex,
      easing: theme.transitions.easing.easeInOut,
    }),
    cursor: "pointer",
    color: theme.palette.primary.main,
    "&:hover": {
      color: theme.palette.primary.dark,
    },
  },
  showFocus: {
    "&:focus span": {
      color: theme.palette.secondary.dark,
    },
  },
});

function Posts(props) {
  const {
    selectPosts,
    EmojiTextArea,
    ImageCropper,
    Dropzone,
    DateTimePicker,
    pushMessageToSnackbar,
    posts,
    setPosts,
    // classes,
    // site, 
    // siteSelection,
  } = props;
  const [isAddPostPaperOpen, setIsAddPostPaperOpen] = useState(false);
  
  // eslint-disable-next-line
  const [selectedSite, setSelectedSite] = useState(null);
  

  const [anchors, setAnchors] = useState([]);
  const [numAssets, setAssets] = useState([]);

  const updateAnchors = useCallback((newAnchors) => {
    setAnchors(newAnchors || []);
  }, []);

  const updateNumAssets = useCallback((newNumAssets) => {
    setAssets(newNumAssets || []);
  }, []);

  const openAddPostModal = useCallback(() => {
    setIsAddPostPaperOpen(true);
  }, [setIsAddPostPaperOpen]);

  const closeAddPostModal = useCallback(() => {
    setIsAddPostPaperOpen(false);
  }, [setIsAddPostPaperOpen]);

  const addPost = useCallback((newPost) => {
    // Add a unique ID to the new post before adding it to the posts array
    console.log("New Post1:", newPost);
    //const postWithId = { ...newPost, id: generateUniqueId() };
    setPosts((prevPosts) => [...prevPosts, newPost ]);
  }, [setPosts]);

  const handleSiteClick = useCallback(async (site) => {
    setSelectedSite(site || null);
    try {
      const response = await axios.get('https://uwb-backend.onrender.com/sitesDetail', {
        params: { 
          email: localStorage.getItem('email'),
          name: site.name 
        }
      });
      console.log("Site Details:", response.data);
      updateAnchors(response.data.anchors); // Update with fetched data
      updateNumAssets(response.data.numAssets); // Update with fetched data
    } catch (error) {
      console.error('Error fetching site details:', error);
    }
  }, [updateAnchors, updateNumAssets]);

  // const handleSiteClick = useCallback(
    
  //   (site) => {
  //     setSelectedSite(site || null);
  //     updateAnchors(site?.anchors); // Assuming site has an anchors property
  //     updateNumAssets(site?.numAssets); // Assuming site has a numAssets property
  //     console.log("Site Data:", site); // Log selected site data
  //   },
  //   [updateAnchors, updateNumAssets]

  // );

  // const handleSiteClick = (site) => {
  //   setSelectedSite(site);
  //   console.log("Site Data:", site); // Log selected site data
  //   //console.log("Selected Site:", selectedSite);
  // };
  
  //console.log("New Post: ", posts);
  //console.log("Post ID: ", posts.id);

  useEffect(() => {
    selectPosts();
    //console.log("Site Data inside useEffect:", selectedSite); // Log selected site data
  }, [selectPosts]);

  useEffect(() => {
    handleSiteClick(selectedSite);
    //console.log("Site Data -> useEffect:", selectedSite); // Log selected site data
  }, [handleSiteClick, selectedSite])

  if (isAddPostPaperOpen) {
    return <AddPost
      onClose={closeAddPostModal}
      EmojiTextArea={EmojiTextArea}
      ImageCropper={ImageCropper}
      Dropzone={Dropzone}
      DateTimePicker={DateTimePicker}
      pushMessageToSnackbar={pushMessageToSnackbar}
      addPost={addPost}
      setSelectedSite={setSelectedSite}
      updateAnchors={updateAnchors}
      updateNumAssets={updateNumAssets}
    />
  }
  //console.log("Selected Site:", selectedSite);
  if (selectedSite) {
    //console.log("If Selected Site:", selectedSite); // Log selected site data
    return <SiteDetailsPage site={selectedSite} anchors={anchors} numAssets={numAssets} otherArticles={posts} onSiteClick={handleSiteClick}/>;
  }

  

  //return <PostContent posts={posts} onSiteClick={handleSiteClick} />;
  return <PostContent
    openAddPostModal={openAddPostModal}
    posts={posts}
    setPosts={setPosts}
    pushMessageToSnackbar={pushMessageToSnackbar}
    onSiteClick={handleSiteClick} // Pass function to handle post click events
    updateAnchors={updateAnchors}
    updateNumAssets={updateNumAssets} // Pass the updateNumAssets function

  />
}

Posts.propTypes = {
  EmojiTextArea: PropTypes.elementType,
  ImageCropper: PropTypes.elementType,
  Dropzone: PropTypes.elementType,
  DateTimePicker: PropTypes.elementType,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPosts: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  selectPosts: PropTypes.func.isRequired,
  //selectedSite: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(Posts);
//export default Posts;
