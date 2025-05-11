import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Typography, 
  Grid, 
  Paper, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  TextField, 
  InputAdornment,
  CircularProgress,
  Alert,
  Button,
  AppBar,
  Toolbar,
  Divider,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  CardActions
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import SchoolIcon from '@mui/icons-material/School';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import { getPublishedContents } from '../../data/mockData';
import ContentCard from './ContentCard';
import { useAuth } from '../../contexts/AuthContext';
import { styled } from '@mui/material/styles';
import YouTubeIcon from '@mui/icons-material/YouTube';
import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import {
  AGE_GROUPS,
  CLASS_LEVELS,
  CONTENT_CATEGORIES,
  AREAS,
} from '../../data/contentTypes';

const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.05)',
    boxShadow: theme.shadows[10],
  },
}));

const SocialCard = styled(StyledCard)(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  '& .MuiCardMedia-root': {
    height: 120,
    padding: theme.spacing(3),
    backgroundColor: '#f5f5f5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    '& img': {
      height: '50px',
      width: 'auto',
      objectFit: 'contain',
    }
  },
  '& .MuiCardContent-root': {
    height: 100,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(2),
  },
  '& .MuiTypography-h5': {
    marginBottom: theme.spacing(1),
    fontWeight: 600,
    fontSize: '1.2rem',
  },
  '& .MuiTypography-body2': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
  }
}));

const SocialIcon = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '60px',
  height: '60px',
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
  color: 'white',
  margin: theme.spacing(2),
  transition: 'transform 0.3s ease-in-out',
  '&:hover': {
    transform: 'scale(1.1)',
  },
}));

