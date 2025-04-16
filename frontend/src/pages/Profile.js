import React, { useState } from 'react';
import {
  Container,
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Grid,
  Stack,
  Divider
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put('/api/auth/profile', formData);
      setUser({ ...user, ...response.data });
      setIsEditing(false);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Section */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Avatar
                  src={user?.avatar}
                  alt={user?.name}
                  sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
                />
                <Typography variant="h5" gutterBottom>
                  {user?.name}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 2 }}>
                  {user?.bio}
                </Typography>
                <Button
                  startIcon={<EditIcon />}
                  onClick={() => setIsEditing(true)}
                  variant="outlined"
                >
                  Edit Profile
                </Button>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Stack spacing={1}>
                <Typography variant="body2">
                  <strong>Posts:</strong> {user?.posts?.length || 0}
                </Typography>
                <Typography variant="body2">
                  <strong>Joined:</strong> {new Date(user?.createdAt).toLocaleDateString()}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Edit Profile Form / Posts Section */}
        <Grid item xs={12} md={8}>
          {isEditing ? (
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Edit Profile
                </Typography>
                {error && (
                  <Typography color="error" sx={{ mb: 2 }}>
                    {error}
                  </Typography>
                )}
                <Box component="form" onSubmit={handleSubmit}>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Bio"
                    name="bio"
                    multiline
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Avatar URL"
                    name="avatar"
                    value={formData.avatar}
                    onChange={handleChange}
                    sx={{ mb: 3 }}
                  />
                  <Stack direction="row" spacing={2}>
                    <Button variant="contained" type="submit">
                      Save Changes
                    </Button>
                    <Button variant="outlined" onClick={() => setIsEditing(false)}>
                      Cancel
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Stack spacing={3}>
              <Typography variant="h6">My Posts</Typography>
              {user?.posts?.map((post) => (
                <Card key={post.id}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {post.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 1 }}>
                      {new Date(post.createdAt).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      {post.content.substring(0, 200)}...
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      {post.tags.map((tag) => (
                        <Typography
                          key={tag}
                          variant="caption"
                          sx={{
                            bgcolor: 'primary.light',
                            color: 'primary.contrastText',
                            px: 1,
                            py: 0.5,
                            borderRadius: 1
                          }}
                        >
                          {tag}
                        </Typography>
                      ))}
                    </Stack>
                  </CardContent>
                </Card>
              ))}
            </Stack>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 