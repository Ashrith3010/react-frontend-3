import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  Box,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  ArrowForward,
  ArrowBack
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import '../styles/Auth.css';

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 600,
  width: '100%',
  margin: 'auto',
  marginTop: theme.spacing(4),
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    background: 'linear-gradient(90deg, #4CAF50 0%, #2196F3 100%)'
  }
}));

const Register = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    userType: 'donor',
    organization: '',
    area: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const steps = ['Account Details', 'Personal Information', 'Verification'];

  // Clear organization and area when userType changes to donor
  useEffect(() => {
    if (formData.userType === 'donor') {
      setFormData(prev => ({
        ...prev,
        organization: '',
        area: ''
      }));
    }
  }, [formData.userType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePassword = (password) => {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return password.length >= 8 && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar;
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.email || !formData.password || !formData.confirmPassword) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!validateEmail(formData.email)) {
          setError('Please enter a valid email address');
          return false;
        }
        if (!validatePassword(formData.password)) {
          setError('Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return false;
        }
        break;
      case 1:
        if (!formData.username || !formData.phone) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.userType === 'ngo' && (!formData.organization || !formData.area)) {
          setError('Please fill in organization details');
          return false;
        }
        if (!/^\d{10}$/.test(formData.phone)) {
          setError('Please enter a valid 10-digit phone number');
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const prepareFormDataForSubmission = () => {
    const submissionData = { ...formData };
    if (submissionData.userType === 'donor') {
      delete submissionData.organization;
      delete submissionData.area;
    }
    delete submissionData.confirmPassword;
    return submissionData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep()) return;

    if (activeStep < steps.length - 1) {
      handleNext();
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const submissionData = prepareFormDataForSubmission();
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box className="form-transition">
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              className="form-field auth-input"
              error={!!error && error.includes('email')}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="form-field auth-input"
              error={!!error && error.includes('password')}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              helperText="Password must contain at least 8 characters, including uppercase, lowercase, numbers, and special characters"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="form-field auth-input"
              error={!!error && error.includes('match')}
            />
          </Box>
        );
      case 1:
        return (
          <Box className="form-transition">
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-field auth-input"
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="phone"
              label="Phone Number"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-field auth-input"
              helperText="Enter 10-digit phone number"
            />
            <FormControl fullWidth margin="normal" className="form-field">
              <InputLabel>User Type</InputLabel>
              <Select
                name="userType"
                value={formData.userType}
                onChange={handleChange}
                label="User Type"
              >
                <MenuItem value="donor">Donor</MenuItem>
                <MenuItem value="ngo">NGO</MenuItem>
              </Select>
            </FormControl>
            {formData.userType === 'ngo' && (
              <>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="organization"
                  label="Organization Name"
                  name="organization"
                  value={formData.organization}
                  onChange={handleChange}
                  className="form-field auth-input"
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="area"
                  label="Service Area"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  className="form-field auth-input"
                />
              </>
            )}
          </Box>
        );
      case 2:
        return (
          <Box className="form-transition">
            <Typography variant="h6" gutterBottom>
              Review Your Information
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Email:</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {formData.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Username:</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {formData.username}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Phone:</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {formData.phone}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">User Type:</Typography>
                <Typography color="textSecondary" gutterBottom>
                  {formData.userType.toUpperCase()}
                </Typography>
              </Grid>
              {formData.userType === 'ngo' && (
                <>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Organization:</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {formData.organization}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2">Service Area:</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      {formData.area}
                    </Typography>
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        );
      default:
        return null;
    }
  };

  return (
    <Container component="main" maxWidth="md" className="auth-container">
      <StyledPaper elevation={3} className="auth-card">
        <PersonAdd color="primary" sx={{ fontSize: 40, mb: 2 }} className="auth-icon" />
        <Typography component="h1" variant="h5" gutterBottom>
          Create Account
        </Typography>

        <Stepper 
          activeStep={activeStep} 
          sx={{ width: '100%', mb: 4 }}
          className="auth-stepper"
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" className="auth-alert" sx={{ width: '100%', mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" className="auth-alert" sx={{ width: '100%', mb: 2 }}>
            {success}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0}
              startIcon={<ArrowBack />}
              sx={{ visibility: activeStep === 0 ? 'hidden' : 'visible' }}
            >
              Back
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
              className="auth-button"
            >
              {loading ? (
                <CircularProgress size={24} className="loading-spinner" />
              ) : activeStep === steps.length - 1 ? (
                'Create Account'
              ) : (
                'Next'
              )}
            </Button>
          </Box>

          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Typography variant="body2" color="textSecondary">
              Already have an account?{' '}
              <Link href="/login" className="auth-link">
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </StyledPaper>
    </Container>
  );
};

export default Register;