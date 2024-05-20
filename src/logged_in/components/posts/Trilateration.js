import React, { useEffect, useState } from 'react';

const Trilateration = ({ onPositionUpdate, anchors, transmitterSerialNumbers, numAssets }) => {
  const [estimatedPosition, setEstimatedPosition] = useState(null);

  useEffect(() => {
    const fetchData = async (transmitterSerialNumbers) => {
      try {
        // Fetch distances from anchors and estimated position
        const response = await fetch('https://uwb-backend.onrender.com/multipleDistance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ transmitterSerialNumbers, numAssets })
        });
        const data = await response.json();

        // Create an object to store distances for each deviceUID
        const distancesMap = {};

        // Iterate over the transmitters data
        data.transmitters.forEach(transmitter => {
          // Iterate over the data of each transmitter
          transmitter.data.forEach(dataPoint => {
            // Initialize an array for the deviceUID if it doesn't exist
            if (!distancesMap[dataPoint.deviceUID]) {
              distancesMap[dataPoint.deviceUID] = [];
            }
            // Push the distance to the array
            distancesMap[dataPoint.deviceUID].push(dataPoint.distance / 1000); // Divide by 1000 as mentioned in your previous messages
          });
        });

        // Extract distances arrays from the distancesMap object
        const tagDistancesArray = Object.values(distancesMap);

        // Call trilateration function with transformed distances
        trilaterate(tagDistancesArray, anchors);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    const trilaterate = async (distances, anchors) => {
      try {
        if (!anchors || anchors.length === 0) {
          console.error('Anchors array is empty or undefined.');
          return;
        }
        
        // Convert anchor positions to the required format
        const anchorPositions = anchors.map(anchor => [anchor.x, anchor.y]);
        
        // Construct the data object with anchorPositions and tagDistancesArray
        const trilaterationData = {
          anchorPositions,
          tagDistancesArray: distances
        };
    
        const response = await fetch('https://uwb-backend.onrender.com/multitrilaterate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trilaterationData),
        });
    
        const estimatedPosition = await response.json();
    
        // Update the state with the estimated position
        //console.log(estimatedPosition);
        setEstimatedPosition(estimatedPosition);
        
        // Pass the estimated position to the parent component
        if (onPositionUpdate) {
          onPositionUpdate(estimatedPosition);
        }
      } catch (error) {
        console.error('Error performing trilateration:', error);
      }
    };
    
    // Fetch asset positions and distances initially
    fetchData(transmitterSerialNumbers);

    // Set up interval to fetch data every 10 seconds
    const intervalId = setInterval(() => fetchData(transmitterSerialNumbers), 10000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [onPositionUpdate, anchors, transmitterSerialNumbers, numAssets]);

  // Render an anchor-like point based on the estimatedPosition
  return (
    <div style={{ position: 'absolute', left: estimatedPosition?.x, top: estimatedPosition?.y}}></div>
  );
};

export default Trilateration;