function LandingPage() {
  const [contents, setContents] = useState([]);
  const [filteredContents, setFilteredContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    ageGroup: '6-8 years',
    classLevel: '1st Grade',
    area: 'Global',
    category: 'Mathematics'
  });
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [showSearchResults, setShowSearchResults] = useState(false);

  const categories = [
    'Mathematics', 'Science', 'Language Arts', 'Social Studies', 
    'Arts & Crafts', 'Physical Education', 'Music', 'Technology'
  ];
  
  const ageGroups = ['3-5 years', '6-8 years', '9-11 years', '12-14 years', '15-18 years'];
  const classLevels = [
    'Preschool', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', 
    '4th Grade', '5th Grade', '6th Grade', '7th Grade', '8th Grade',
    '9th Grade', '10th Grade', '11th Grade', '12th Grade'
  ];
  const areas = ['North America', 'Europe', 'Asia', 'Africa', 'South America', 'Australia', 'Global'];

  useEffect(() => {
    fetchContents();
  }, []);

  useEffect(() => {
    filterContents();
  }, [contents, searchTerm, filters]);

  const fetchContents = async () => {
    try {
      setLoading(true);
      const data = await getPublishedContents();
      setContents(data);
      setFilteredContents(data);
      setError('');
    } catch (error) {
      setError('Failed to fetch contents');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filterContents = () => {
    let filtered = [...contents];
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(content => 
        content.title.toLowerCase().includes(term) || 
        content.description.toLowerCase().includes(term)
      );
    }
    
    // Apply dropdown filters
    if (filters.ageGroup) {
      filtered = filtered.filter(content => content.ageGroup === filters.ageGroup);
    }
    
    if (filters.classLevel) {
      filtered = filtered.filter(content => content.classLevel === filters.classLevel);
    }
    
    if (filters.area) {
      filtered = filtered.filter(content => content.area === filters.area);
    }
    
    if (filters.category) {
      filtered = filtered.filter(content => content.category === filters.category);
    }
    
    setFilteredContents(filtered);
  };

  const handleFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleClearFilters = () => {
    setFilters({
      ageGroup: '6-8 years',
      classLevel: '1st Grade',
      area: 'Global',
      category: 'Mathematics'
    });
    setSearchTerm('');
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleAdminDashboard = () => {
    navigate('/admin/dashboard');
  };

  const handleSocialClick = (platform) => {
    switch (platform) {
      case 'youtube':
        window.open('https://www.youtube.com', '_blank');
        break;
      case 'instagram':
        window.open('https://www.instagram.com', '_blank');
        break;
      case 'facebook':
        window.open('https://www.facebook.com', '_blank');
        break;
      default:
        break;
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    setShowSearchResults(true);
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
    <>
      <AppBar position="static">
        <Toolbar>
          <SchoolIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Homeschooling Resources
          </Typography>
          
          {currentUser ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                {currentUser.email}
              </Typography>
              
              {currentUser.role === 'admin' && (
                <Button 
                  color="inherit" 
                  onClick={handleAdminDashboard}
                  sx={{ mr: 2 }}
                >
                  Admin Dashboard
                </Button>
              )}
              
              <Button 
                color="inherit" 
                onClick={handleLogout}
                startIcon={<LogoutIcon />}
              >
                Logout
              </Button>
            </Box>
          ) : (
            <Box>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                startIcon={<AccountCircleIcon />}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={Link} 
                to="/signup"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      
      <Box sx={{ 
        bgcolor: 'primary.main', 
        color: 'white', 
        py: 6, 
        textAlign: 'center'
      }}>
        <Container maxWidth="md">
          <Typography variant="h3" component="h1" gutterBottom>
            Find Educational Resources for Homeschooling
          </Typography>
          <Typography variant="h6" gutterBottom>
            Browse our collection of videos, documents, and social media posts to support your child's learning journey
          </Typography>
        </Container>
      </Box>
      
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom>
          Welcome to EduPlatform
        </Typography>
        <Typography variant="h5" align="center" color="textSecondary" paragraph>
          Discover educational resources tailored for your child's learning journey
        </Typography>

        <Paper sx={{ p: 3, mb: 4, mt: 4 }}>
          <Typography variant="h6" gutterBottom>
            Search Educational Content
          </Typography>
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
        ) : showSearchResults ? (
          contents.length === 0 ? (
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
          )
        ) : (
          <>
            <Grid 
              container 
              spacing={3} 
              sx={{ 
                mt: 4,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'stretch'
              }}
            >
              <Grid item xs={12} sm={4}>
                <SocialCard>
                  <CardActionArea onClick={() => handleSocialClick('youtube')}>
                    <CardMedia
                      component="img"
                      image="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b8/YouTube_Logo_2017.svg/1280px-YouTube_Logo_2017.svg.png"
                      alt="YouTube Education"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        YouTube Learning
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Access our curated collection of educational videos
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </SocialCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <SocialCard>
                  <CardActionArea onClick={() => handleSocialClick('instagram')}>
                    <CardMedia
                      component="img"
                      image="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Instagram_logo.svg/2560px-Instagram_logo.svg.png"
                      alt="Instagram Education"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Instagram Updates
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Follow us for daily educational tips and resources
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </SocialCard>
              </Grid>

              <Grid item xs={12} sm={4}>
                <SocialCard>
                  <CardActionArea onClick={() => handleSocialClick('facebook')}>
                    <CardMedia
                      component="img"
                      image="https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Facebook_Logo_%282019%29.svg/2560px-Facebook_Logo_%282019%29.svg.png"
                      alt="Facebook Education"
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        Facebook Community
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Join our community of educators and parents
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </SocialCard>
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <SocialIcon onClick={() => handleSocialClick('youtube')}>
                <YouTubeIcon fontSize="large" />
              </SocialIcon>
              <SocialIcon onClick={() => handleSocialClick('instagram')}>
                <InstagramIcon fontSize="large" />
              </SocialIcon>
              <SocialIcon onClick={() => handleSocialClick('facebook')}>
                <FacebookIcon fontSize="large" />
              </SocialIcon>
            </Box>
          </>
        )}
      </Container>
    </>
  );
}

export default LandingPage;