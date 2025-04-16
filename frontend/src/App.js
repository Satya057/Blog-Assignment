import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  Card,
  CardContent,
  Button,
  TextField,
  Stack,
  Box,
  IconButton,
  Avatar,
  Chip,
  Grid,
  Divider
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import CreatePost from './pages/CreatePost';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
      contrastText: '#fff'
    },
    secondary: {
      main: '#FFD700',
      light: '#FFE54C',
      dark: '#C8A600',
      contrastText: '#000'
    },
    tertiary: {
      main: '#654321',
      light: '#8B5E3C',
      dark: '#3E2723',
      contrastText: '#fff'
    },
    background: {
      default: '#F5F5F5',
      paper: '#FFFFFF'
    },
    text: {
      primary: '#2C2C2C',
      secondary: '#616161'
    }
  },
  typography: {
    fontFamily: '"Segoe UI", "Roboto", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: '2.5rem'
    },
    h2: {
      fontWeight: 600,
      fontSize: '2rem'
    },
    h3: {
      fontWeight: 600,
      fontSize: '1.75rem'
    },
    h4: {
      fontWeight: 600,
      fontSize: '1.5rem'
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.25rem'
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem'
    },
    button: {
      textTransform: 'none',
      fontWeight: 600
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
          fontSize: '1rem',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
          }
        },
        contained: {
          '&:hover': {
            backgroundColor: '#43A047'
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(0,0,0,0.1)'
          }
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '&:hover fieldset': {
              borderColor: '#4CAF50'
            }
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#4CAF50',
          boxShadow: 'none'
        }
      }
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(0, 0, 0, 0.08)'
        }
      }
    }
  },
  shape: {
    borderRadius: 8
  },
  shadows: [
    'none',
    '0 2px 4px rgba(0,0,0,0.05)',
    '0 4px 8px rgba(0,0,0,0.05)',
    '0 6px 12px rgba(0,0,0,0.05)',
    // ... rest of the shadows array
  ]
});

// Sample initial data
const initialPosts = [
  {
    id: 1,
    title: "Getting Started with React",
    content: "React is a powerful JavaScript library for building user interfaces...",
    author: {
      id: 1,
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe"
    },
    tags: ["react", "javascript", "webdev"],
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  },
  {
    id: 2,
    title: "Understanding JavaScript Promises",
    content: "Promises are a fundamental concept in modern JavaScript...",
    author: {
      id: 1,
      name: "John Doe",
      avatar: "https://ui-avatars.com/api/?name=John+Doe"
    },
    tags: ["javascript", "async", "programming"],
    likes: [],
    comments: [],
    createdAt: new Date().toISOString()
  }
];

