import React, { useState, useCallback, useEffect } from "react";
//import { useHistory } from 'react-router-dom';
import PropTypes from "prop-types";
import PostContent from "./PostContent";
import AddPost from "./AddPost";
import SiteDetailsPage from "./SiteDetailsPage";
//import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function from uuid library


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
  } = props;
  const [isAddPostPaperOpen, setIsAddPostPaperOpen] = useState(false);
  // eslint-disable-next-line
  //const [selectedPost, setSelectedPost] = useState(null);
  const [selectedSite, setSelectedSite] = useState(null);
  
  // Function to generate a unique ID for a new site
  // const generateUniqueId = useCallback(() => {
  //   return uuidv4(); // Generate UUID using uuidv4 function
  // }, []);

  const [anchors, setAnchors] = useState([]);
  const [numAssets, setAssets] = useState([]);

  const updateAnchors = useCallback((newAnchors) => {
    setAnchors(newAnchors);
  }, []);

  const updateNumAssets = useCallback((newNumAssets) => {
    setAssets(newNumAssets);
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

  // const handleSiteClick = useCallback((site) => {
  //   setSelectedSite(site);
  //   console.log("Site Data:", site); // Log selected site data
  //   //console.log("Selected Site:", selectedSite);
  // }, []);

  const handleSiteClick = (site) => {
    setSelectedSite(site);
    console.log("Site Data:", site); // Log selected site data
    //console.log("Selected Site:", selectedSite);
  };
  
  //console.log("New Post: ", posts);
  //console.log("Post ID: ", posts.id);

  useEffect(() => {
    selectPosts();
    //console.log("Site Data inside useEffect:", selectedSite); // Log selected site data
  }, [selectPosts]);

  useEffect(() => {
    handleSiteClick(selectedSite);
    //console.log("Site Data -> useEffect:", selectedSite); // Log selected site data
  }, [selectedSite])

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
    return <SiteDetailsPage site={selectedSite} anchors={anchors} numAssets={numAssets}/>;
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

export default Posts;
