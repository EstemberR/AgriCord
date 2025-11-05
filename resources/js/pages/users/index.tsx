import { useState, useMemo } from 'react';
import { Head } from '@inertiajs/react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  Button,
  Paper,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Tooltip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Visibility as VisibilityIcon,
  History as HistoryIcon,
  Edit as EditIcon,
  VpnKey as VpnKeyIcon,
  Assignment as AssignmentIcon,
  FileDownload as FileDownloadIcon,
  Groups as GroupsIcon,
  AdminPanelSettings as AdminPanelSettingsIcon,
  People as PeopleIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import FullLayout from '@/layouts/full/FullLayout';
import { router } from '@inertiajs/react';

interface Farmer {
  id: number;
  farmer_id: string;
  full_name: string;
  contact_number: string;
  address_barangay: string;
  farm_name: string;
  status: string;
  created_at: string;
  registration_date: string;
}

interface Admin {
  id: number;
  admin_id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  last_login: string;
  last_login_formatted: string;
  created_at: string;
}

interface UsersPageProps {
  statistics: {
    farmers: {
      total: number;
      active: number;
    };
    admins: {
      total: number;
      active: number;
    };
    totalUsers: number;
  };
  farmers: Farmer[];
  admins: Admin[];
}

function UsersPage({ statistics, farmers, admins }: UsersPageProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [barangayFilter, setBarangayFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);

  // Get unique barangays for filter
  const barangays = useMemo(() => {
    const unique = [...new Set(farmers.map(f => f.address_barangay))];
    return unique.sort();
  }, [farmers]);

  // Filter farmers
  const filteredFarmers = useMemo(() => {
    return farmers.filter(farmer => {
      const matchesSearch = 
        farmer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.farmer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        farmer.contact_number.includes(searchQuery);
      
      const matchesStatus = statusFilter === 'all' || farmer.status === statusFilter;
      const matchesBarangay = barangayFilter === 'all' || farmer.address_barangay === barangayFilter;
      
      return matchesSearch && matchesStatus && matchesBarangay;
    });
  }, [farmers, searchQuery, statusFilter, barangayFilter]);

  // Filter admins
  const filteredAdmins = useMemo(() => {
    return admins.filter(admin => {
      const matchesSearch = 
        admin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || admin.status === statusFilter;
      const matchesRole = roleFilter === 'all' || admin.role === roleFilter;
      
      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [admins, searchQuery, statusFilter, roleFilter]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    setSearchQuery('');
    setStatusFilter('all');
    setBarangayFilter('all');
    setRoleFilter('all');
    setPage(0);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'error';
      case 'Pending Verification':
        return 'warning';
      case 'Suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const currentData = activeTab === 0 ? filteredFarmers : filteredAdmins;
  const paginatedData = currentData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  return (
    <FullLayout>
      <Head title="Users Management" />

      <Box sx={{ p: 3 }}>
        {/* Summary Cards */}
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 4
        }}>
          {/* Farmers Card */}
          <Card sx={{ 
            bgcolor: '#1e293b',
            color: 'common.white',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
            }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                gap: 1.5
              }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2, 
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PeopleIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'common.white'
                }}>
                  System Users
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {statistics.farmers.total}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${statistics.farmers.active} Active`}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {statistics.farmers.total - statistics.farmers.active} Inactive
                  </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Admin Users Card */}
          <Card sx={{ 
            bgcolor: '#1e293b',
            color: 'common.white',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
            }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                gap: 1.5
              }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2, 
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <AdminPanelSettingsIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'common.white'
                }}>
                  Admin Users
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {statistics.admins.total}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Chip 
                    label={`${statistics.admins.active} Active`}
                    size="small"
                    sx={{ 
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: 'white',
                      fontWeight: 600,
                      height: 20,
                      fontSize: '0.7rem'
                    }}
                  />
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    {statistics.admins.total - statistics.admins.active} Inactive
                  </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Total Users Card */}
          <Card sx={{ 
            bgcolor: '#1e293b',
            color: 'common.white',
            borderRadius: 2,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            border: '1px solid',
            borderColor: 'divider',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
            }
          }}>
            <CardContent sx={{ p: 2.5 }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                mb: 2,
                gap: 1.5
              }}>
                <Box sx={{ 
                  bgcolor: 'rgba(255,255,255,0.1)', 
                  borderRadius: 2, 
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUpIcon sx={{ fontSize: 28 }} />
                </Box>
                <Typography variant="h6" sx={{ 
                  fontWeight: 600,
                  fontSize: '1.1rem',
                  color: 'common.white'
                }}>
                  Total Users
                  </Typography>
                </Box>
                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                  {statistics.totalUsers}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TrendingUpIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" sx={{ opacity: 0.9 }}>
                    Combined count
                  </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Tabbed Table Section */}
        <Card sx={{ boxShadow: 3 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs 
              value={activeTab} 
              onChange={handleTabChange}
              sx={{
                '& .MuiTab-root': {
                  fontWeight: 600,
                  fontSize: '1rem',
                  textTransform: 'none',
                  minHeight: 64,
                  color: '#ffffff'
                },
              }}
            >
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <GroupsIcon />
                    <span>Farmers ({filteredFarmers.length})</span>
                  </Box>
                }
              />
              <Tab 
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettingsIcon />
                    <span>Admins ({filteredAdmins.length})</span>
                  </Box>
                }
              />
            </Tabs>
          </Box>

          <CardContent>
            {/* Search and Filters */}
            <Box sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1.5fr 1.5fr' },
              gap: 2,
              mb: 3
            }}>
              <TextField
                fullWidth
                placeholder={activeTab === 0 ? "Search by name, ID, or contact..." : "Search by name or email..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  {activeTab === 0 && <MenuItem value="Pending Verification">Pending</MenuItem>}
                  {activeTab === 1 && <MenuItem value="Suspended">Suspended</MenuItem>}
                </Select>
              </FormControl>

              {activeTab === 0 ? (
                <FormControl fullWidth>
                  <InputLabel>Barangay</InputLabel>
                  <Select
                    value={barangayFilter}
                    label="Barangay"
                    onChange={(e) => setBarangayFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Barangays</MenuItem>
                    {barangays.map((barangay) => (
                      <MenuItem key={barangay} value={barangay}>
                        {barangay}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    value={roleFilter}
                    label="Role"
                    onChange={(e) => setRoleFilter(e.target.value)}
                  >
                    <MenuItem value="all">All Roles</MenuItem>
                    <MenuItem value="Super Admin">Super Admin</MenuItem>
                    <MenuItem value="Admin">Admin</MenuItem>
                    <MenuItem value="Field Officer">Field Officer</MenuItem>
                    <MenuItem value="Data Entry">Data Entry</MenuItem>
                  </Select>
                </FormControl>
              )}

              <Button
                fullWidth
                variant="outlined"
                startIcon={<FileDownloadIcon />}
                sx={{ height: '56px' }}
              >
                Export to Excel
              </Button>
            </Box>

            {/* Table */}
            <TableContainer component={Paper} sx={{ maxHeight: 600 }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    {activeTab === 0 ? (
                      <>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Farmer ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Full Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Contact Number</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Barangay</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Crop Type</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Registration Date</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45', textAlign: 'center' }}>Actions</TableCell>
                      </>
                    ) : (
                      <>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Admin ID</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Full Name</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45' }}>Last Login</TableCell>
                        <TableCell sx={{ fontWeight: 700, bgcolor: '#0B0B45', textAlign: 'center' }}>Actions</TableCell>
                      </>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {paginatedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} sx={{ textAlign: 'center', py: 8 }}>
                        <Typography variant="h6" color="text.secondary">
                          No {activeTab === 0 ? 'farmers' : 'admins'} found
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Try adjusting your search or filters
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((row) => (
                      <TableRow 
                        key={row.id}
                        hover
                        sx={{ 
                          cursor: 'pointer',
                          '&:hover': { bgcolor: '#f5f5f5' }
                        }}
                      >
                        {activeTab === 0 ? (
                          <>
                            <TableCell sx={{ fontWeight: 600 }}>{(row as Farmer).farmer_id}</TableCell>
                            <TableCell>{(row as Farmer).full_name}</TableCell>
                            <TableCell>{(row as Farmer).contact_number}</TableCell>
                            <TableCell>{(row as Farmer).address_barangay}</TableCell>
                            <TableCell>{(row as Farmer).farm_name}</TableCell>
                            <TableCell>
                              <Chip
                                label={(row as Farmer).status}
                                color={getStatusColor((row as Farmer).status) as 'success' | 'error' | 'warning' | 'default'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>{(row as Farmer).registration_date}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Tooltip title="View Profile">
                                  <IconButton 
                                    size="small" 
                                    color="primary"
                                    onClick={() => router.visit(`/farmers`)}
                                  >
                                    <VisibilityIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View History">
                                  <IconButton 
                                    size="small" 
                                    color="info"
                                    onClick={() => router.visit(`/farmers/history`)}
                                  >
                                    <HistoryIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </>
                        ) : (
                          <>
                            <TableCell sx={{ fontWeight: 600 }}>{(row as Admin).admin_id}</TableCell>
                            <TableCell>{(row as Admin).name}</TableCell>
                            <TableCell>{(row as Admin).email}</TableCell>
                            <TableCell>
                              <Chip
                                label={(row as Admin).role}
                                color="primary"
                                variant="outlined"
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>
                              <Chip
                                label={(row as Admin).status}
                                color={getStatusColor((row as Admin).status) as 'success' | 'error' | 'warning' | 'default'}
                                size="small"
                                sx={{ fontWeight: 600 }}
                              />
                            </TableCell>
                            <TableCell>{(row as Admin).last_login_formatted}</TableCell>
                            <TableCell>
                              <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                                <Tooltip title="Edit User">
                                  <IconButton size="small" color="primary">
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="View Activity">
                                  <IconButton size="small" color="info">
                                    <AssignmentIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Reset Password">
                                  <IconButton size="small" color="warning">
                                    <VpnKeyIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </Box>
                            </TableCell>
                          </>
                        )}
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <TablePagination
              component="div"
              count={currentData.length}
              page={page}
              onPageChange={handleChangePage}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleChangeRowsPerPage}
              rowsPerPageOptions={[10, 25, 50, 100]}
            />
          </CardContent>
        </Card>
      </Box>
    </FullLayout>
  );
}

export default UsersPage;
