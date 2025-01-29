import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Grid, 
  Container, 
  Box, 
  CircularProgress, 
  Alert,
  useTheme,
  alpha
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { styled } from '@mui/material/styles';
import Header from './Header';
import '../styles/ngo-directory.css'
// Enhanced styled components
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
  borderRadius: theme.spacing(2),
  background: `linear-gradient(145deg, ${alpha(theme.palette.background.paper, 0.9)}, ${theme.palette.background.paper})`,
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: '0 12px 24px rgba(0, 0, 0, 0.1)',
  },
  border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
}));

const SearchWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  maxWidth: '600px',
  margin: '0 auto',
  marginBottom: theme.spacing(6),
  '& .MuiSvgIcon-root': {
    position: 'absolute',
    left: theme.spacing(2),
    top: '50%',
    transform: 'translateY(-50%)',
    color: theme.palette.primary.main,
    opacity: 0.7,
  },
  '& .MuiTextField-root': {
    width: '100%',
  },
  '& .MuiOutlinedInput-root': {
    paddingLeft: theme.spacing(6),
    borderRadius: theme.spacing(2),
    transition: 'all 0.3s ease',
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.02),
    },
    '&.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.1)}`,
    },
  },
}));

const IconWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  marginBottom: theme.spacing(1.5),
  '& .MuiSvgIcon-root': {
    marginRight: theme.spacing(1.5),
    color: theme.palette.primary.main,
    fontSize: '1.25rem',
  },
  '& .MuiTypography-root': {
    color: theme.palette.text.secondary,
    fontWeight: 500,
  },
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2.5rem',
  fontWeight: 700,
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  color: theme.palette.primary.main,
  letterSpacing: '-0.01em',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
    marginBottom: theme.spacing(4),
  },
}));

const Description = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
}));

const OrganizationName = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: theme.palette.primary.dark,
  marginBottom: theme.spacing(2),
  fontSize: '1.25rem',
}));

const NGODirectory = () => {
  const [ngos, setNGOs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredNGOs, setFilteredNGOs] = useState([]);
  const theme = useTheme();

  useEffect(() => {
    const fetchNGOs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Please login to view the NGO directory');
        }
        const response = await fetch('http://localhost:8080/api/ngos', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        if (response.status === 403) {
          throw new Error('You do not have permission to view the NGO directory');
        }
        if (!response.ok) {
          throw new Error('Failed to fetch NGO directory');
        }
        const data = await response.json();
        setNGOs(Array.isArray(data) ? data : []);
        setFilteredNGOs(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchNGOs();
  }, []);

  useEffect(() => {
    const filtered = ngos.filter(ngo =>
      ngo.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ngo.area.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredNGOs(filtered);
  }, [searchTerm, ngos]);

  if (loading) {
    return (
      <>
        <Header />
        <br/>
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="400px"
        >
          <CircularProgress size={60} thickness={4} />
        </Box>
      </>
    );
  }

  return (
    <>
      <Header />
      <br/>
      <Box
        sx={{
          minHeight: '100vh',
          background: (theme) => `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.03)} 0%, ${alpha(theme.palette.background.default, 1)} 100%)`,
          py: 6
        }}
      >
        <Container maxWidth="lg" sx={{ width: '67% !important' }}>
          <PageTitle variant="h1">
            NGO Directory
          </PageTitle>

          <SearchWrapper>
            <SearchIcon />
            <TextField
              placeholder="Search by organization name or area..."
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'background.paper',
                }
              }}
            />
          </SearchWrapper>

          {error ? (
            <Alert 
              severity="error" 
              sx={{ 
                maxWidth: 600, 
                mx: 'auto', 
                mb: 4,
                borderRadius: 2 
              }}
            >
              {error}
            </Alert>
          ) : filteredNGOs.length === 0 ? (
            <Typography 
              align="center" 
              color="textSecondary"
              sx={{ 
                py: 8,
                fontSize: '1.1rem' 
              }}
            >
              No NGOs found matching your search.
            </Typography>
          ) : (
            <Grid container spacing={3}>
              {filteredNGOs.map((ngo) => (
                <Grid item xs={12} sm={6} md={4} key={ngo.id}>
                  <StyledCard>
                    <CardContent sx={{ p: 3 }}>
                      <OrganizationName variant="h6">
                        {ngo.organization}
                      </OrganizationName>
                      
                      <IconWrapper>
                        <LocationOnIcon />
                        <Typography>{ngo.area}</Typography>
                      </IconWrapper>

                      <IconWrapper>
                        <PhoneIcon />
                        <Typography>{ngo.phone}</Typography>
                      </IconWrapper>

                      <IconWrapper>
                        <EmailIcon />
                        <Typography>{ngo.email}</Typography>
                      </IconWrapper>

                      {ngo.description && (
                        <Description
                          variant="body2"
                          color="textSecondary"
                          sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}
                        >
                          {ngo.description}
                        </Description>
                      )}
                    </CardContent>
                  </StyledCard>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
};

export default NGODirectory;