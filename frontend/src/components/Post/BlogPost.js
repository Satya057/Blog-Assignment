import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Stack,
  Chip,
  Divider,
  IconButton
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

const BlogPost = ({ post, currentUser, onLike, onComment, onEdit, onDelete }) => {
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(post?.likes?.includes(currentUser?.id));
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState({
    title: post?.title || '',
    content: post?.content || '',
    tags: post?.tags || []
  });

  const handleLike = () => {
    setIsLiked(!isLiked);
    onLike && onLike(post.id);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      onComment && onComment(post.id, comment);
      setComment('');
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedPost({
      title: post.title,
      content: post.content,
      tags: post.tags
    });
  };

  const handleSaveEdit = () => {
    if (editedPost.title.trim() && editedPost.content.trim()) {
      onEdit && onEdit(post.id, editedPost);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedPost({
      title: post.title,
      content: post.content,
      tags: post.tags
    });
  };

  const isAuthor = currentUser?.id === post?.author?.id;

  if (!post) return null;

  return (
    <Card sx={{ maxWidth: 800, mx: 'auto', my: 4 }}>
      <CardContent>
        {isEditing ? (
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              label="Title"
              value={editedPost.title}
              onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Content"
              multiline
              rows={4}
              value={editedPost.content}
              onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label="Tags (comma separated)"
              value={editedPost.tags.join(', ')}
              onChange={(e) => setEditedPost({ 
                ...editedPost, 
                tags: e.target.value.split(',').map(tag => tag.trim()).filter(Boolean)
              })}
              sx={{ mb: 2 }}
            />
            <Stack direction="row" spacing={2}>
              <Button variant="contained" onClick={handleSaveEdit}>
                Save Changes
              </Button>
              <Button variant="outlined" onClick={handleCancelEdit}>
                Cancel
              </Button>
            </Stack>
          </Box>
        ) : (
          <>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {post.title}
              </Typography>
              {isAuthor && (
                <Stack direction="row" spacing={1}>
                  <IconButton onClick={handleEdit} size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => onDelete && onDelete(post.id)} size="small" color="error">
                    <DeleteIcon />
                  </IconButton>
                </Stack>
              )}
            </Box>
            
            <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
              <Avatar src={post.author.avatar} alt={post.author.name} />
              <Box>
                <Typography variant="subtitle1">{post.author.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {new Date(post.createdAt).toLocaleDateString()}
                </Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
              {post.tags.map((tag) => (
                <Chip key={tag} label={tag} size="small" />
              ))}
            </Stack>

            <Typography variant="body1" sx={{ mb: 3 }}>
              {post.content}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
              <IconButton onClick={handleLike} color={isLiked ? 'primary' : 'default'}>
                {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </IconButton>
              <Typography>{post.likes?.length || 0} likes</Typography>
            </Stack>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom>
              Comments ({post.comments?.length || 0})
            </Typography>

            <Box component="form" onSubmit={handleComment} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                multiline
                rows={2}
                placeholder="Write a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                sx={{ mb: 1 }}
              />
              <Button variant="contained" type="submit" disabled={!comment.trim()}>
                Post Comment
              </Button>
            </Box>

            <Stack spacing={2}>
              {post.comments?.map((comment) => (
                <Card key={comment.id} variant="outlined">
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                      <Avatar src={comment.author.avatar} alt={comment.author.name} />
                      <Box>
                        <Typography variant="subtitle2">{comment.author.name}</Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </Typography>
                      </Box>
                    </Stack>
                    <Typography variant="body2">{comment.content}</Typography>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default BlogPost; 