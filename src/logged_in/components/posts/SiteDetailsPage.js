import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Box, Typography, Grid, Card } from "@mui/material";
//import { Link } from 'react-router-dom';
import withStyles from "@mui/styles/withStyles";
import ZoomImage from "../../../shared/components/ZoomImage";
import smoothScrollTop from "../../../shared/functions/smoothScrollTop";
import Trilateration from './Trilateration';
//import BlogCard from "../../../logged_out/components/blog/BlogCard";
//import Posts from "./Posts";
import BlogCard from "../../../logged_out/components/blog/BlogCard";
//import BlogCard from "../../../logged_out/components/blog/BlogCard";
//import PostContent from "./PostContent";


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
    position: "relative",
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
  const { onSiteClick, classes, site, anchors = [], numAssets = [], otherArticles = [] } = props;

  const [estimatedPosition, setEstimatedPosition] = useState(null);

  const transmitterSerialNumbers = anchors.map(anchor => anchor.uid);
  const [imageWidth, setImageWidth] = useState(0);
  const [imageHeight, setImageHeight] = useState(0);

  const maxX = Math.max(...anchors.map(anchor => anchor.x));
  const maxY = Math.max(...anchors.map(anchor => anchor.y));


  const siteSelection = useCallback((site) => {
    //console.log("ID in PC:"+ postId);
    onSiteClick(site);
    console.log("Site Data:", site);
    //console.log("Site Clicked");
    //history.push(`/site/${post.id}`);
    //history.replace(`./posts/${post.id}`);
  }, [onSiteClick]);

  useEffect(() => {
    document.title = `${site?.name || 'Site'} Details`;
    smoothScrollTop();

    const intervalId = setInterval(() => {
      setEstimatedPosition(estimatedPosition);
    }, 5000);

    return () => clearInterval(intervalId);
  }, [site, estimatedPosition]);

  if (!site) {
    return (
      <Box className={classes.wrapper} display="flex" justifyContent="center">
        <Typography variant="h6">Site not found</Typography>
      </Box>
    );
  }

  // Filter out the current site from the list of other articles
  const filteredOtherArticles = otherArticles.filter(article => article.id !== site.id);

  return (
    <Box className={classes.wrapper} display="flex" justifyContent="center">
      <div className={classes.blogContentWrapper}>
        <Grid container spacing={5}>
          <Grid item md={9}>
            <Card className={classes.card}>
              <Trilateration 
                onPositionUpdate={setEstimatedPosition} 
                anchors={anchors} 
                transmitterSerialNumbers={transmitterSerialNumbers} 
                numAssets={numAssets} 
              />
              <Box pt={3} pr={3} pl={3} pb={2}>
                <Typography variant="h4">
                  <b>{site.name}</b>
                </Typography>
              </Box>
              <div className={classes.imgContainer}>
                <ZoomImage 
                  className={classes.img} 
                  src={site.src} 
                  onLoad={(e) => {
                    setImageWidth(e.target.naturalWidth);
                    setImageHeight(e.target.naturalHeight);
                  }} 
                />
                {estimatedPosition && estimatedPosition.tagPositions.map((position, index) => {
                  const colors = ['red', 'blue', 'green', 'yellow'];
                  const color = colors[index % colors.length];
                  return (
                    <div
                      key={index}
                      className={classes.dot}
                      style={{
                        left: `${Math.min(Math.max(position[0] * 100 / maxX, 5), 95)}%`,
                        top: `${Math.min(Math.max(position[1] * 100 / maxY, 5), 95)}%`,
                        backgroundColor: color,
                      }}
                    ></div>
                  );
                })}
                {anchors.map((anchor, index) => (
                  <div
                    key={index}
                    style={{
                      left: `${(anchor.x) * imageWidth}px`,
                      top: `${(anchor.y) * imageHeight}px`
                    }}
                  ></div>
                ))}
              </div>
              <Box p={3} className={classes.description}>
                <Typography variant="body1">{site.description}</Typography>
              </Box>
            </Card>
          </Grid>
          <Grid item md={3}>
            <Typography variant="h6" paragraph>
              More Sites
            </Typography>
            {filteredOtherArticles.map((site) => (
              <Box key={site.id} mb={3}>
                
                <BlogCard
                  title={site.name}
                  //description={site.description}
                  //date={blogPost.date}
                  src={`${site.src}`}
                  onSiteClick={() => siteSelection(site)}
                />
                
              </Box>
            ))}
          </Grid>
        </Grid>
      </div>
    </Box>
  );
}

SiteDetailsPage.propTypes = {
  classes: PropTypes.object.isRequired,
  site: PropTypes.object,
  anchors: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired,
    })
  ),
  numAssets: PropTypes.array,
  otherArticles: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      discription: PropTypes.string,
      //date: PropTypes.string,
      src: PropTypes.string,
      //params: PropTypes.string,
    })
  ),
};

export default withStyles(styles, { withTheme: true })(SiteDetailsPage);
