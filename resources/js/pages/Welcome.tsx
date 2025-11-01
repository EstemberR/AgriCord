import { Box, Container, Grid, Typography, Button } from '@mui/material';
import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import { Ziggy } from '../ziggy.js';

type RouteKey = keyof typeof Ziggy.routes;
type RouteParams = Record<string, string | number>;

// Create a route helper function
const route = (name: RouteKey, params?: RouteParams): string => {
    const route = Ziggy.routes[name];
    if (!route) return name.toString();
    
    let uri = route.uri;
    if (params && route.parameters) {
        route.parameters.forEach(param => {
            if (params[param]) {
                uri = uri.replace(`{${param}}`, params[param].toString());
            }
        });
    }
    return uri;
};

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="Welcome to AgriCord" />
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                {/* Header */}
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 2, gap: 2, pr: -1 }}>
                        {auth.user ? (
                            <Button
                                component={Link}
                                href={route('dashboard')}
                                variant="contained"
                                sx={{
                                    bgcolor: '#396031',
                                    '&:hover': {
                                        bgcolor: '#2b4725'
                                    }
                                }}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    component={Link}
                                    href={route('login')}
                                    // variant="outlined"
                                    color="inherit"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Log in
                                </Button>
                                <Button
                                    component={Link}
                                    href={route('register')}
                                    variant="outlined"
                                    color="inherit"
                                    sx={{
                                        color: 'white',
                                        borderColor: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                                >
                                    Register
                                </Button>
                            </>
                        )}
                    </Box>
                </Container>

                {/* Hero Section */}
                <Box 
                    sx={{ 
                        py: 8, 
                        color: 'common.white',
                        position: 'relative',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: 'rgba(0, 0, 0, 0.6)', // Dark overlay
                            zIndex: 1
                        },
                        backgroundImage: 'url("/images/corn-bg.jpg")', // Replace with your image
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '500px', // Adjust this value as needed
                        display: 'flex',
                        alignItems: 'center'
                    }}
                >
                    <Container 
                        maxWidth="lg" 
                        sx={{ 
                            position: 'relative',
                            zIndex: 2 // This ensures content appears above the dark overlay
                        }}
                    >
                        <Typography variant="h2" component="h1" sx={{ mb: 4, fontWeight: 700 }}>
                            Welcome to AgriCord
                        </Typography>
                        <Typography variant="h5" sx={{ mb: 4, maxWidth: 'md' }}>
                            Your trusted partner in agricultural management and coordination
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                                variant="contained"
                                 sx={{ 
                                        bgcolor: '#396031', // Same green as your features section
                                        '&:hover': {
                                            bgcolor: '#2b4725' // Slightly darker on hover
                                        }
                                    }}
                                size="large"
                                component={Link}
                                href={route('register')}
                            >
                                Get Started
                            </Button>
                            <Button
                                variant="outlined"
                                color="inherit"
                                size="large"
                                component={Link}
                                href="#learn-more"
                            >
                                Learn More
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* Features Section */}
                <Box sx={{ bgcolor: '#396031', py: 8 }}> {/* Light green background */}
                    <Container maxWidth="lg">
                        <Typography variant="h3" component="h2" sx={{ textAlign: 'center', mb: 6 }}>
                            Why Choose AgriCord?
                    </Typography>
                    <Box sx={{ 
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            md: 'repeat(3, 1fr)'
                        },
                        gap: 4
                    }}>
                        {/* Feature 1 */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ color: 'primary.main', fontSize: 48, mb: 2 }}>🌱</Box>
                            <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                                Smart Farming
                            </Typography>
                            <Typography color="text.secondary">
                                Leverage data-driven insights to optimize your agricultural operations
                            </Typography>
                        </Box>

                        {/* Feature 2 */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ color: 'primary.main', fontSize: 48, mb: 2 }}>📊</Box>
                            <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                                Real-time Monitoring
                            </Typography>
                            <Typography color="text.secondary">
                                Track your farm's performance with advanced analytics and reporting
                            </Typography>
                        </Box>

                        {/* Feature 3 */}
                        <Box sx={{ textAlign: 'center' }}>
                            <Box sx={{ color: 'primary.main', fontSize: 48, mb: 2 }}>🤝</Box>
                            <Typography variant="h5" component="h3" sx={{ mb: 2 }}>
                                Resource Management
                            </Typography>
                            <Typography color="text.secondary">
                                Efficiently manage your agricultural resources and workforce
                            </Typography>
                        </Box>
                    </Box>
                    </Container>
                </Box>

                {/* Footer */}
                <Box component="footer" sx={{ bgcolor: 'background.paper', py: 4, mt: 'auto' }}>
                    <Container maxWidth="lg">
                        <Typography variant="body2" color="text.secondary" align="center">
                            © 2025 AgriCord. All rights reserved.
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </>
    );
}