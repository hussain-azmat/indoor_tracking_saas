import React, { useEffect, useState } from 'react';

const Trilateration = ({ onPositionUpdate, anchors, transmitterSerialNumbers, numAssets }) => {
  const [estimatedPosition, setEstimatedPosition] = useState(null);
  //const [anchors, setAnchors] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch distances from anchors and estimated position
        const response = await fetch('https://uwb-backend.onrender.com/distance', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          //body: JSON.stringify({ transmitterSerialNumbers: ["10010A", "1000EE", "10010C"] })
          body: JSON.stringify({ transmitterSerialNumbers, numAssets })
        });
        const data = await response.json();
        console.log('Fetched data:', data); // Log the fetched data
        console.log('Assets:', numAssets);
        //console.log('Serial UIDS:', transmitterSerialNumbers);
        // Transform the distance data to the required format
        const distanceData = data.map(item => ({
          transmitterSerialNumber: item.transmitterSerialNumber,
          distanceData: item.distance / 1000 // Divide each distance by 1000
        }));
        //console.log('Distances Before:', distanceData);
        //console.log('Structure of a single item in data:', data[0]);

        // Call trilateration function with transformed distances
        // console.log(anchorPositions);
        trilaterate(distanceData, anchors);
        // Perform trilateration for each asset
        //data.forEach(assetData => {
        //  trilaterate(assetData.distances, anchors, assetData.assetId);
        //});
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
        
        //const anchorPositions = [[0, 0],[6.70656, 0],[6.70656, 12.42912]];
        const anchorPositions = anchors.map(anchor => [anchor.x, anchor.y]);;
        
        // Construct the data object with anchorPositions and distances
        const trilaterationData = {
          anchorPositions,
          distances: distances.map(item => item.distanceData)
          //distances: [2.000, 1.000, 0.800]
        };
        //console.log('Distances:', trilaterationData );
        const response = await fetch('https://uwb-backend.onrender.com/trilaterate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(trilaterationData ),
        });

        const estimatedPosition = await response.json();
        //console.log('Estimated position:', estimatedPosition); // Log the estimated position

        // Update the state with the estimated position
        setEstimatedPosition(estimatedPosition.estimatedPosition);
        
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

    // Set up interval to fetch data every 5 seconds
    //const intervalId = setInterval(fetchData, 5000);
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
