import { useState, useEffect } from 'react';
import { 
  styled, 
  Box, 
  AppBar, 
  Toolbar, 
  Typography, 
  IconButton, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText,
  ListItemIcon,
  ListItemButton,
  CssBaseline,
  useTheme,
  useMediaQuery,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Collapse
} from '@mui/material';
import { usePage } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { 
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Agriculture as AgricultureIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  PersonAdd as PersonAddIcon,
  History as HistoryIcon,
  Inventory as InventoryIcon,
  LocalShipping as LocalShippingIcon,
  Science as ScienceIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  TrendingUp as TrendingUpIcon,
  CheckCircle as CheckCircleIcon,
  ChevronRight as ChevronRightBreadcrumbIcon
} from '@mui/icons-material';
import { Tooltip } from '@mui/material';

const MainWrapper = styled('div')(() => ({
  display: 'flex',
  minHeight: '100vh',
  width: '100%',
  backgroundColor: '#f5f5f5',
}));

const PageWrapper = styled('div')(() => ({
  display: 'flex',
  flexGrow: 1,
  flexDirection: 'column',
  zIndex: 1,
}));

const drawerWidth = 280;
const collapsedWidth = 64;

interface FullLayoutProps {
  children: React.ReactNode;
}

interface User {
  id: number;
  name: string;
  email: string;
}

interface Auth {
  user: User | null;
}

interface PageProps {
  auth: Auth;
  [key: string]: unknown;
}

