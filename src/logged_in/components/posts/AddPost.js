import React, { Fragment, useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Button, Box } from "@mui/material";
import ActionPaper from "../../../shared/components/ActionPaper";
import ButtonCircularProgress from "../../../shared/components/ButtonCircularProgress";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function AddPost(props) {
  const {
    pushMessageToSnackbar,
    onClose,
    EmojiTextArea,
    DateTimePicker,
    addPost,
    updateNumAssets,
    updateAnchors,
    setSelectedSite,
  } = props;

  const siteDescriptionRef = useRef(null);
  const numAssetsRef = useRef(null);
  const numAnchorsRef = useRef(null);
  const siteLabelRef = useRef(null);
  const imageUploadRef = useRef(null);

  const [postId, setPostId] = useState(null);
  const [uploadAt, setUploadAt] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [anchorValues, setAnchorValues] = useState([]);

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

  const handleUpload = useCallback(async () => {

    setLoading(true);

    const siteDescription = siteDescriptionRef.current?.value;
    const numAssets = numAssetsRef.current?.value;
    const siteLabel = siteLabelRef.current?.value;
    const imageFile = imageUploadRef.current?.files[0];

    // Generate a unique post ID
    const postId = uuidv4();

    console.log("ImageFile", imageFile);
    
    // Create a new FormData object
    const formData = new FormData();
    formData.append('image', imageFile);
    formData.append('id', postId);
    formData.append('name', siteLabel);
    formData.append('description', siteDescription);
    formData.append('assets', numAssets);
    formData.append('anchors', JSON.stringify(anchorValues));
    
    console.log(anchorValues);

    try {
  
      // Send a POST request to the server to upload the image and data
      const response = await fetch('https://uwb-backend.onrender.com/sites', {
        method: 'POST',
        body: formData,
      });
  
      // Parse the JSON response
      const result = await response.json();
      
      //console.log("Result: ", result.imageUrl);
      // Assuming the server responds with the URL of the uploaded image
      if (response.ok) {
        //const imageUrl = result.url; // Ensure this matches the actual response structure
        //console.log("Image URL:", imageUrl);
  
        // Create the new post object with the image URL
        const newPost = {
          id: postId,
          src: result.imageUrl,
          name: siteLabel,
          description: siteDescription,
          assets: numAssets,
          anchors: anchorValues,
        };
  
        // Update the application state with the new post
        setLoading(false);
        pushMessageToSnackbar({
          text: "Your site has been added",
        });
        setSelectedSite(newPost);
        addPost(newPost);
        setPostId(newPost.id);
        updateAnchors(anchorValues);
        updateNumAssets(numAssets);
        onClose();
      } else {
        console.error('Error:', result);
      }
    } catch (error) {
      console.error('Error uploading post:', error);
    } finally {
      setLoading(false);
    }
  }, [anchorValues, pushMessageToSnackbar, setSelectedSite, siteDescriptionRef, numAssetsRef, siteLabelRef, imageUploadRef, addPost, onClose, updateAnchors, updateNumAssets]);
  
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
                    <label htmlFor="siteLabel">Name: </label>
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
                    <CloudUploadIcon style={{ marginRight: "50px", marginLeft: "50px", marginTop: "60px", marginBottom: "60px" }} />
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
  addPost: PropTypes.func,
  updateAnchors: PropTypes.func,
  updateNumAssets: PropTypes.func,
  setSelectedSite: PropTypes.func,
};

export default AddPost;
