import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress
} from '@mui/material';
import { useContent } from '../../contexts/ContentContext';
import {
  AGE_GROUPS,
  CLASS_LEVELS,
  CONTENT_CATEGORIES,
  AREAS
} from '../../data/contentTypes';

function ContentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createContent, updateContent, loading, error } = useContent();
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: 'document',
    ageGroup: '',
    classLevel: '',
    category: '',
    area: '',
    status: 'draft'
  });

  useEffect(() => {
    if (id) {
      // Fetch content data if editing
      // This will be implemented when we add the getContentById function
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (id) {
        await updateContent(id, formData, file);
      } else {
        await createContent(formData, file);
      }
      navigate('/dashboard');
    } catch (error) {
      console.error('Error saving content:', error);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Edit Content' : 'Create New Content'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={4}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Content Type</InputLabel>
                <Select
                  name="contentType"
                  value={formData.contentType}
                  onChange={handleChange}
                  label="Content Type"
                  required
                >
                  <MenuItem value="video">Video</MenuItem>
                  <MenuItem value="document">Document</MenuItem>
                  <MenuItem value="image">Image</MenuItem>
                  <MenuItem value="link">Link</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Age Group</InputLabel>
                <Select
                  name="ageGroup"
                  value={formData.ageGroup}
                  onChange={handleChange}
                  label="Age Group"
                  required
                >
                  {AGE_GROUPS.map((age) => (
                    <MenuItem key={age} value={age}>
                      {age}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Class Level</InputLabel>
                <Select
                  name="classLevel"
                  value={formData.classLevel}
                  onChange={handleChange}
                  label="Class Level"
                  required
                >
                  {CLASS_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>
                      {level}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Category</InputLabel>
                <Select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  label="Category"
                  required
                >
                  {CONTENT_CATEGORIES.map((category) => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Area</InputLabel>
                <Select
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  label="Area"
                  required
                >
                  {AREAS.map((area) => (
                    <MenuItem key={area} value={area}>
                      {area}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                  required
                >
                  <MenuItem value="draft">Draft</MenuItem>
                  <MenuItem value="published">Published</MenuItem>
                  <MenuItem value="archived">Archived</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="contained"
                component="label"
                fullWidth
              >
                Upload File
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
              {file && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Selected file: {file.name}
                </Typography>
              )}
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/dashboard')}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                >
                  {loading ? (
                    <CircularProgress size={24} />
                  ) : (
                    id ? 'Update Content' : 'Create Content'
                  )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
}

export default ContentForm; 