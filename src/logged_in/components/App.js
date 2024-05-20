// App.js

import React, { useState, useEffect } from 'react';
//import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import './App.css';
//import siteImage from './floor_map2.png';
import AddSiteModal from './AddSiteModal';
import companyLogo from './company_logo.png'; // Import the company logo image
import Trilateration from './Trilateration'; // Add this line to import the Trilateration component
import ViewSitePage from './ViewSitePage'; // Import the ViewSitePage component


function App() {
  const [image, setImage] = useState(0);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  const [estimatedPosition, setEstimatedPosition] = useState(null);
  console.log("Estimated Position:", estimatedPosition);

  const [anchors, setAnchors] = useState([]);
  const [numAssets, setAssets] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const updateAnchors = (newAnchors) => {
    // Update the anchors array with the new data
    setAnchors(newAnchors);
  };

  const updateNumAssets = (newAssets) => {
    // Update the anchors array with the new data
    setAssets(newAssets);
  };

  //console.log("Number of Assets: ", numAssets);
  // Extract uid values from anchors
  const transmitterSerialNumbers = anchors.map(anchor => anchor.uid);

  const [showViewSitePage, setShowViewSitePage] = useState(false);

  const maxX = Math.max(...anchors.map(anchor => anchor.x));
  const maxY = Math.max(...anchors.map(anchor => anchor.y));

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImage(URL.createObjectURL(file));

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.src = e.target.result;
      img.onload = () => {
        setImageWidth(img.width);
        setImageHeight(img.height);
      };
    };
    reader.readAsDataURL(file);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const handleViewSiteClick = () => {
    console.log('View Site Clicked:');
    setShowViewSitePage(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const addSite = (newSite) => {
    // Here you can implement the logic to add the new site
    console.log('Adding new site:', newSite);
    // Update the image if needed
    if (newSite.image) {
      setImage(URL.createObjectURL(newSite.image));
    }
    
  };
  

// useEffect to update estimatedPosition
useEffect(() => {
  const intervalId = setInterval(() => {
    setEstimatedPosition(estimatedPosition); // Replace this with your logic to fetch the estimated position
  }, 5000);

  return () => clearInterval(intervalId);
}, [estimatedPosition]);



//console.log("Estimated Position After:", estimatedPosition);
  return (
    <div className="App">
      <header>
        <img src={companyLogo} alt="Company Logo" className="company-logo" />
        <h1 className="header-text">Indoor Tracking</h1>
        <nav className="button-menu">
          <button>Home</button>
          <button onClick={openModal}>Add Site</button>
          <button onClick={handleViewSiteClick}>View Site </button>
        </nav>
      </header>
    
      <main>
      {showViewSitePage && <ViewSitePage />}
        <Trilateration onPositionUpdate={setEstimatedPosition} anchors={anchors} transmitterSerialNumbers={transmitterSerialNumbers} numAssets={numAssets}/>
        
        <h2>Site Preview</h2>
        {image && (
          <div className="image-container" style={{ position: 'relative' }}>
            <img src={image} alt="Uploaded" />
            
            {estimatedPosition && anchors &&(
              
              <div
                // className="asset-point"
                style={{
                  left:estimatedPosition ? `${estimatedPosition.estimatedPosition[0] * 100 / maxX}%` : 0,
                  top: estimatedPosition ? `${estimatedPosition.estimatedPosition[1] * 100 / maxY}%` : 0,
                  position: 'absolute',
                  width: '10px',
                  height: '10px',
                  borderRadius: "50%",
                  backgroundColor: 'green' /* Change the color as needed */
              }}
              >
              </div>
            )}
            {anchors.map((anchor, index) => (
              
              <div
                key={index}
                className=""
                style={{
                  left: `${(anchor.x) * imageWidth}px`,
                  top: `${(anchor.y) * imageHeight}px`
                }}
              ></div>
            ))}
          </div>
        )}
        
      </main>
      <AddSiteModal isOpen={isModalOpen} onClose={closeModal} onAddSite={addSite} updateAnchors={updateAnchors} updateNumAssets = {updateNumAssets} handleImageUpload={handleImageUpload} />
      
    </div>
  );
}

export default App;
