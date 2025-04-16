import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Chip,
  Avatar,
  Button,
  TextField,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress
} from '@mui/material';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import moment from 'moment';
import { useAuth } from '../contexts/AuthContext';
import io from 'socket.io-client';

function PostDetail() {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const socket = io('http://localhost:5001');
    
    socket.on('comment_added', (data) => {
      if (data.postId === id) {
        setPost(prevPost => ({
          ...prevPost,
          comments: [...prevPost.comments, data.comment]
        }));
      }
    });

    return () => socket.disconnect();
  }, [id]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/posts/${id}`);
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching post:', error);
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, navigate]);

  const handleLike = async () => {
    try {
      const response = await axios.put(`http://localhost:5001/api/posts/${id}/like`);
      setPost(response.data);
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:5001/api/posts/${id}/comments`, {
        text: comment
      });
      setPost(response.data);
      setComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom>
          {post.title}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar src={post.author.profilePicture} sx={{ mr: 1 }}>
            {post.author.username[0]}
          </Avatar>
          <Typography variant="subtitle1" color="text.secondary">
            by {post.author.username} • {moment(post.createdAt).fromNow()}
          </Typography>
        </Box>
        <Box sx={{ mb: 3 }}>
          {post.tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
        <Typography variant="body1" paragraph>
          {post.content}
        </Typography>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Button
            onClick={handleLike}
            variant="outlined"
            color={post.likes.includes(user?._id) ? "secondary" : "primary"}
            disabled={!user}
          >
            {post.likes.length} Likes
          </Button>
        </Box>
        <Divider sx={{ my: 3 }} />
        <Typography variant="h6" gutterBottom>
          Comments ({post.comments.length})
        </Typography>
        {user && (
          <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Add a comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
              multiline
              rows={2}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{ mt: 1 }}
            >
              Post Comment
            </Button>
          </Box>
        )}
        <List>
          {post.comments.map((comment, index) => (
            <ListItem key={index} alignItems="flex-start">
              <ListItemAvatar>
                <Avatar src={comment.user.profilePicture}>
                  {comment.user.username[0]}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography component="span" variant="subtitle2">
                    {comment.user.username} • {moment(comment.createdAt).fromNow()}
                  </Typography>
                }
                secondary={comment.text}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Container>
  );
}

export default PostDetail; 