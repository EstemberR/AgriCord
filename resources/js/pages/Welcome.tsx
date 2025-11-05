import { Box, Container, Typography, Button } from '@mui/material';
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
            <Box sx={{ 
                bgcolor: '#0a0a0a', 
                minHeight: '100vh', 
                display: 'flex', 
                flexDirection: 'column',
                color: 'common.white'
            }}>
                {/* Header */}
                <Container maxWidth="lg">
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', py: 2, gap: 2 }}>
                        {auth.user ? (
                            <Button
                                component={Link}
                                href={route('dashboard')}
                                variant="contained"
                                sx={{
                                    bgcolor: 'primary.main',
                                    '&:hover': {
                                        bgcolor: 'primary.dark'
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
                                    variant="contained"
                                    color="primary"
                                    sx={{
                                        borderColor: 'primary.main',
                                        color: 'white',
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
                            backgroundColor: 'rgba(0, 0, 0, 0.50)', // Darker overlay for better contrast
                            zIndex: 1
                        },
                        backgroundImage: 'url("/images/corn-bg.jpg")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        minHeight: '600px',
                        display: 'flex',
                        alignItems: 'center',
                        borderRadius: '16px',
                        mx: 2,
                        boxShadow: 3
                    }}
                >
                    <Container 
                        maxWidth="lg" 
                        sx={{ 
                            position: 'relative',
                            zIndex: 2 // This ensures content appears above the dark overlay
                        }}
                    >
                        <Typography 
                            variant="h2" 
                            component="h1" 
                            sx={{ 
                                mb: 4, 
                                fontWeight: 700,
                                color: 'common.white',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                            }}
                        >
                            Welcome to AgriCord
                        </Typography>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                mb: 4, 
                                maxWidth: 'md',
                                color: 'common.white',
                                textShadow: '1px 1px 2px rgba(0,0,0,0.5)'
                            }}
                        >
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
                                 sx={{
                                        borderColor: 'white',
                                        color: 'white',
                                        '&:hover': {
                                            borderColor: 'white',
                                            backgroundColor: 'rgba(255, 255, 255, 0.1)'
                                        }
                                    }}
                            >
                                Learn More
                            </Button>
                        </Box>
                    </Container>
                </Box>

                {/* Features Section */}
                <Box sx={{ 
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    py: 12,
                    borderRadius: '16px',
                    mx: 2,
                    mt: 4,
                    boxShadow: 3,
                    border: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Container maxWidth="lg" >
                        <Typography 
                            variant="h3" 
                            component="h2" 
                            sx={{ 
                                textAlign: 'center', 
                                mb: 8,
                                color: 'common.white',
                                fontWeight: 'bold',
                                textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
                            }}
                        >
                            Why Choose AgriCord?
                        </Typography>
                        <Box sx={{ 
                            display: 'grid',
                            gridTemplateColumns: {
                                xs: '1fr',
                                md: 'repeat(3, 1fr)'
                            },
                            gap: 6,
                        }}>
                            {/* Feature 1 */}
                            <Box sx={{ 
                                textAlign: 'center',
                                p: 4,
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}>
                                <Box sx={{ fontSize: 56, mb: 3 }}>🌱</Box>
                                <Typography 
                                    variant="h5" 
                                    component="h3" 
                                    sx={{ 
                                        mb: 2, 
                                        color: 'common.white', 
                                        fontWeight: 'medium'
                                    }}
                                >
                                    Smart Farming
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'grey.300',
                                        fontSize: '1.1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Leverage data-driven insights to optimize your agricultural operations
                                </Typography>
                            </Box>

                            {/* Feature 2 */}
                            <Box sx={{ 
                                textAlign: 'center',
                                p: 4,
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}>
                                <Box sx={{ fontSize: 56, mb: 3 }}>📊</Box>
                                <Typography 
                                    variant="h5" 
                                    component="h3" 
                                    sx={{ 
                                        mb: 2, 
                                        color: 'common.white', 
                                        fontWeight: 'medium'
                                    }}
                                >
                                    Real-time Monitoring
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'grey.300',
                                        fontSize: '1.1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Track your farm's performance with advanced analytics and reporting
                                </Typography>
                            </Box>

                            {/* Feature 3 */}
                            <Box sx={{ 
                                textAlign: 'center',
                                p: 4,
                                borderRadius: 2,
                                bgcolor: 'rgba(255, 255, 255, 0.05)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'all 0.3s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-8px)',
                                    boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1)',
                                    bgcolor: 'rgba(255, 255, 255, 0.1)'
                                }
                            }}>
                                <Box sx={{ fontSize: 56, mb: 3 }}>🤝</Box>
                                <Typography 
                                    variant="h5" 
                                    component="h3" 
                                    sx={{ 
                                        mb: 2, 
                                        color: 'common.white', 
                                        fontWeight: 'medium'
                                    }}
                                >
                                    Resource Management
                                </Typography>
                                <Typography 
                                    variant="body1" 
                                    sx={{ 
                                        color: 'grey.300',
                                        fontSize: '1.1rem',
                                        lineHeight: 1.6
                                    }}
                                >
                                    Efficiently manage your agricultural resources and workforce
                                </Typography>
                            </Box>
                    </Box>
                    </Container>
                </Box>

                {/* Footer */}
                <Box 
                    component="footer" 
                    sx={{ 
                        bgcolor: 'rgba(255, 255, 255, 0.02)',
                        py: 6,
                        mt: 8,
                        borderTop: 1,
                        borderColor: 'rgba(255, 255, 255, 0.1)'
                    }}
                >
                    <Container maxWidth="lg">
                        <Typography 
                            variant="body2" 
                            align="center"
                            sx={{
                                color: 'rgba(255, 255, 255, 0.7)',
                                fontSize: '0.9rem',
                                letterSpacing: '0.5px'
                            }}
                        >
                            © 2025 AgriCord. All rights reserved.
                        </Typography>
                    </Container>
                </Box>
            </Box>
        </>
    );
}