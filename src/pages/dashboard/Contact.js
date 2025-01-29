import React, { useState, useEffect } from 'react';
import {
  TextField,
  Button,
  Container,
  Paper,
  Typography,
  Box,
  Snackbar,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { Send as SendIcon } from 'lucide-react';
import Header from './Header';

const Contact = () => {
  const theme = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem('username');
    const email = localStorage.getItem('email');

    if (username || email) {
      setFormData(prevData => ({
        ...prevData,
        name: username || '',
        email: email || ''
      }));
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      setStatus('Please log in to send a message.');
      setOpenSnackbar(true);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const text = await response.text();

      if (response.ok) {
        setStatus('Message sent successfully!');
        setFormData(prevData => ({
          ...prevData,
          message: '',
        }));
      } else {
        setStatus(`Failed to send message: ${text || 'Unknown error'}`);
      }
    } catch (error) {
      setStatus(`Failed to send message: ${error.message}`);
    } finally {
      setLoading(false);
      setOpenSnackbar(true);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <>
   <Header/>
   <br/>
   <br/>
   <br/>

    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
        py: 4
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={24}
          sx={{
            display: 'flex',
            borderRadius: 4,
            overflow: 'hidden',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <Box
            sx={{
              flex: 1,
              p: 4,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <Typography
              variant="h3"
              component="h1"
              sx={{
                mb: 4,
                background: 'linear-gradient(45deg, #2196F3 30%, #673AB7 90%)',
                backgroundClip: 'text',
                textFillColor: 'transparent',
                fontWeight: 'bold'
              }}
            >
              Let's Connect!
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 3
              }}
            >
              <TextField
                name="name"
                label="Your Name"
                value={formData.name}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ background: 'rgba(255, 255, 255, 0.7)' }}
              />

              <TextField
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
                variant="outlined"
                sx={{ background: 'rgba(255, 255, 255, 0.7)' }}
              />

              <TextField
                name="message"
                label="Your Message"
                value={formData.message}
                onChange={handleChange}
                required
                fullWidth
                multiline
                rows={4}
                variant="outlined"
                sx={{ background: 'rgba(255, 255, 255, 0.7)' }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                sx={{
                  mt: 2,
                  py: 1.5,
                  background: 'linear-gradient(45deg, #2196F3 30%, #673AB7 90%)',
                  color: 'white',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1976D2 30%, #5E35B1 90%)',
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  <>
                    <SendIcon className="mr-2" size={20} />
                    <span className="ml-2">Send Message</span>
                  </>
                )}
              </Button>
            </Box>
          </Box>

          <Box
            sx={{
              flex: 1,
              background: 'linear-gradient(45deg, #2196F3 30%, #673AB7 90%)',
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              justifyContent: 'center',
              p: 4,
              color: 'white'
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h4" sx={{ mb: 2 }}>
                Get in Touch
              </Typography>
              <Typography variant="body1">
                We'd love to hear from you! Send us a message and we'll respond as soon as possible.
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert
          onClose={() => setOpenSnackbar(false)}
          severity={status.includes('Failed') ? 'error' : 'success'}
          sx={{ width: '100%' }}
        >
          {status}
        </Alert>
      </Snackbar>
    </Box>
    </>
  );
};

export default Contact;