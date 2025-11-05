import { useState, useMemo } from 'react';
import FullLayout from '@/layouts/full/FullLayout';
import { router, usePage } from '@inertiajs/react';
import {
  tableHeaderStyle,
  tableContainerStyle,
  tableRowHoverStyle,
  tableCellStyle,
  tablePaginationStyle,
  defaultRowsPerPageOptions
} from '@/components/table/CustomTableStyle';
import StatisticsCard from '@/components/cards/StatisticsCard';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Chip,
  Modal,
  Grid,
  Autocomplete,
  TablePagination,
  InputAdornment,
  Alert,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Grass,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material';

interface Farmer {
  id: number;
  name: string;
  barangay: string;
  contact: string;
  crop: string;
}

interface SeedInventory {
  id: number;
  name: string;
  current_stock: number;
  unit: string;
  status: string;
}

interface Distribution {
  id: number;
  distribution_id: string;
  date: string;
  farmer_name: string;
  farmer_id: number;
  barangay: string;
  seed_type: string;
  crop_type: string | null;
  variety: string | null;
  quantity: string;
  unit: string;
  status: string;
  distributed_by: string;
  notes: string | null;
}

interface Props {
  statistics: {
    totalDistributionsThisMonth: number;
    totalSeedsDistributed: string;
    lowStockItems: number;
    pendingDistributions: number;
  };
  distributions: Distribution[];
  farmers: Farmer[];
  seedInventory: SeedInventory[];
  barangays: string[];
}

