  // eslint-disable-next-line
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Grid, Card } from "@mui/material";
import withStyles from "@mui/styles/withStyles";
import ZoomImage from "../../../shared/components/ZoomImage";
import smoothScrollTop from "../../../shared/functions/smoothScrollTop";
import Trilateration from './Trilateration'; // Add this line to import the Trilateration component

const styles = (theme) => ({
  blogContentWrapper: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    [theme.breakpoints.up("sm")]: {
      marginLeft: theme.spacing(4),
      marginRight: theme.spacing(4),
    },
    maxWidth: 1280,
    width: "100%",
  },
  wrapper: {
    minHeight: "60vh",
  },
  imgContainer: {
    position: "relative", // Add relative positioning here
  },
  img: {
    width: "100%",
    height: "auto",
  },
  card: {
    boxShadow: theme.shadows[4],
  },
  description: {
    marginTop: theme.spacing(2),
  },
  dot: {
    position: 'absolute',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    zIndex: 10,
  },
});

function SiteDetailsPage(props) {
  const { classes, site, anchors, numAssets } = props;

  const [estimatedPosition, setEstimatedPosition] = useState(null);

  console.log("Estimated Position:", estimatedPosition);

  const transmitterSerialNumbers = anchors.map(anchor => anchor.uid);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);
  //const [showViewSitePage, setShowViewSitePage] = useState(false);

  const maxX = Math.max(...anchors.map(anchor => anchor.x));
  const maxY = Math.max(...anchors.map(anchor => anchor.y));

  

  useEffect(() => {
    document.title = `${site?.name || 'Site'} Details`;
    smoothScrollTop();
    //console.log("SiteDetailsPage executed");
    console.log("Received site data:", site);

    const intervalId = setInterval(() => {
      setEstimatedPosition(estimatedPosition); // Replace this with your logic to fetch the estimated position
    }, 5000);

    return () => clearInterval(intervalId);

  }, [site, estimatedPosition]);

  if (!site) {
    // Handle case when site is not found
    return (
      <Box className={classes.wrapper} display="flex" justifyContent="center">
        <Typography variant="h6">Site not found</Typography>
      </Box>
    );
  }

  console.log("Site Path: ", site.src);

  return (
    <Box className={classes.wrapper} display="flex" justifyContent="center">
      <div className={classes.blogContentWrapper}>
        <Grid container spacing={5}>
          <Grid item md={9}>
            <Card className={classes.card}>
            <Trilateration onPositionUpdate={setEstimatedPosition} anchors={anchors} transmitterSerialNumbers={transmitterSerialNumbers} numAssets={numAssets}/>
              <Box pt={3} pr={3} pl={3} pb={2}>
                <Typography variant="h4">
                  <b>{site.name}</b>
                </Typography>
              </Box>
              <div className={classes.imgContainer}>
              <ZoomImage className={classes.img} src={site.src} 
              onLoad={(e) => {
                setImageWidth(e.target.naturalWidth);
                setImageHeight(e.target.naturalHeight);
              }}
              />
              
              {estimatedPosition && estimatedPosition.tagPositions.map((position, index) => {
                
                // Array of colors
                const colors = ['red', 'blue', 'green', 'yellow']; // Add more colors as needed

                // Get the color based on index
                const color = colors[index % colors.length]; // Use modulo to cycle through colors

                return (
                <div
                key={index}
                className={classes.dot}
                style={{
                  left: `${Math.min(Math.max(position[0] * 100 / maxX, 5), 95)}%`,
                  top: `${Math.min(Math.max(position[1] * 100 / maxY, 5), 95)}%`,
                  
                  backgroundColor: color, // Assign color
                  
                }}
              ></div>
              );
            })}
            
            {/* Plotting anchors */}
            {anchors.map((anchor, index) => (
              <div
                key={index}
                
                style={{
                  left: `${(anchor.x )* imageWidth}px`,
                  top: `${(anchor.y )* imageHeight}px`
                }}
              ></div>
            ))}
            </div>
              <Box p={3} className={classes.description}>
              <Typography variant="body1">{site.description}</Typography>
              </Box>
            </Card>
          </Grid>
          
          {/* You may add additional content here */}
        </Grid>
        {/*<AddPost updateAnchors={updateAnchors} updateNumAssets = {updateNumAssets} />*/}
      </div>
    </Box>
  );
}

SiteDetailsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  site: PropTypes.object.isRequired,
  anchors: PropTypes.elementType,
  numAssets: PropTypes.elementType,
  //otherArticles: PropTypes.arrayOf(PropTypes.object).isRequired,
};

export default withStyles(styles, { withTheme: true })(SiteDetailsPage);
