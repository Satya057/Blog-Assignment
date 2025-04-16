import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Add as AddIcon, Search as SearchIcon } from '@mui/icons-material';
import Post from '../components/Post/Post';

const Home = () => {
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: 'Getting Started with MERN Stack',
      content: 'The MERN stack consists of MongoDB, Express.js, React, and Node.js...',
      author: {
        id: 1,
        name: 'John Doe',
        profilePic: 'https://ui-avatars.com/api/?name=John+Doe'
      },
      date: new Date().toISOString(),
      tags: ['MERN', 'Web Development', 'Tutorial'],
      likes: [],
      comments: []
    }
  ]);

  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const currentUser = {
    id: 1,
    name: 'John Doe',
    profilePic: 'https://ui-avatars.com/api/?name=John+Doe'
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setNewPost({ title: '', content: '', tags: '' });
  };

  const handleCreatePost = () => {
    const post = {
      id: posts.length + 1,
      ...newPost,
      tags: newPost.tags.split(',').map(tag => tag.trim()),
      author: currentUser,
      date: new Date().toISOString(),
      likes: [],
      comments: []
    };
    setPosts([post, ...posts]);
    handleClose();
  };

  const handleLike = (postId) => {
    setPosts(posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(currentUser.id)
          ? post.likes.filter(id => id !== currentUser.id)
          : [...post.likes, currentUser.id];
        return { ...post, likes };
      }
      return post;
    }));
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Blog Posts
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleOpen}
        >
          Create Post
        </Button>
      </Box>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search posts..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        sx={{ mb: 4 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          )
        }}
      />

      <Grid container spacing={3}>
        {filteredPosts.map(post => (
          <Grid item xs={12} key={post.id}>
            <Post
              post={post}
              onLike={handleLike}
              onDelete={handleDelete}
              currentUser={currentUser}
            />
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            fullWidth
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tags (comma-separated)"
            fullWidth
            value={newPost.tags}
            onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
            helperText="Enter tags separated by commas (e.g., MERN, JavaScript, Web)"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleCreatePost} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Home; 