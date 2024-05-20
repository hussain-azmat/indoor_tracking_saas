import React, { Fragment, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";
import ActionPaper from "../../../shared/components/ActionPaper";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function from uuid library


function AddPost(props) {
  const {
    pushMessageToSnackbar,
    onClose,
    EmojiTextArea,
    DateTimePicker,
    addPost,
    updateNumAssets,
    updateAnchors,
    setSelectedSite ,
  } = props;

  //const history = useHistory();
  const siteDescriptionRef = useRef(null);
  const numAssetsRef = useRef(null);
  const numAnchorsRef = useRef(null);
  const siteLabelRef = useRef(null);
  const imageUploadRef = useRef(null);

  const [postId, setPostId] = useState(null); // Declare postId state
  const [uploadAt, setUploadAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [anchorValues, setAnchorValues] = useState([]);
  // eslint-disable-next-line
  //const [numAnchors, setNumAnchors] = useState(0);
  // eslint-disable-next-line
  //const [isAddPostPaperOpen, setIsAddPostPaperOpen] = useState(false);

  //const [image, setImage] = useState(0);
  // const [imageWidth, setImageWidth] = useState(0);
  // const [imageHeight, setImageHeight] = useState(0);


  
  // const handleNumAnchorsChange = () => {
  //   const numAnchors = parseInt(e.target.value);
  //   if (!isNaN(numAnchors)) {
  //     setNumAnchors(numAnchors);
  //     const newAnchorValues = Array.from({ length: numAnchors }, () => ({ x: '', y: '', uid: '' }));
  //     setAnchorValues(newAnchorValues);
  //   }
  // };
  const handleNumAnchorsChange = () => {
    const numAnchors = parseInt(numAnchorsRef.current.value);
    if (!isNaN(numAnchors)) {
      const newAnchorValues = Array.from({ length: numAnchors }, () => ({ x: '', y: '', uid: '' }));
      setAnchorValues(newAnchorValues);
    }
  };

  const handleAnchorInputChange = useCallback((index, field, value) => {
    const updatedAnchors = [...anchorValues];
    updatedAnchors[index][field] = value;
    setAnchorValues(updatedAnchors);
  }, [anchorValues]);

  const handleUpload = useCallback(() => {
    setLoading(true);
  
    const siteDescription = siteDescriptionRef.current?.value;
    const numAssets = numAssetsRef.current?.value;
    const siteLabel = siteLabelRef.current?.value;
    // eslint-disable-next-line
    const numAnchors = numAnchorsRef.current?.value;
    const imageFile = imageUploadRef.current?.files[0];
    
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const imageData = event.target.result;
      const fileName = imageFile.name;
      
      // Save the image data to local storage
      localStorage.setItem(fileName, imageData);
      
      // Generate a unique ID for the new post
      const postId = uuidv4();
      
      // Construct the image path
      const imagePath = `../../../../../${fileName}`;
      const imagePathPost = `${process.env.PUBLIC_URL}/images/logged_in/${fileName}`;
      // Create JSON object to send to the server
      const data = {
        description: siteDescription,
        assets: numAssets,
        label: siteLabel,
        anchors: anchorValues,
        image: imagePath // Path of the locally saved image file
      };
      
      const newPost = {
        id: postId,
        src: imagePathPost, // Replace with actual source URL
        name: siteLabel, // Replace with actual name
        description: siteDescription,
      };
      
      
        // Send the data including the local image path to the server
        axios.post('https://uwb-backend.onrender.com/test', data)
        .then(response => {
          setLoading(false);
          pushMessageToSnackbar({
            text: "Your site has been added",
          });
          setSelectedSite(newPost);
          addPost(newPost);
          setPostId(newPost.id);
          //console.log("Data: ", data);
          //console.log("New Post: ", newPost.id);
          console.log("Post ID: ", newPost.id);

          updateAnchors(anchorValues);
          updateNumAssets(numAssets);
          //window.location.href = './Post';
          // Redirect to the posts page
          //history.replace('./posts/${postId}');
          onClose();
        })
        
        .catch(error => {
          setLoading(false);
          console.error('Error uploading post:', error);
        });
        //console.log(typeof updateAnchors, typeof updateNumAssets);

    };
  
    reader.readAsDataURL(imageFile); // Read the uploaded image file
  }, [setSelectedSite, siteDescriptionRef, numAssetsRef, siteLabelRef, numAnchorsRef, imageUploadRef, anchorValues, addPost, onClose, pushMessageToSnackbar, updateAnchors, updateNumAssets]);
  
  // const handleImageLoad = (e) => {
  //   const img = e.target;
  //   setImageWidth(img.width);
  //   setImageHeight(img.height);
  // };

  return (
    <Fragment>
      <ActionPaper
        helpPadding
        maxWidth="md"
        content={
          <Fragment>
            <div style={{ display: "flex", flexDirection: "row" }}>
              <div style={{ flex: 1 }}>
                <EmojiTextArea ref={siteDescriptionRef} label="Site Description" />
                <DateTimePicker label="Upload At" onChange={setUploadAt} value={uploadAt} />
                
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ flex: "1 0 auto" }}>
                <label htmlFor="siteLabel" >Name: </label>
                <textarea id="siteLabel" ref={siteLabelRef} rows="1"></textarea>
                </div>
                  <div style={{ flex: "1 0 auto" }}>
                    <label htmlFor="numAnchors" style={{ marginBottom: "8px" }}>Anchors#:</label>
                    <input type="number" id="numAnchors" ref={numAnchorsRef} onChange={handleNumAnchorsChange} />
                  </div>
                  <div style={{ flex: "1 0 auto", marginLeft: "16px" }}>
                    <label htmlFor="numAssets" style={{ marginBottom: "8px" }}>Assets#:</label>
                    <input type="number" id="numAssets" ref={numAssetsRef} />
                  </div>
                </div>
              </div>
              <div>
                <div className="file-upload" style={{ position: "relative", marginTop: "0px", marginBottom: "0px", display: "flex", alignItems: "center" }}>
                  <label htmlFor="imageUpload" style={{ cursor: "pointer", border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
                    <CloudUploadIcon style={{ marginRight: "50px", marginLeft: "50px", marginTop: "60px", marginBottom: "60px"  }} />
                  </label>
                  <input type="file" id="imageUpload" accept="image/*" ref={imageUploadRef} style={{ display: "none" }} />
                </div>
              </div>
            </div>
            <table style={{ width: "100%", marginTop: "16px" }}>
              <thead>
                <tr>
                  <th>Anchor</th>
                  <th>X Coordinate</th>
                  <th>Y Coordinate</th>
                  <th>Serial UID</th>
                </tr>
              </thead>
              <tbody>
                {anchorValues.map((anchor, index) => (
                  <tr key={index}>
                    <td>Anchor {index + 1}</td>
                    <td><input type="text" value={anchor.x} onChange={(e) => handleAnchorInputChange(index, 'x', e.target.value)} placeholder="X Coordinate" /></td>
                    <td><input type="text" value={anchor.y} onChange={(e) => handleAnchorInputChange(index, 'y', e.target.value)} placeholder="Y Coordinate" /></td>
                    <td><input type="text" value={anchor.uid} onChange={(e) => handleAnchorInputChange(index, 'uid', e.target.value)} placeholder="Serial UID" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Fragment>
        }
        actions={
          <Fragment>
            <Box mr={1}>
              <Button onClick={onClose} disabled={loading}>
                Back
              </Button>
            </Box>
            <Link to={`./posts/${postId}`} style={{ textDecoration: 'none' }}>
            <Button
              onClick={handleUpload}
              variant="contained"
              color="secondary"
              disabled={loading}
              style={{ height: "fit-content", marginTop: "auto" }}
            >
              Add Site {loading && <ButtonCircularProgress />}
              
            </Button>
            </Link>
          </Fragment>
        }
      />
    </Fragment>
  );
}

AddPost.propTypes = {
  pushMessageToSnackbar: PropTypes.func,
  onClose: PropTypes.func,
  EmojiTextArea: PropTypes.elementType,
  DateTimePicker: PropTypes.elementType,
  updateAnchors: PropTypes.func,
  updateNumAssets: PropTypes.func,
  // ImageCropper: PropTypes.elementType, // Uncomment if you are using ImageCropper
};

export default AddPost;