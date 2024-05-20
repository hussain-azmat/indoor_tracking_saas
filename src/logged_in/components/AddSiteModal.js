import React, { useRef, useState } from 'react';
import './AddSiteModal.css';

function AddSiteModal({ isOpen, onClose, onAddSite, handleImageUpload, updateAnchors, updateNumAssets}) {
  const siteNameRef = useRef(null);
  const siteDescriptionRef = useRef(null);
  const siteAssetsRef = useRef(null);
  const numAnchorsRef = useRef(null);
  const imageUploadRef = useRef(null);

  const [anchorValues, setAnchorValues] = useState([]);
  

  const handleSubmit = (event) => {
    event.preventDefault();

    // Get form values
    const siteName = siteNameRef.current.value;
    const siteDescription = siteDescriptionRef.current.value;
    const numAssets = siteAssetsRef.current.value;
    const imageFile = imageUploadRef.current.files[0];
    handleImageUpload({ target: { files: [imageFile] } });
    // Create a new site object
    const newSite = {
      name: siteName,
      description: siteDescription,
      anchors: anchorValues, // Pass the anchor values to the new site object
      assets: numAssets,
      image: imageFile
    };

    // Call the onAddSite function passed from the App component
    onAddSite(newSite);
    updateAnchors(anchorValues);
    updateNumAssets(numAssets);
    // Close the modal
    onClose();
  };

  const handleNumAnchorsChange = () => {
    const numAnchors = parseInt(numAnchorsRef.current.value);
    if (!isNaN(numAnchors)) {
      const newAnchorValues = Array.from({ length: numAnchors }, () => ({ x: '', y: '', uid: '' }));
      setAnchorValues(newAnchorValues);
    }
  };

  const handleAnchorInputChange = (index, field, value) => {
    const updatedAnchors = [...anchorValues];
    updatedAnchors[index][field] = value;
    setAnchorValues(updatedAnchors);
  };

  

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Site</h2>
        <form onSubmit={handleSubmit}>
          <label htmlFor="siteName">Site Name:</label>
          <input type="text" id="siteName" ref={siteNameRef} />

          <label htmlFor="siteDescription">Site Description:</label>
          <textarea id="siteDescription" ref={siteDescriptionRef}></textarea>

          <label htmlFor="numAnchors">Number of Anchors:</label>
          <input type="number" id="numAnchors" ref={numAnchorsRef} onChange={handleNumAnchorsChange} />

          <label htmlFor="numAssets">Number of Assets:</label>
          
          <input type="number" id="numAssets" ref={siteAssetsRef} />

          <label htmlFor="imageUpload">Upload Image:</label>
          <input type="file" id="imageUpload" accept="image/*" ref={imageUploadRef} />

          {anchorValues.map((anchor, index) => (
            <div key={index}>
              <label>Anchor {index + 1}:</label>
              <input type="text" value={anchor.x} onChange={(e) => handleAnchorInputChange(index, 'x', e.target.value)} placeholder="X Coordinate" />
              <input type="text" value={anchor.y} onChange={(e) => handleAnchorInputChange(index, 'y', e.target.value)} placeholder="Y Coordinate" />
              <input type="text" value={anchor.uid} onChange={(e) => handleAnchorInputChange(index, 'uid', e.target.value)} placeholder="Serial UID" />
            </div>
          ))}

          <button type="submit">Add Site</button>
          <button type="button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
}

export default AddSiteModal;