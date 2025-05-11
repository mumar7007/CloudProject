import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Grid,
  Chip,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import { useContent } from '../../contexts/ContentContext';
import { useAuth } from '../../contexts/AuthContext';
import { contentAPI } from '../../services/api';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ContentView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const { loading, error, deleteContent } = useContent();
  const [content, setContent] = useState(null);
  const [localLoading, setLocalLoading] = useState(true);
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLocalLoading(true);
        setLocalError('');
        const response = await contentAPI.getById(id);
        setContent(response.data);
      } catch (error) {
        setLocalError(error.response?.data?.message || 'Error fetching content');
        console.error('Error fetching content:', error);
      } finally {
        setLocalLoading(false);
      }
    };

    fetchContent();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this content?')) {
      try {
        await deleteContent(id);
        navigate('/dashboard');
      } catch (error) {
        setLocalError(error.response?.data?.message || 'Error deleting content');
        console.error('Error deleting content:', error);
      }
    }
  };

  if (loading || localLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || localError) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error || localError}</Alert>
      </Container>
    );
  }

  if (!content) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="info">Content not found</Alert>
      </Container>
    );
  }

  const isOwner = currentUser && content.userId === currentUser.id;
  const isAdmin = currentUser && currentUser.role === 'admin';

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{ mb: 2 }}
          >
            Back
          </Button>

          {(isOwner || isAdmin) && (
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => navigate(`/content/edit/${id}`)}
              >
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Box>
          )}
        </Box>

        <Typography variant="h4" component="h1" gutterBottom>
          {content.title}
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Chip
            label={content.status}
            color={content.status === 'published' ? 'success' : 'default'}
            sx={{ mr: 1 }}
          />
          <Chip label={content.contentType} sx={{ mr: 1 }} />
          <Chip label={content.ageGroup} sx={{ mr: 1 }} />
          <Chip label={content.classLevel} />
        </Box>

        <Divider sx={{ my: 3 }} />

        <Typography variant="body1" paragraph>
          {content.description}
        </Typography>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Category
            </Typography>
            <Typography variant="body1">{content.category}</Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="subtitle2" color="textSecondary">
              Area
            </Typography>
            <Typography variant="body1">{content.area}</Typography>
          </Grid>
        </Grid>

        {content.fileUrl && (
          <Box sx={{ mt: 4 }}>
            <Typography variant="h6" gutterBottom>
              Content
            </Typography>
            {content.contentType === 'video' && (
              <video
                controls
                width="100%"
                src={content.fileUrl}
                style={{ maxHeight: '500px' }}
              />
            )}
            {content.contentType === 'image' && (
              <img
                src={content.fileUrl}
                alt={content.title}
                style={{ maxWidth: '100%', maxHeight: '500px' }}
              />
            )}
            {content.contentType === 'document' && (
              <iframe
                src={content.fileUrl}
                width="100%"
                height="500px"
                title={content.title}
              />
            )}
            {content.contentType === 'link' && (
              <Button
                variant="contained"
                href={content.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Link
              </Button>
            )}
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ContentView; 