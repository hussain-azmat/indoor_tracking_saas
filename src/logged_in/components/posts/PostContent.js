import React, { useState, useCallback } from "react";
import PropTypes from "prop-types";
//import { useHistory } from 'react-router-dom';
import { Grid, TablePagination, Divider, Toolbar, Typography, Button, Paper, Box } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import DeleteIcon from "@mui/icons-material/Delete";
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";
//import SiteItem from "./SiteItem"; // Assuming each site is rendered using a separate component

const styles = {
  dBlock: { display: "block" },
  dNone: { display: "none" },
  toolbar: {
    justifyContent: "space-between",
  },
};

const rowsPerPage = 25;


function PostContent(props) {
  const {
    pushMessageToSnackbar,
    setPosts,
    posts,
    openAddPostModal,
    classes,
    onSiteClick,
  } = props;

  //const history = useHistory();
  const [page, setPage] = useState(0);
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeletePostDialogLoading, setIsDeletePostDialogLoading] = useState(
    false
  );

  const closeDeletePostDialog = useCallback(() => {
    setIsDeletePostDialogOpen(false);
    setIsDeletePostDialogLoading(false);
    setPostToDelete(null);
  }, [setIsDeletePostDialogOpen, setIsDeletePostDialogLoading]);


  const deletePost = useCallback(() => {
    if (!postToDelete) return;

    setIsDeletePostDialogLoading(true);
    setTimeout(() => {
      const updatedPosts = posts.filter((p) => p.id !== postToDelete.id);
      setPosts(updatedPosts);
      pushMessageToSnackbar({
        text: "Your site has been deleted",
      });
      closeDeletePostDialog();
    }, 1500);
  }, [posts, setPosts, pushMessageToSnackbar, setIsDeletePostDialogLoading, closeDeletePostDialog, postToDelete]);

  
  const onDelete = useCallback((post) => {
    setPostToDelete(post); // Store the post to be deleted
    setIsDeletePostDialogOpen(true);
  }, [setIsDeletePostDialogOpen, setPostToDelete]);

  
  const handleChangePage = useCallback(
    (__, page) => {
      setPage(page);
    },
    [setPage]
  );
  
  
  const navigateToSiteDetails = useCallback((post) => {
    //console.log("ID in PC:"+ postId);
    onSiteClick(post);
    //history.push(`/site/${post.id}`);
    //history.replace(`./posts/${post.id}`);
  }, [onSiteClick]);

    // Click handler for the image
    const handleImageClick = useCallback((post) => {
      navigateToSiteDetails(post);
    }, [navigateToSiteDetails]);
  
    // Click handler for the title
    const handleTitleClick = useCallback((post) => {
      navigateToSiteDetails(post);
    }, [navigateToSiteDetails]);
  
  const printImageGrid = useCallback(() => {
    if (posts.length > 0) {
      return (
        <Box p={1}>
          <Grid container spacing={1}>
            {posts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((post) => (
                <Grid item xs={6} sm={4} md={3} key={post.id}>
                  
                  <SelfAligningImage
                    src={post.src}
                    title={post.name}
                    //onClick={() => navigateToSiteDetails(post)} // Add onClick event to handle post click
                    onImageClick={() => handleImageClick(post)}
                    onTitleClick={() => handleTitleClick(post)}

                    options={[
                      {
                        name: "Delete",
                        onClick: () => {
                          //e.stopPropagation(); // Prevent event propagation to the parent element
                          onDelete(post);
                        },
                        icon: <DeleteIcon />,
                      },
                    ]}
                  />
                </Grid>
              ))}
          </Grid>
        </Box>
      );
    }
    return (
      <Box m={2}>
        <HighlightedInformation>
          No sites added yet. Click on &quot;NEW&quot; to create your first one.
        </HighlightedInformation>
      </Box>
    );
  }, [posts, onDelete, page, handleImageClick, handleTitleClick]);

  return (
    <Paper>
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">Your Sites</Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={openAddPostModal}
          disableElevation
        >
          Add Site
        </Button>
      </Toolbar>
      <Divider />
      {printImageGrid()}
      <TablePagination
        component="div"
        count={posts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        backIconButtonProps={{
          "aria-label": "Previous Page",
        }}
        nextIconButtonProps={{
          "aria-label": "Next Page",
        }}
        onPageChange={handleChangePage}
        classes={{
          select: classes.dNone,
          selectIcon: classes.dNone,
          actions: posts.length > 0 ? classes.dBlock : classes.dNone,
          caption: posts.length > 0 ? classes.dBlock : classes.dNone,
        }}
        labelRowsPerPage=""
      />
      <ConfirmationDialog
        open={isDeletePostDialogOpen}
        title="Confirmation"
        content="Do you really want to delete the site?"
        onClose={closeDeletePostDialog}
        loading={isDeletePostDialogLoading}
        onConfirm={deletePost}
      />
    </Paper>
  );
}

PostContent.propTypes = {
  openAddPostModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPosts: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  onPostClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(PostContent);
