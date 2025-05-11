import React, { useState } from 'react';
import {
  Container,
  Grid,
  Paper,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  InputAdornment,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import {
  AGE_GROUPS,
  CLASS_LEVELS,
  CONTENT_CATEGORIES,
  AREAS,
} from '../../data/contentTypes';

const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ageGroup: '',
    classLevel: '',
    category: '',
    area: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [contents, setContents] = useState([]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({
      ageGroup: '',
      classLevel: '',
      category: '',
      area: '',
    });
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      // Here you would typically make an API call to search for content
      // For now, we'll simulate a search with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // Simulated search results
      const mockResults = [
        {
          id: 1,
          title: 'Math Basics',
          description: 'Learn fundamental mathematics concepts',
          contentType: 'youtube',
          link: 'https://youtube.com/watch?v=example1',
          ageGroup: '6-8 years',
          classLevel: '1st Grade',
          category: 'Mathematics',
          area: 'Global',
        },
        // Add more mock results as needed
      ];
      
      setContents(mockResults);
    } catch (err) {
      setError('Failed to search content. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Search Educational Content
      </Typography>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Search resources"
              value={searchTerm}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Age Group</InputLabel>
              <Select
                name="ageGroup"
                value={filters.ageGroup}
                onChange={handleFilterChange}
                label="Age Group"
              >
                <MenuItem value="">All Ages</MenuItem>
                {AGE_GROUPS.map((age) => (
                  <MenuItem key={age} value={age}>
                    {age}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Class Level</InputLabel>
              <Select
                name="classLevel"
                value={filters.classLevel}
                onChange={handleFilterChange}
                label="Class Level"
              >
                <MenuItem value="">All Classes</MenuItem>
                {CLASS_LEVELS.map((level) => (
                  <MenuItem key={level} value={level}>
                    {level}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {CONTENT_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Area</InputLabel>
              <Select
                name="area"
                value={filters.area}
                onChange={handleFilterChange}
                label="Area"
              >
                <MenuItem value="">All Areas</MenuItem>
                {AREAS.map((area) => (
                  <MenuItem key={area} value={area}>
                    {area}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button variant="outlined" onClick={handleClearFilters}>
              Clear Filters
            </Button>
            <Button variant="contained" onClick={handleSearch}>
              Search
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : contents.length === 0 ? (
        <Alert severity="info">
          No resources found matching your criteria. Try adjusting your filters.
        </Alert>
      ) : (
        <>
          <Typography variant="h5" gutterBottom>
            {contents.length} Resources Found
          </Typography>
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
                    <Button
                      size="small"
                      color="primary"
                      href={content.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Resource
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SearchPage; 