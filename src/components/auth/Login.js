import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Container, 
  Box, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Paper,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Link
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

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
      setError('');
      await login(formData, role);
      navigate(role === 'admin' ? '/admin/dashboard' : '/');
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" align="center" gutterBottom>
          Login
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <FormControl component="fieldset" sx={{ mt: 2, mb: 2 }}>
            <FormLabel component="legend">Login As</FormLabel>
            <RadioGroup
              row
              name="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <FormControlLabel value="user" control={<Radio />} label="User" />
              <FormControlLabel value="admin" control={<Radio />} label="Admin" />
            </RadioGroup>
          </FormControl>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Login'}
          </Button>
        </form>

        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Don't have an account?{' '}
            <Link component={RouterLink} to="/register">
              Register here
            </Link>
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2 }}>
          <Alert severity="info">
            <Typography variant="body2">
              <strong>Demo Accounts:</strong>
            </Typography>
            <Typography variant="body2">
              Admin: admin@example.com / admin123
            </Typography>
            <Typography variant="body2">
              User: user@example.com / user123
            </Typography>
          </Alert>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;