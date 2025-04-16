import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  Box
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const CreatePost = ({ onCreatePost }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState({
    title: '',
    content: '',
    tags: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newPost = {
      id: Date.now(),
      title: post.title,
      content: post.content,
      tags: post.tags.split(',').map(tag => tag.trim()).filter(Boolean),
      author: {
        id: user.id,
        name: user.username,
        avatar: user.profilePic || `https://ui-avatars.com/api/?name=${user.username}`
      },
      likes: [],
      comments: [],
      createdAt: new Date().toISOString()
    };

    onCreatePost(newPost);
    navigate('/home');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Card>
        <CardContent>
          <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h4" gutterBottom>
              Create New Post
            </Typography>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={post.title}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Content"
                name="content"
                value={post.content}
                onChange={handleChange}
                required
              />
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                name="tags"
                value={post.tags}
                onChange={handleChange}
                helperText="Example: react, javascript, webdev"
              />
              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={!post.title.trim() || !post.content.trim()}
                >
                  Publish Post
                </Button>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/home')}
                >
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default CreatePost; 