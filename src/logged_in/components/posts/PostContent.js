
import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { Grid, TablePagination, Divider, Toolbar, Typography, Button, Paper, Box } from "@mui/material";
import withStyles from '@mui/styles/withStyles';
import axios from "axios";
import DeleteIcon from "@mui/icons-material/Delete";
import SelfAligningImage from "../../../shared/components/SelfAligningImage";
import HighlightedInformation from "../../../shared/components/HighlightedInformation";
import ConfirmationDialog from "../../../shared/components/ConfirmationDialog";

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

  const [page, setPage] = useState(0);
  const [isDeletePostDialogOpen, setIsDeletePostDialogOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isDeletePostDialogLoading, setIsDeletePostDialogLoading] = useState(false);
  const [postDetails, setPostDetails] = useState(null);


  useEffect(() => {
    

    const fetchPosts = async () => {
      try {
        const response = await axios.get('https://uwb-backend.onrender.com/sites', {
          params: {
            email: localStorage.getItem('email')
          }
        });

        const formattedPosts = response.data.map((item, index) => ({
          id: index,
          src: item.imageUrl,
          name: item.name,
        }));

        setPosts(formattedPosts);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchPosts();
  }, [setPosts]);

  const closeDeletePostDialog = useCallback(() => {
    setIsDeletePostDialogOpen(false);
    setIsDeletePostDialogLoading(false);
    setPostToDelete(null);
  }, []);

  const deletePost = useCallback(async () => {
    if (!postToDelete) return;

    setIsDeletePostDialogLoading(true);

    try {
      const response = await axios.delete(`https://uwb-backend.onrender.com/sites`, {
        params: {
          name: postToDelete.name,
          email: localStorage.getItem('email')
        }
      });

      if (response.status === 200) {
        const updatedPosts = posts.filter((p) => p.id !== postToDelete.id);
        setPosts(updatedPosts);
        pushMessageToSnackbar({
          text: "Your site has been deleted",
        });
      } else {
        pushMessageToSnackbar({
          text: "Failed to delete the site",
        });
      }
    } catch (error) {
      console.error('Error deleting data:', error);
      pushMessageToSnackbar({
        text: "Error deleting the site",
      });
    } finally {
      closeDeletePostDialog();
      setIsDeletePostDialogLoading(false);
    }
  }, [postToDelete, posts, setPosts, pushMessageToSnackbar, closeDeletePostDialog]);

  const onDelete = useCallback((post) => {
    setPostToDelete(post);
    setIsDeletePostDialogOpen(true);
  }, []);

  const handleChangePage = useCallback((__, page) => {
    setPage(page);
  }, []);

  const navigateToSiteDetails = useCallback(async (post) => {
    onSiteClick(post);

    try {
      const response = await axios.get('https://uwb-backend.onrender.com/sitesDetail', {
        params: {
          email: localStorage.getItem('email'),
          name: post.name
          
        }
      });
      console.log(response.data)
      
      setPostDetails(response.data);
    } catch (error) {
      console.error('Error fetching post details:', error);
    }
  }, [onSiteClick]);

  const handleImageClick = useCallback((post) => {
    navigateToSiteDetails(post);
  }, [navigateToSiteDetails]);

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
                    onImageClick={() => handleImageClick(post)}
                    onTitleClick={() => handleTitleClick(post)}
                    options={[
                      {
                        name: "Delete",
                        onClick: () => onDelete(post),
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
      {postDetails && (
        <Box p={2}>
          <Typography variant="h6">Post Details</Typography>
          <Typography variant="body1">{postDetails.content}</Typography>
        </Box>
      )}
    </Paper>
  );
}

PostContent.propTypes = {
  openAddPostModal: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  posts: PropTypes.arrayOf(PropTypes.object).isRequired,
  setPosts: PropTypes.func.isRequired,
  pushMessageToSnackbar: PropTypes.func,
  onSiteClick: PropTypes.func.isRequired,
};

export default withStyles(styles)(PostContent);
