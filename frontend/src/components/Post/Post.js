import React from 'react';
import { Card, CardContent, CardActions, Typography, IconButton, Avatar, Box, Chip } from '@mui/material';
import { ThumbUp, Comment, Delete, Edit } from '@mui/icons-material';
import './Post.css';

const Post = ({ post, onLike, onDelete, onEdit, currentUser }) => {
  const { title, content, author, date, tags, likes, comments } = post;

  return (
    <Card className="post-card">
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={author.profilePic} alt={author.name} />
          <Box ml={2}>
            <Typography variant="subtitle1" component="span" fontWeight="bold">
              {author.name}
            </Typography>
            <Typography variant="caption" color="textSecondary" display="block">
              {new Date(date).toLocaleDateString('en-US', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </Typography>
          </Box>
        </Box>

        <Typography variant="h5" component="h2" gutterBottom>
          {title}
        </Typography>

        <Typography variant="body1" color="textSecondary" paragraph>
          {content}
        </Typography>

        <Box display="flex" flexWrap="wrap" gap={1} mb={2}>
          {tags.map((tag, index) => (
            <Chip
              key={index}
              label={tag}
              size="small"
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </CardContent>

      <CardActions disableSpacing>
        <IconButton onClick={() => onLike(post.id)} color={likes.includes(currentUser?.id) ? "primary" : "default"}>
          <ThumbUp />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {likes.length}
          </Typography>
        </IconButton>

        <IconButton>
          <Comment />
          <Typography variant="caption" sx={{ ml: 1 }}>
            {comments.length}
          </Typography>
        </IconButton>

        {currentUser?.id === author.id && (
          <>
            <IconButton onClick={() => onEdit(post.id)} color="primary">
              <Edit />
            </IconButton>
            <IconButton onClick={() => onDelete(post.id)} color="error">
              <Delete />
            </IconButton>
          </>
        )}
      </CardActions>
    </Card>
  );
};

export default Post; 