function SeedDistribution() {
  const { statistics, distributions, farmers, seedInventory, barangays } = usePage<Props>().props;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBarangay, setFilterBarangay] = useState('all');
  const [filterSeedType, setFilterSeedType] = useState('all');
  const [filterCropType, setFilterCropType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openModal, setOpenModal] = useState(false);
  const [stockWarning, setStockWarning] = useState('');
  const [selectedFarmer, setSelectedFarmer] = useState<Farmer | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    farmer_id: null as number | null,
    seed_type: '',
    crop_type: '',
    variety: '',
    quantity: '',
    unit: 'kg',
    distribution_date: new Date().toISOString().split('T')[0],
    status: 'completed',
    notes: '',
  });

  // Filter distributions
  const filteredDistributions = useMemo(() => {
    return distributions.filter((dist) => {
      const matchesSearch =
        dist.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.distribution_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || dist.status === filterStatus;
      const matchesBarangay = filterBarangay === 'all' || dist.barangay === filterBarangay;
      const matchesSeed = filterSeedType === 'all' || dist.seed_type === filterSeedType;
      const matchesCrop = filterCropType === 'all' || dist.crop_type === filterCropType;
      return matchesSearch && matchesStatus && matchesBarangay && matchesSeed && matchesCrop;
    });
  }, [distributions, searchTerm, filterStatus, filterBarangay, filterSeedType, filterCropType]);

  // Get unique seed and crop types
  const seedTypes = useMemo(() => {
    const types = new Set(distributions.map(d => d.seed_type));
    return Array.from(types);
  }, [distributions]);

  const cropTypes = useMemo(() => {
    const types = new Set(distributions.map(d => d.crop_type).filter(Boolean));
    return Array.from(types) as string[];
  }, [distributions]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenModal = () => {
    setOpenModal(true);
    setStockWarning('');
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedFarmer(null);
    setFormData({
      farmer_id: null,
      seed_type: '',
      crop_type: '',
      variety: '',
      quantity: '',
      unit: 'kg',
      distribution_date: new Date().toISOString().split('T')[0],
      status: 'completed',
      notes: '',
    });
    setStockWarning('');
  };

  const handleFarmerChange = (farmer: Farmer | null) => {
    setSelectedFarmer(farmer);
    setFormData({ 
      ...formData, 
      farmer_id: farmer?.id || null,
      crop_type: farmer?.crop || ''
    });
  };

  const handleSeedTypeChange = (value: string) => {
    setFormData({ ...formData, seed_type: value });
    
    // Check stock availability
    const inventory = seedInventory.find(item => item.name === value);
    if (inventory) {
      if (inventory.status === 'out_of_stock') {
        setStockWarning(`⚠️ ${value} is OUT OF STOCK!`);
      } else if (inventory.status === 'low_stock') {
        setStockWarning(`⚠️ ${value} has LOW STOCK (${inventory.current_stock} ${inventory.unit} remaining)`);
      } else {
        setStockWarning(`✓ Available: ${inventory.current_stock} ${inventory.unit}`);
      }
    }
  };

  const handleQuantityChange = (value: string) => {
    setFormData({ ...formData, quantity: value });
    
    // Check if quantity exceeds stock
    if (formData.seed_type && value) {
      const inventory = seedInventory.find(item => item.name === formData.seed_type);
      if (inventory && parseFloat(value) > inventory.current_stock) {
        setStockWarning(`❌ Quantity exceeds available stock! Available: ${inventory.current_stock} ${inventory.unit}`);
      }
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this distribution record? This action cannot be undone.')) {
      router.delete(`/distributions/seed/${id}`, {
        onSuccess: () => {
          // Success message will be handled by the backend response
        },
        onError: (errors) => {
          console.error(errors);
          alert('Failed to delete distribution record');
        },
      });
    }
  };

  const handleEdit = (distribution: Distribution) => {
    setSelectedFarmer(farmers.find(f => f.id === distribution.farmer_id) || null);
    setFormData({
      farmer_id: distribution.farmer_id,
      seed_type: distribution.seed_type,
      crop_type: distribution.crop_type || '',
      variety: distribution.variety || '',
      quantity: distribution.quantity,
      unit: distribution.unit,
      distribution_date: distribution.date,
      status: distribution.status,
      notes: distribution.notes || '',
    });
    setOpenModal(true);
  };

  const handleSubmit = () => {
    if (!formData.farmer_id || !formData.seed_type || !formData.quantity) {
      alert('Please fill in all required fields');
      return;
    }

    const inventory = seedInventory.find(item => item.name === formData.seed_type);
    if (inventory && parseFloat(formData.quantity) > inventory.current_stock) {
      if (!confirm('Quantity exceeds available stock. Continue anyway?')) {
        return;
      }
    }

    router.post('/distributions/seed', formData, {
      onSuccess: () => {
        handleCloseModal();
      },
      onError: (errors) => {
        console.error(errors);
        alert('Failed to record distribution');
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'pending': return 'warning';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircleIcon fontSize="small" />;
      case 'pending': return <ScheduleIcon fontSize="small" />;
      case 'cancelled': return <WarningIcon fontSize="small" />;
      default: return null;
    }
  };

  return (
    <FullLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            {/* <Typography variant="h4" sx={{ fontWeight: 600, color: '#2C3E50', mb: 0.5 }}>
            Seed Distribution
          </Typography> */}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              background: '#1e293b',
              color: '#ffffff',
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              '&:hover': {
                background: '#1e298b',
              },
            }}
          >
            Add Distribution
          </Button>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <Grass sx={{ fontSize: 28, color: '#000080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Distributions
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.totalDistributionsThisMonth}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                This Month
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Seeds Distributed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.totalSeedsDistributed}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Kilograms
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <WarningIcon sx={{ fontSize: 28, color: '#FFA500' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Low Stock Alert
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.lowStockItems}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Need Restock
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <ScheduleIcon sx={{ fontSize: 28, color: '#808080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Pending
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.pendingDistributions}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                To be Completed
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Filters */}
        <Card sx={{ 
          mb: 3,
          bgcolor: '#2C3E50',
          color: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={1}>
              <Grid item xs={12} sm={6} md={1.8}>
                <TextField
                  fullWidth
                  size="small"
                  label="From Date"
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    if (e.target.value) {
                      router.get('/distributions/seed', { dateFrom: e.target.value, dateTo }, { preserveState: true });
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={1.8}>
                <TextField
                  fullWidth
                  size="small"
                  label="To Date"
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    if (e.target.value) {
                      router.get('/distributions/seed', { dateFrom, dateTo: e.target.value }, { preserveState: true });
                    }
                  }}
                  InputLabelProps={{ shrink: true }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiInputLabel-root': {
                      color: 'rgba(255, 255, 255, 0.7)',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: 'white',
                      '& fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiOutlinedInput-input::placeholder': {
                      color: 'rgba(255, 255, 255, 0.7)',
                      opacity: 1,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth size="small" sx={{
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#667eea',
                    },
                  },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth size="small" sx={{
                  '& .MuiInputLabel-root': {
                    color: 'rgba(255, 255, 255, 0.7)',
                    '&.Mui-focused': {
                      color: '#667eea',
                    },
                  },
                  '& .MuiOutlinedInput-root': {
                    color: 'white',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.5)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#667eea',
                    },
                  },
                  '& .MuiSvgIcon-root': {
                    color: 'white',
                  },
                }}>
                  <InputLabel>Seed Type</InputLabel>
                  <Select
                    value={filterSeedType}
                    label="Seed Type"
                    onChange={(e) => setFilterSeedType(e.target.value)}
                  >
                    <MenuItem value="all">All Seeds</MenuItem>
                    {seedTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Crop Type</InputLabel>
                  <Select
                    value={filterCropType}
                    label="Crop Type"
                    onChange={(e) => setFilterCropType(e.target.value)}
                  >
                    <MenuItem value="all">All Crops</MenuItem>
                    {cropTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2.4}>
                <FormControl fullWidth size="small">
                  <InputLabel>Barangay</InputLabel>
                  <Select
                    value={filterBarangay}
                    label="Barangay"
                    onChange={(e) => setFilterBarangay(e.target.value)}
                  >
                    <MenuItem value="all">All Barangays</MenuItem>
                    {barangays.map((barangay) => (
                      <MenuItem key={barangay} value={barangay}>
                        {barangay}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Distribution Table */}
        <Card sx={tableContainerStyle}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>ID</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Date</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Farmer</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Barangay</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Seed Type</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Crop Type</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Variety</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Quantity</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Status</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Distributed By</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white', textAlign: 'center'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDistributions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <Grass sx={{ fontSize: 48, color: 'white', opacity: 0.7, mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                          No distributions found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                          Try adjusting your filters or add a new distribution
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredDistributions
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((dist) => (
                      <TableRow key={dist.id} sx={tableRowHoverStyle}>
                        <TableCell sx={{...tableCellStyle, color: '#667eea'}}>{dist.distribution_id}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.date}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.farmer_name}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.barangay}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.seed_type}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.crop_type || '-'}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.variety || '-'}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>
                          {dist.quantity} {dist.unit}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          <Chip
                            icon={getStatusIcon(dist.status)}
                            label={dist.status.charAt(0).toUpperCase() + dist.status.slice(1)}
                            color={getStatusColor(dist.status)}
                            size="small"
                            sx={{ height: 20, fontSize: '0.7rem' }}
                          />
                        </TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.distributed_by}</TableCell>
                        <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>
                          {/*  to display the icon to each side */}
                          <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small" 
                                color="secondary"
                                onClick={() => handleEdit(dist)}
                                sx={{ color: '#38BDF8' }}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDelete(dist.id)}
                                sx={{ color: '#EF4444' }}
                              >
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={defaultRowsPerPageOptions}
            component="div"
            count={filteredDistributions.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
             sx={{
              ...tablePaginationStyle,
              color: 'white',
              '.MuiTablePagination-select': {
                color: 'white'
              },
              '.MuiTablePagination-selectLabel': {
                color: 'white'
              },
              '.MuiTablePagination-displayedRows': {
                color: 'white'
              },
              '.MuiTablePagination-selectIcon': {
                color: 'white'
              },
              '.MuiTablePagination-actions': {
                color: 'white',
                '& .MuiIconButton-root': {
                  color: 'white'
                }
              }
            }}
          />
        </Card>

        {/* Add Distribution Modal */}
        <Modal open={openModal} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              maxHeight: '90vh',
              overflow: 'auto',
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Add Seed Distribution
            </Typography>

            {stockWarning && (
              <Alert severity={stockWarning.includes('❌') ? 'error' : stockWarning.includes('⚠️') ? 'warning' : 'info'} sx={{ mb: 2 }}>
                {stockWarning}
              </Alert>
            )}

            {selectedFarmer && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Farmer's Main Crop: <strong>{selectedFarmer.crop}</strong>
              </Alert>
            )}

            <Grid container spacing={3}>
              {/* First row - Farmer and Seed Type */}
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={farmers}
                  getOptionLabel={(option) => `${option.name} (${option.barangay})`}
                  value={farmers.find(f => f.id === formData.farmer_id) || null}
                  onChange={(_e, value) => handleFarmerChange(value)}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Select Beneficiary Farmer" 
                      placeholder="Search farmer by name or barangay"
                      required
                      fullWidth
                      sx={{
                        '& .MuiInputBase-input': {
                          fontSize: '0.875rem',
                        },
                        '& .MuiInputBase-input::placeholder': {
                          color: 'text.secondary',
                          opacity: 0.7
                        },
                        '& .MuiAutocomplete-input': {
                          padding: '0.5rem !important',
                          minWidth: '450px !important'
                        }
                      }}
                    />
                  )}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth 
                  required
                  sx={{
                    '& .MuiSelect-select': {
                      fontSize: '0.875rem',
                      padding: '0.75rem'
                    },
                    '& .MuiSelect-outlined': {
                      minWidth: '250px'
                    }
                  }}
                >
                  <InputLabel>Seed Product</InputLabel>
                  <Select
                    value={formData.seed_type}
                    label="Seed Product"
                    onChange={(e) => handleSeedTypeChange(e.target.value)}
                    placeholder="Select seed type"
                  >
                    {seedInventory.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name} • Stock: {item.current_stock} {item.unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Second row - Date, Status, Unit */}
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Date of Distribution"
                  type="date"
                  value={formData.distribution_date}
                  onChange={(e) => setFormData({ ...formData, distribution_date: e.target.value })}
                  required
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Distribution Status</InputLabel>
                  <Select
                    value={formData.status}
                    label="Distribution Status"
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <MenuItem value="completed">Completed</MenuItem>
                    <MenuItem value="pending">Pending</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth required>
                  <InputLabel>Unit of Measure</InputLabel>
                  <Select
                    value={formData.unit}
                    label="Unit of Measure"
                    onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                  >
                    <MenuItem value="kg">Kilograms (kg)</MenuItem>
                    <MenuItem value="bags">Bags</MenuItem>
                    <MenuItem value="packets">Packets</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* Third row - Distribution Amount */}
              <Grid item xs={12} component="div" sx={{ 
                display: 'flex',
                justifyContent: 'flex-start',
                '& .MuiFormControl-root': {
                  width: '450px'
                }
              }}>
                <TextField
                  fullWidth
                  label="Distribution Amount"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  placeholder="Enter amount"
                  required
                  inputProps={{ 
                    min: 0, 
                    step: 0.01,
                    'aria-label': 'Distribution amount'
                  }}
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      opacity: 0.7
                    }
                  }}
                />
              </Grid>

              {/* Fourth row - Crop Type and Variety */}
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Crop Type"
                  value={formData.crop_type}
                  onChange={(e) => setFormData({ ...formData, crop_type: e.target.value })}
                  placeholder="e.g., Rice, Corn, Vegetables"
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      opacity: 0.7
                    }
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Variety"
                  value={formData.variety}
                  onChange={(e) => setFormData({ ...formData, variety: e.target.value })}
                  placeholder="e.g., RC222, IPB Var4"
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      opacity: 0.7
                    }
                  }}
                />
              </Grid>

              {/* Last row - Notes */}
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter any additional information or remarks about this distribution"
                  helperText="Optional: Add any relevant details about the distribution"
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      fontSize: '0.875rem',
                      color: 'text.secondary',
                      opacity: 0.7
                    }
                  }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleSubmit} variant="contained" color="primary">
                Save Distribution
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </FullLayout>
  );
}

export default SeedDistribution;