export default function FullLayout({ children }: FullLayoutProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { auth } = usePage<PageProps>().props;
  const [isSidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [farmersOpen, setFarmersOpen] = useState(false);
  const [inputDistributionOpen, setInputDistributionOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [currentSubPage, setCurrentSubPage] = useState<string | null>('Overview');
  const open = Boolean(anchorEl);

  const { url } = usePage();

  // Handle state based on current URL
  useEffect(() => {
    // Farmers section
    if (url === '/farmers' || url === '/farmers/create') {
      setCurrentPage('Farmers');
      setCurrentSubPage('Farmer Registration');
      setFarmersOpen(true);
    } else if (url === '/farmers/history') {
      setCurrentPage('Farmers');
      setCurrentSubPage('Registration History');
      setFarmersOpen(true);
    }
    
    // Input Distribution section
    else if (url === '/distributions/fertilizer') {
      setCurrentPage('Input Distribution');
      setCurrentSubPage('Fertilizer Distribution');
      setInputDistributionOpen(true);
    } else if (url === '/distributions/seed') {
      setCurrentPage('Input Distribution');
      setCurrentSubPage('Seed Distribution');
      setInputDistributionOpen(true);
    } else if (url === '/distributions/history') {
      setCurrentPage('Input Distribution');
      setCurrentSubPage('Distribution History');
      setInputDistributionOpen(true);
    } else if (url === '/inventory') {
      setCurrentPage('Input Distribution');
      setCurrentSubPage('Inventory Management');
      setInputDistributionOpen(true);
    }
    
    // Dashboard
    else if (url === '/dashboard') {
      setCurrentPage('Dashboard');
      setCurrentSubPage('Overview');
    }
    
    // Settings
    else if (url.startsWith('/settings')) {
      setCurrentPage('Settings');
      setCurrentSubPage(null);
    }
    
    // Users
    else if (url === '/users') {
      setCurrentPage('Users');
      setCurrentSubPage(null);
    }
  }, [url]); // Add url to dependency array

  const handleDrawerToggle = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    router.post('/logout');
  };

  const handleFarmersToggle = () => {
    setFarmersOpen(!farmersOpen);
  };

  const handleInputDistributionToggle = () => {
    setInputDistributionOpen(!inputDistributionOpen);
  };

  const handleReportsToggle = () => {
    setReportsOpen(!reportsOpen);
  };

  const handleMenuClick = (page: string, subPage: string | null = null) => {
    setCurrentPage(page);
    setCurrentSubPage(subPage);
  };

  // Helper function to get user initials
  const getUserInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((word: string) => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon /> },
  ];

  const farmersSubItems = [
    { text: 'Farmer Registration', icon: <PersonAddIcon />, href: '/farmers' },
    { text: 'Registration History', icon: <HistoryIcon />, href: '/farmers/history' },
  ];

  const inputDistributionSubItems = [
    { text: 'Fertilizer Distribution', icon: <ScienceIcon />, href: '/distributions/fertilizer' },
    { text: 'Seed Distribution', icon: <LocalShippingIcon />, href: '/distributions/seed' },
    { text: 'Distribution History', icon: <HistoryIcon />, href: '/distributions/history' },
    { text: 'Inventory Management', icon: <InventoryIcon />, href: '/inventory' },
  ];

  const reportsSubItems = [
    { text: 'Distribution Reports', icon: <AssessmentIcon />, href: '/reports/distribution' },
    { text: 'Farmer Statistics', icon: <BarChartIcon />, href: '/reports/farmer' },
    { text: 'Resource Utilization', icon: <TrendingUpIcon />, href: '/reports/resource' },
    { text: 'Compliance Reports', icon: <CheckCircleIcon />, href: '/reports/compliance' },
  ];

  const bottomMenuItems = [
    { text: 'Users', icon: <PeopleIcon />, href: '/users' },
    { text: 'Settings', icon: <SettingsIcon />, href: '/settings/profile' },
  ];

  return (
    <MainWrapper>
      <CssBaseline />
        <AppBar
        position="fixed"
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          backgroundColor: '#03122F',
          boxShadow: 'none'
        }}
      >
        <Toolbar sx={{ minHeight: '64px', py: 1, position: 'relative' }}>
          <Box
            sx={{
              cursor: 'pointer',
              transition: 'transform 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px) scale(1.02)'
              }
            }}
            onClick={() => router.get('/dashboard')}
          >
            <img 
              src="/images/logo.png" 
              alt="AgriCord Logo" 
              style={{ 
                height: '40px', 
                width: 'auto',
                objectFit: 'contain',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
              }} 
            />
          </Box>
          
          {/* Profile Menu */}
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={open ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={open ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32, backgroundColor: '#3498db' }}>
                {auth?.user ? getUserInitials(auth.user.name) : 'U'}
              </Avatar>
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      
      {/* Profile Menu Dropdown */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleProfileMenuClose}
        onClick={handleProfileMenuClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            '&:before': {
              content: '""',
              display: 'block',
              position: 'absolute',
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: 'background.paper',
              transform: 'translateY(-50%) rotate(45deg)',
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileMenuClose}>
          <Avatar sx={{ backgroundColor: '#3498db' }}>
            {auth?.user ? getUserInitials(auth.user.name) : 'U'}
          </Avatar>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 600 }}>
              {auth?.user?.name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {auth?.user?.email || 'user@example.com'}
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          router.visit('/settings/profile');
        }}>
          <ListItemIcon>
            <PersonIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>
        <MenuItem onClick={() => {
          handleProfileMenuClose();
          router.visit('/settings/profile');
        }}>
          <ListItemIcon>
            <SettingsIcon fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
      </Menu>
      
      <Drawer
        variant={isMobile ? "temporary" : "persistent"}
        anchor="left"
        open={isMobile ? isSidebarOpen : true}
        onClose={isMobile ? handleDrawerToggle : undefined}
        sx={{
          width: isSidebarOpen ? drawerWidth : collapsedWidth,
          flexShrink: 0,
          transition: 'width 0.3s ease',
          '& .MuiDrawer-paper': {
            width: isSidebarOpen ? drawerWidth : collapsedWidth,
            boxSizing: 'border-box',
            backgroundColor: '#03122F',
            borderRight: 'none',
            transition: 'width 0.3s ease',
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        
        {/* Toggle Button */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end', 
          alignItems: 'center',
          p: 1,
          borderBottom: '1px solid rgba(255,255,255,0.1)'
        }}>
          <Tooltip 
            title={isSidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'} 
            placement="right"
            arrow
          >
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)',
                },
                transition: 'all 0.3s ease',
                transform: isSidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)'
              }}
            >
              <ChevronLeftIcon />
            </IconButton>
          </Tooltip>
        </Box>
        
        <Box sx={{ 
          overflow: 'auto', 
          py: 2, 
          display: 'flex', 
          flexDirection: 'column', 
          height: '100%' 
        }}>
          <List sx={{ flexGrow: 1 }}>
            {menuItems.map((item, index) => (
              <Tooltip 
                key={index}
                title={!isSidebarOpen ? item.text : ''} 
                placement="right"
                arrow
              >
                <ListItem 
                  onClick={() => {
                    handleMenuClick('Dashboard', 'Overview');
                    router.get('/dashboard');
                  }}
                  sx={{ 
                    px: isSidebarOpen ? 3 : 2, 
                    py: 1,
                    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 1
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: isSidebarOpen ? 40 : 'auto', 
                    color: 'white',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {isSidebarOpen && (
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: 'white'
                      }}
                      sx={{ 
                        opacity: isSidebarOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            ))}

            {/* Farmers Dropdown Section */}
            <Tooltip 
              title={!isSidebarOpen ? 'Farmers' : ''} 
              placement="right"
              arrow
            >
              <ListItem 
                onClick={handleFarmersToggle}
                sx={{ 
                  px: isSidebarOpen ? 3 : 2, 
                  py: 1,
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: isSidebarOpen ? 40 : 'auto', 
                  color: 'white',
                  justifyContent: 'center'
                }}>
                  <AgricultureIcon />
                </ListItemIcon>
                {isSidebarOpen && (
                  <>
                    <ListItemText 
                      primary="Farmers"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: 'white'
                      }}
                      sx={{ 
                        opacity: isSidebarOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        color: 'white',
                        ml: 'auto'
                      }}
                    >
                      {farmersOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </>
                )}
              </ListItem>
            </Tooltip>

            {/* Farmers Submenu */}
            <Collapse in={farmersOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {farmersSubItems.map((subItem, subIndex) => (
                  <Tooltip 
                    key={subIndex}
                    title={!isSidebarOpen ? subItem.text : ''} 
                    placement="right"
                    arrow
                  >
                    {subItem.href ? (
                      <ListItemButton
                        onClick={() => {
                          setFarmersOpen(true); // Keep Farmers dropdown open
                          handleMenuClick('Farmers', subItem.text);
                          router.get(subItem.href!);
                        }}
                        sx={{ 
                          pl: isSidebarOpen ? 6 : 2, 
                          py: 0.5,
                          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 1,
                            transform: 'translateX(2px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: isSidebarOpen ? 32 : 'auto', 
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'center'
                        }}>
                          {subItem.icon}
                        </ListItemIcon>
                        {isSidebarOpen && (
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontWeight: 400,
                              fontSize: '0.85rem',
                              color: 'rgba(255,255,255,0.7)'
                            }}
                            sx={{ 
                              opacity: isSidebarOpen ? 1 : 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          />
                        )}
                      </ListItemButton>
                    ) : (
                      <ListItem 
                        onClick={() => handleMenuClick('Farmers', subItem.text)}
                        sx={{ 
                          pl: isSidebarOpen ? 6 : 2, 
                          py: 0.5,
                          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 1,
                            transform: 'translateX(2px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: isSidebarOpen ? 32 : 'auto', 
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'center'
                        }}>
                          {subItem.icon}
                        </ListItemIcon>
                        {isSidebarOpen && (
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontWeight: 400,
                              fontSize: '0.85rem',
                              color: 'rgba(255,255,255,0.7)'
                            }}
                            sx={{ 
                              opacity: isSidebarOpen ? 1 : 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          />
                        )}
                      </ListItem>
                    )}
                  </Tooltip>
                ))}
              </List>
            </Collapse>

            {/* Input Distribution Dropdown Section */}
            <Tooltip 
              title={!isSidebarOpen ? 'Input Distribution' : ''} 
              placement="right"
              arrow
            >
              <ListItem 
                onClick={() => {
                  handleInputDistributionToggle();
                  handleMenuClick('Input Distribution', null);
                }}
                sx={{ 
                  px: isSidebarOpen ? 3 : 2, 
                  py: 1,
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: isSidebarOpen ? 40 : 'auto', 
                  color: 'white',
                  justifyContent: 'center'
                }}>
                  <LocalShippingIcon />
                </ListItemIcon>
                {isSidebarOpen && (
                  <>
                    <ListItemText 
                      primary="Input Distribution"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: 'white'
                      }}
                      sx={{ 
                        opacity: isSidebarOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        color: 'white',
                        ml: 'auto'
                      }}
                    >
                      {inputDistributionOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </>
                )}
              </ListItem>
            </Tooltip>

            {/* Input Distribution Submenu */}
            <Collapse in={inputDistributionOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {inputDistributionSubItems.map((subItem, subIndex) => (
                  <Tooltip 
                    key={subIndex}
                    title={!isSidebarOpen ? subItem.text : ''} 
                    placement="right"
                    arrow
                  >
                    {subItem.href ? (
                      <ListItemButton
                        onClick={() => {
                          setInputDistributionOpen(true); // Keep Input Distribution dropdown open
                          handleMenuClick('Input Distribution', subItem.text);
                          router.get(subItem.href!);
                        }}
                        sx={{ 
                          pl: isSidebarOpen ? 6 : 2, 
                          py: 0.5,
                          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 1,
                            transform: 'translateX(2px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: isSidebarOpen ? 32 : 'auto', 
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'center'
                        }}>
                          {subItem.icon}
                        </ListItemIcon>
                        {isSidebarOpen && (
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontWeight: 400,
                              fontSize: '0.85rem',
                              color: 'rgba(255,255,255,0.7)'
                            }}
                            sx={{ 
                              opacity: isSidebarOpen ? 1 : 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          />
                        )}
                      </ListItemButton>
                    ) : (
                      <ListItem 
                        onClick={() => handleMenuClick('Input Distribution', subItem.text)}
                        sx={{ 
                          pl: isSidebarOpen ? 6 : 2, 
                          py: 0.5,
                          justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            backgroundColor: 'rgba(255,255,255,0.15)',
                            borderRadius: 1,
                            transform: 'translateX(2px)',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                          }
                        }}
                      >
                        <ListItemIcon sx={{ 
                          minWidth: isSidebarOpen ? 32 : 'auto', 
                          color: 'rgba(255,255,255,0.7)',
                          justifyContent: 'center'
                        }}>
                          {subItem.icon}
                        </ListItemIcon>
                        {isSidebarOpen && (
                          <ListItemText 
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontWeight: 400,
                              fontSize: '0.85rem',
                              color: 'rgba(255,255,255,0.7)'
                            }}
                            sx={{ 
                              opacity: isSidebarOpen ? 1 : 0,
                              transition: 'opacity 0.3s ease'
                            }}
                          />
                        )}
                      </ListItem>
                    )}
                  </Tooltip>
                ))}
              </List>
            </Collapse>

            {/* Reports Dropdown Section */}
            <Tooltip 
              title={!isSidebarOpen ? 'Reports' : ''} 
              placement="right"
              arrow
            >
              <ListItem 
                onClick={() => {
                  handleReportsToggle();
                  handleMenuClick('Reports', null);
                }}
                sx={{ 
                  px: isSidebarOpen ? 3 : 2, 
                  py: 1,
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: isSidebarOpen ? 40 : 'auto', 
                  color: 'white',
                  justifyContent: 'center'
                }}>
                  <AssessmentIcon />
                </ListItemIcon>
                {isSidebarOpen && (
                  <>
                    <ListItemText 
                      primary="Reports"
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: 'white'
                      }}
                      sx={{ 
                        opacity: isSidebarOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{ 
                        color: 'white',
                        ml: 'auto'
                      }}
                    >
                      {reportsOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                  </>
                )}
              </ListItem>
            </Tooltip>

            {/* Reports Submenu */}
            <Collapse in={reportsOpen} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {reportsSubItems.map((subItem, subIndex) => (
                  <Tooltip 
                    key={subIndex}
                    title={!isSidebarOpen ? subItem.text : ''} 
                    placement="right"
                    arrow
                  >
                    <ListItem 
                      onClick={() => {
                        handleMenuClick('Reports', subItem.text);
                        if (subItem.href) {
                          router.get(subItem.href);
                        }
                      }}
                      sx={{ 
                        pl: isSidebarOpen ? 6 : 2, 
                        py: 0.5,
                        justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        '&:hover': {
                          backgroundColor: 'rgba(255,255,255,0.15)',
                          borderRadius: 1,
                          transform: 'translateX(2px)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                        }
                      }}
                    >
                      <ListItemIcon sx={{ 
                        minWidth: isSidebarOpen ? 32 : 'auto', 
                        color: 'rgba(255,255,255,0.7)',
                        justifyContent: 'center'
                      }}>
                        {subItem.icon}
                      </ListItemIcon>
                      {isSidebarOpen && (
                        <ListItemText 
                          primary={subItem.text}
                          primaryTypographyProps={{
                            fontWeight: 400,
                            fontSize: '0.85rem',
                            color: 'rgba(255,255,255,0.7)'
                          }}
                          sx={{ 
                            opacity: isSidebarOpen ? 1 : 0,
                            transition: 'opacity 0.3s ease'
                          }}
                        />
                      )}
                    </ListItem>
                  </Tooltip>
                ))}
              </List>
            </Collapse>
          </List>
          
          {/* Bottom Menu Items - Users and Settings */}
          <Box sx={{ mt: 'auto', pt: 2 }}>
            {bottomMenuItems.map((item, index) => (
              <Tooltip 
                key={index}
                title={!isSidebarOpen ? item.text : ''} 
                placement="right"
                arrow
              >
                <ListItem 
                  onClick={() => {
                    handleMenuClick(item.text, null);
                    if (item.href) {
                      router.get(item.href);
                    }
                  }}
                  sx={{ 
                    px: isSidebarOpen ? 3 : 2, 
                    py: 1,
                    justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.1)',
                      borderRadius: 1
                    }
                  }}
                >
                  <ListItemIcon sx={{ 
                    minWidth: isSidebarOpen ? 40 : 'auto', 
                    color: 'white',
                    justifyContent: 'center'
                  }}>
                    {item.icon}
                  </ListItemIcon>
                  {isSidebarOpen && (
                    <ListItemText 
                      primary={item.text}
                      primaryTypographyProps={{
                        fontWeight: 500,
                        fontSize: '0.95rem',
                        color: 'white'
                      }}
                      sx={{ 
                        opacity: isSidebarOpen ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                      }}
                    />
                  )}
                </ListItem>
              </Tooltip>
            ))}
          </Box>
          
          {/* Logout Button at Bottom */}
          <Box sx={{ mt: 'auto', pt: 2 }}>
            <Tooltip 
              title={!isSidebarOpen ? 'Logout' : ''} 
              placement="right"
              arrow
            >
              <ListItem 
                onClick={handleLogout}
          sx={{
                  px: isSidebarOpen ? 3 : 2, 
                  py: 1,
                  justifyContent: isSidebarOpen ? 'flex-start' : 'center',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: 1
                  }
                }}
              >
                <ListItemIcon sx={{ 
                  minWidth: isSidebarOpen ? 40 : 'auto', 
                  color: '#e74c3c',
                  justifyContent: 'center'
                }}>
                  <LogoutIcon />
                </ListItemIcon>
                {isSidebarOpen && (
                  <ListItemText 
                    primary="Logout"
                    primaryTypographyProps={{
                      fontWeight: 500,
                      fontSize: '0.95rem',
                      color: '#e74c3c'
                    }}
                    sx={{ 
                      opacity: isSidebarOpen ? 1 : 0,
                      transition: 'opacity 0.3s ease'
                    }}
                  />
                )}
              </ListItem>
            </Tooltip>
          </Box>
        </Box>
      </Drawer>
      
      <PageWrapper>
        <Toolbar />
        
        {/* Breadcrumb Navigation */}
        <Box sx={{ 
          px: { xs: 2, sm: 3 },
          py: 1.5,
          bgcolor: 'rgba(0,0,0,0.02)',
          borderBottom: '1px solid #f0f0f0'
        }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            mb: 1
          }}>
            <Typography 
              variant="h6" 
              color="black" 
              sx={{ 
                fontSize: '1.2rem', 
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}
            >
              {currentPage}
            </Typography>
            {currentSubPage && (
              <>
                <ChevronRightBreadcrumbIcon sx={{ 
                  fontSize: 20, 
                  color: 'black',
                  opacity: 0.7
                }} />
                <Typography 
                  variant="h6" 
                  color="black" 
                  sx={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 700,
                    letterSpacing: '0.5px'
                  }}
                >
                  {currentSubPage}
                </Typography>
              </>
            )}
          </Box>
          
          {/* Enhanced Horizontal Divider */}
          <Box sx={{
            height: '2px',
            background: 'linear-gradient(90deg, #e0e0e0 0%, #f0f0f0 50%, #e0e0e0 100%)',
            borderRadius: '1px',
            width: '100%'
          }} />
        </Box>
        
        <Box sx={{ 
          flexGrow: 1, 
          p: { xs: 2, sm: 3 },
          pt: 0,
          transition: 'all 0.3s ease',
          width: '100%',
          maxWidth: '100%'
        }}>
              {children}
            </Box>
        </PageWrapper>
      </MainWrapper>
  );
}