function BlogHome({ posts, onCreatePost, onEditPost, onDeletePost }) {
  const { user } = useAuth();
  const [selectedPost, setSelectedPost] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedPost, setEditedPost] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");

  // Get all unique tags
  const allTags = [...new Set(posts.flatMap(post => post.tags))];

  // Filter posts based on search and tags
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || post.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  // Handle post editing
  const handleEdit = (post) => {
    setEditedPost({ ...post });
    setIsEditing(true);
    setSelectedPost(null);
  };

  // Handle post saving
  const handleSave = () => {
    if (editedPost) {
      onEditPost(editedPost);
      setIsEditing(false);
      setEditedPost(null);
    }
  };

  // Handle post deletion
  const handleDelete = (postId) => {
    onDeletePost(postId);
    setSelectedPost(null);
  };

  // Handle post liking
  const handleLike = (postId) => {
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const likes = post.likes.includes(user.id)
          ? post.likes.filter(id => id !== user.id)
          : [...post.likes, user.id];
        return { ...post, likes };
      }
      return post;
    });
    onEditPost(updatedPosts.find(p => p.id === postId));
  };

  // Handle commenting
  const handleComment = (postId) => {
    if (!newComment.trim()) return;
    
    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: Date.now(),
          content: newComment,
          author: {
            id: user.id,
            name: user.username,
            avatar: user.profilePic || `https://ui-avatars.com/api/?name=${user.username}`
          },
          createdAt: new Date().toISOString()
        };
        return { ...post, comments: [...post.comments, newCommentObj] };
      }
      return post;
    });
    onEditPost(updatedPosts.find(p => p.id === postId));
    setNewComment("");
  };

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Search and Filter Section */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1 }}>
          <Chip
            label="All"
            onClick={() => setSelectedTag("")}
            color={selectedTag === "" ? "primary" : "default"}
          />
          {allTags.map(tag => (
            <Chip
              key={tag}
              label={tag}
              onClick={() => setSelectedTag(tag)}
              color={selectedTag === tag ? "primary" : "default"}
            />
          ))}
        </Stack>
      </Box>

      {/* Edit Post Form */}
      {isEditing && editedPost && (
        <Card sx={{ mb: 4 }}>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Title"
                value={editedPost.title}
                onChange={(e) => setEditedPost({ ...editedPost, title: e.target.value })}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content"
                value={editedPost.content}
                onChange={(e) => setEditedPost({ ...editedPost, content: e.target.value })}
              />
              <TextField
                fullWidth
                label="Tags (comma-separated)"
                value={editedPost.tags.join(", ")}
                onChange={(e) => setEditedPost({
                  ...editedPost,
                  tags: e.target.value.split(",").map(tag => tag.trim()).filter(Boolean)
                })}
              />
              <Stack direction="row" spacing={2}>
                <Button variant="contained" onClick={handleSave}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => {
                  setIsEditing(false);
                  setEditedPost(null);
                }}>
                  Cancel
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Posts Grid */}
      {!isEditing && (
        <Grid container spacing={3}>
          {filteredPosts.map(post => (
            <Grid item xs={12} key={post.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h5" component="h2">
                      {post.title}
                    </Typography>
                    {post.author.id === user.id && (
                      <Stack direction="row" spacing={1}>
                        <IconButton size="small" onClick={() => handleEdit(post)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton size="small" onClick={() => handleDelete(post.id)}>
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

                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {post.content}
                  </Typography>

                  <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                    {post.tags.map(tag => (
                      <Chip key={tag} label={tag} size="small" />
                    ))}
                  </Stack>

                  <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                    <IconButton
                      onClick={() => handleLike(post.id)}
                      color={post.likes.includes(user.id) ? "primary" : "default"}
                    >
                      {post.likes.includes(user.id) ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderIcon />
                      )}
                    </IconButton>
                    <Typography>{post.likes.length} likes</Typography>
                  </Stack>

                  <Divider sx={{ my: 2 }} />

                  {/* Comments Section */}
                  <Typography variant="h6" gutterBottom>
                    Comments ({post.comments.length})
                  </Typography>

                  <Box component="form" onSubmit={(e) => {
                    e.preventDefault();
                    handleComment(post.id);
                  }} sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      multiline
                      rows={2}
                      placeholder="Write a comment..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      sx={{ mb: 1 }}
                    />
                    <Button
                      variant="contained"
                      type="submit"
                      disabled={!newComment.trim()}
                    >
                      Post Comment
                    </Button>
                  </Box>

                  <Stack spacing={2}>
                    {post.comments.map(comment => (
                      <Card key={comment.id} variant="outlined">
                        <CardContent>
                          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <Avatar
                              src={comment.author.avatar}
                              alt={comment.author.name}
                              sx={{ width: 32, height: 32 }}
                            />
                            <Box>
                              <Typography variant="subtitle2">
                                {comment.author.name}
                              </Typography>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}

function App() {
  const [posts, setPosts] = useState(initialPosts);

  const handleCreatePost = (newPost) => {
    setPosts(prevPosts => [newPost, ...prevPosts]);
  };

  const handleEditPost = (editedPost) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === editedPost.id ? editedPost : post
      )
    );
  };

  const handleDeletePost = (postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  };

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Navbar />
          <Routes>
            <Route 
              path="/home" 
              element={
                <BlogHome 
                  posts={posts}
                  onCreatePost={handleCreatePost}
                  onEditPost={handleEditPost}
                  onDeletePost={handleDeletePost}
                />
              } 
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route 
              path="/create-post" 
              element={<CreatePost onCreatePost={handleCreatePost} />} 
            />
            <Route path="/" element={<Navigate to="/login" />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
