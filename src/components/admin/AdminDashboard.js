import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import {
  AGE_GROUPS,
  CLASS_LEVELS,
  CONTENT_CATEGORIES,
  CONTENT_TYPES,
  AREAS,
} from '../../data/contentTypes';

const AdminDashboard = () => {
  const [contents, setContents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingContent, setEditingContent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentType: '',
    link: '',
    ageGroup: '',
    classLevel: '',
    category: '',
    area: '',
    file: null,
  });
  const [error, setError] = useState('');

  const handleOpenDialog = (content = null) => {
    if (content) {
      setEditingContent(content);
      setFormData(content);
    } else {
      setEditingContent(null);
      setFormData({
        title: '',
        description: '',
        contentType: '',
        link: '',
        ageGroup: '',
        classLevel: '',
        category: '',
        area: '',
        file: null,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingContent(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setFormData((prev) => ({
        ...prev,
        file: file,
        contentType: CONTENT_TYPES.PDF,
        link: URL.createObjectURL(file),
      }));
      setError('');
    } else {
      setError('Please upload a PDF file');
      e.target.value = null;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.contentType === CONTENT_TYPES.PDF && !formData.file) {
      setError('Please upload a PDF file');
      return;
    }
    if (editingContent) {
      setContents((prev) =>
        prev.map((content) =>
          content.id === editingContent.id ? { ...formData, id: content.id } : content
        )
      );
    } else {
      setContents((prev) => [...prev, { ...formData, id: Date.now() }]);
    }
    handleCloseDialog();
  };

  const handleDelete = (id) => {
    setContents((prev) => prev.filter((content) => content.id !== id));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4 }}>
        <Typography variant="h4" component="h1">
          Admin Dashboard
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add Content
        </Button>
      </Box>

      <Grid container spacing={3}>
        {contents.map((content) => (
          <Grid item xs={12} sm={6} md={4} key={content.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {content.title}
                </Typography>
                <Typography variant="body2" color="textSecondary" paragraph>
                  {content.description}
                </Typography>
                <Typography variant="body2">
                  Type: {content.contentType}
                </Typography>
                <Typography variant="body2">
                  Age Group: {content.ageGroup}
                </Typography>
                <Typography variant="body2">
                  Class Level: {content.classLevel}
                </Typography>
                <Typography variant="body2">
                  Category: {content.category}
                </Typography>
                <Typography variant="body2">
                  Area: {content.area}
                </Typography>
              </CardContent>
              <CardActions>
                <IconButton onClick={() => handleOpenDialog(content)}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(content.id)}>
                  <DeleteIcon />
                </IconButton>
                {content.contentType === CONTENT_TYPES.PDF && (
                  <Button
                    size="small"
                    color="primary"
                    href={content.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </Button>
                )}
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingContent ? 'Edit Content' : 'Add New Content'}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  multiline
                  rows={3}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth required>
                  <InputLabel>Content Type</InputLabel>
                  <Select
                    name="contentType"
                    value={formData.contentType}
                    onChange={handleInputChange}
                    label="Content Type"
                  >
                    {Object.values(CONTENT_TYPES).map((type) => (
                      <MenuItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {formData.contentType === CONTENT_TYPES.PDF ? (
                <Grid item xs={12}>
                  <Button
                    variant="outlined"
                    component="label"
                    startIcon={<UploadFileIcon />}
                    fullWidth
                  >
                    Upload PDF
                    <input
                      type="file"
                      hidden
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                  </Button>
                  {formData.file && (
                    <Typography variant="body2" sx={{ mt: 1 }}>
                      Selected file: {formData.file.name}
                    </Typography>
                  )}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Link"
                    name="link"
                    value={formData.link}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Age Group</InputLabel>
                  <Select
                    name="ageGroup"
                    value={formData.ageGroup}
                    onChange={handleInputChange}
                    label="Age Group"
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
                <FormControl fullWidth required>
                  <InputLabel>Class Level</InputLabel>
                  <Select
                    name="classLevel"
                    value={formData.classLevel}
                    onChange={handleInputChange}
                    label="Class Level"
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
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    label="Category"
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
                <FormControl fullWidth required>
                  <InputLabel>Area</InputLabel>
                  <Select
                    name="area"
                    value={formData.area}
                    onChange={handleInputChange}
                    label="Area"
                  >
                    {AREAS.map((area) => (
                      <MenuItem key={area} value={area}>
                        {area}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>Cancel</Button>
            <Button type="submit" variant="contained">
              {editingContent ? 'Save Changes' : 'Add Content'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default AdminDashboard;