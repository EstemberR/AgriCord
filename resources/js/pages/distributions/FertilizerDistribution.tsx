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
  Dialog,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Science as ScienceIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';

interface Farmer {
  id: number;
  name: string;
  barangay: string;
  contact: string;
}

interface FertilizerInventory {
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
  fertilizer_type: string;
  quantity: string;
  unit: string;
  status: string;
  distributed_by: string;
  notes: string | null;
}

interface Props {
  statistics: {
    totalDistributionsThisMonth: number;
    totalFertilizerDistributed: string;
    lowStockItems: number;
    pendingDistributions: number;
  };
  distributions: Distribution[];
  farmers: Farmer[];
  fertilizerInventory: FertilizerInventory[];
  barangays: string[];
}

function FertilizerDistribution() {
  const { statistics, distributions, farmers, fertilizerInventory, barangays } = usePage<Props>().props;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterBarangay, setFilterBarangay] = useState('all');
  const [filterFertilizerType, setFilterFertilizerType] = useState('all');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [openModal, setOpenModal] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedDistribution, setSelectedDistribution] = useState<Distribution | null>(null);
  const [stockWarning, setStockWarning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortField, setSortField] = useState<'date' | 'farmer_name' | 'quantity'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Fertilizer type options (matching common types in Philippines agriculture)
  const fertilizerTypeOptions = [
    'Urea',
    'NPK (14-14-14)',
    'NPK (16-16-16)',
    'Complete Fertilizer',
    'Organic Fertilizer',
    'Ammonium Sulfate',
    'Muriate of Potash',
    'Other',
  ];
  
  // Form state
  const [formData, setFormData] = useState({
    farmer_id: null as number | null,
    fertilizer_type: '',
    quantity: '',
    unit: 'kg',
    distribution_date: new Date().toISOString().split('T')[0],
    status: 'completed',
    notes: '',
  });

  // Filter distributions
  const filteredDistributions = useMemo(() => {
    let filtered = distributions.filter((dist) => {
      const matchesSearch =
        dist.farmer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dist.distribution_id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = filterStatus === 'all' || dist.status === filterStatus;
      const matchesBarangay = filterBarangay === 'all' || dist.barangay === filterBarangay;
      const matchesFertilizer = filterFertilizerType === 'all' || dist.fertilizer_type === filterFertilizerType;
      
      // Date range filter
      let matchesDateRange = true;
      if (dateFrom) {
        const distDate = new Date(dist.date);
        const fromDate = new Date(dateFrom);
        matchesDateRange = matchesDateRange && distDate >= fromDate;
      }
      if (dateTo) {
        const distDate = new Date(dist.date);
        const toDate = new Date(dateTo);
        matchesDateRange = matchesDateRange && distDate <= toDate;
      }
      
      return matchesSearch && matchesStatus && matchesBarangay && matchesFertilizer && matchesDateRange;
    });

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0;
      
      if (sortField === 'date') {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else if (sortField === 'farmer_name') {
        comparison = a.farmer_name.localeCompare(b.farmer_name);
      } else if (sortField === 'quantity') {
        comparison = parseFloat(a.quantity) - parseFloat(b.quantity);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [distributions, searchTerm, filterStatus, filterBarangay, filterFertilizerType, dateFrom, dateTo, sortField, sortDirection]);

  // Get unique fertilizer types from distributions
  const fertilizerTypes = useMemo(() => {
    const types = new Set(distributions.map(d => d.fertilizer_type));
    return Array.from(types);
  }, [distributions]);

  const handleSort = (field: 'date' | 'farmer_name' | 'quantity') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

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
    setEditModalOpen(false);
    setSelectedDistribution(null);
    setFormData({
      farmer_id: null,
      fertilizer_type: '',
      quantity: '',
      unit: 'kg',
      distribution_date: new Date().toISOString().split('T')[0],
      status: 'completed',
      notes: '',
    });
    setStockWarning('');
  };

  const handleEdit = (distribution: Distribution) => {
    setSelectedDistribution(distribution);
    setFormData({
      farmer_id: distribution.farmer_id,
      fertilizer_type: distribution.fertilizer_type,
      quantity: distribution.quantity,
      unit: distribution.unit,
      distribution_date: distribution.date,
      status: distribution.status,
      notes: distribution.notes || '',
    });
    setEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (!selectedDistribution) return;
    
    setIsSubmitting(true);

    router.put(`/distributions/fertilizer/${selectedDistribution.id}`, formData, {
      onSuccess: () => {
        handleCloseModal();
        setIsSubmitting(false);
      },
      onError: (errors) => {
        console.error(errors);
        alert('Failed to update distribution. Please try again.');
        setIsSubmitting(false);
      },
    });
  };

  const handleDelete = (distribution: Distribution) => {
    if (confirm('Are you sure you want to delete this distribution? This action cannot be undone.')) {
      router.delete(`/distributions/fertilizer/${distribution.id}`, {
        onSuccess: () => {
          // The page will automatically refresh with updated data
        },
        onError: () => {
          alert('Failed to delete distribution. Please try again.');
        },
      });
    }
  };

  const handleFertilizerTypeChange = (value: string) => {
    setFormData({ ...formData, fertilizer_type: value });
    
    // Check stock availability
    const inventory = fertilizerInventory.find(item => item.name === value);
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
    if (formData.fertilizer_type && value) {
      const inventory = fertilizerInventory.find(item => item.name === formData.fertilizer_type);
      if (inventory && parseFloat(value) > inventory.current_stock) {
        setStockWarning(`❌ Quantity exceeds available stock! Available: ${inventory.current_stock} ${inventory.unit}`);
      }
    }
  };

  const handleSubmit = () => {
    // Validate required fields
    if (!formData.farmer_id || !formData.fertilizer_type || !formData.quantity) {
      alert('Please fill in all required fields (Farmer, Fertilizer Type, Quantity)');
      return;
    }

    // Validate quantity is greater than 0
    if (parseFloat(formData.quantity) <= 0) {
      alert('Quantity must be greater than 0');
      return;
    }

    // Check stock availability before submitting
    const inventory = fertilizerInventory.find(item => item.name === formData.fertilizer_type);
    if (inventory) {
      if (inventory.status === 'out_of_stock') {
        alert(`${formData.fertilizer_type} is OUT OF STOCK. Cannot proceed with distribution.`);
        return;
      }
      
      if (parseFloat(formData.quantity) > inventory.current_stock) {
        const proceed = confirm(
          `Warning: Quantity (${formData.quantity} ${formData.unit}) exceeds available stock (${inventory.current_stock} ${inventory.unit}).\n\nDo you want to continue anyway?`
        );
        if (!proceed) return;
      }
    }

    setIsSubmitting(true);

    router.post('/distributions/fertilizer', formData, {
      onSuccess: () => {
        handleCloseModal();
        setIsSubmitting(false);
      },
      onError: (errors) => {
        console.error(errors);
        alert('Failed to record distribution. Please try again.');
        setIsSubmitting(false);
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
        {/* Page Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            {/* <Typography variant="h4" sx={{ fontWeight: 700, color: '#2C3E50', mb: 0.5 }}>
              Fertilizer Distribution
            </Typography> */}
          </Box>
          <Button
            variant="contained"
            size="large"
            startIcon={<AddIcon />}
            onClick={handleOpenModal}
            sx={{
              background: '#1e293b',
              color: 'white',
              px: 3,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '0.95rem',
              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: '#1e298b',
                boxShadow: '0 6px 16px rgba(102, 126, 234, 0.4)',
                transform: 'translateY(-2px)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            Add Distribution
          </Button>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          {/* Total Distributions Card */}
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <ScienceIcon sx={{ fontSize: 28, color: '#000080' }} />
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

          {/* Total Distributed Card */}
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <CheckCircleIcon sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Distributed
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.totalFertilizerDistributed}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Kilograms
              </Typography>
            </CardContent>
          </Card>

          {/* Low Stock Card */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ bgcolor: 'rgba(255, 152, 0, 0.1)', color: '#F59E0B', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>
                  Warning
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  Need Restock
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {/* Pending Card */}
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ bgcolor: 'rgba(244, 67, 54, 0.1)', color: '#f44336', px: 1, py: 0.25, borderRadius: 1, fontWeight: 600 }}>
                  Awaiting
                </Typography>
                <Typography variant="caption" sx={{ opacity: 0.7 }}>
                  To be Completed
                </Typography>
              </Box>
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
            <Grid container spacing={3}>
              <Grid item xs={12} sm={4} md={1}>
                <TextField
                  fullWidth
                  size="small"
                  label="From Date" 
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    if (e.target.value) {
                      router.get('/distributions/fertilizer', { dateFrom: e.target.value, dateTo }, { preserveState: true });
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
              <Grid item xs={12} sm={4} md={1}>
                <TextField
                  fullWidth
                  size="small"
                  label="To Date"
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    if (e.target.value) {
                      router.get('/distributions/fertilizer', { dateFrom, dateTo: e.target.value }, { preserveState: true });
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
              <Grid item xs={12} md="auto">
                <TextField 
                  size="small"
                  placeholder="Search farmer name or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#667eea' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&:hover fieldset': {
                        borderColor: '#667eea',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#667eea',
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                >
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
              <Grid item xs={12} sm={6} md={2}>
                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                >
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
              <Grid item xs={12} md={2}>
                <FormControl 
                  fullWidth 
                  size="small"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: '#667eea',
                      },
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                      color: '#667eea',
                    },
                  }}
                >
                  <InputLabel>Fertilizer Type</InputLabel>
                  <Select
                    value={filterFertilizerType}
                    label="Fertilizer Type"
                    onChange={(e) => setFilterFertilizerType(e.target.value)}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    {fertilizerTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
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
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Distribution ID</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Date</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Farmer Name</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Barangay</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Fertilizer Type</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Quantity</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Status</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Distributed By</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white', textAlign: 'center'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredDistributions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <ScienceIcon sx={{ fontSize: 48, color: 'white', opacity: 0.7, mb: 1 }} />
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
                      <TableRow 
                        key={dist.id} 
                        sx={tableRowHoverStyle}
                      >
                        <TableCell sx={{ ...tableCellStyle, fontWeight: 600, color: '#667eea' }}>{dist.distribution_id}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.date}</TableCell>
                        <TableCell sx={{ ...tableCellStyle, fontWeight: 500, color: 'white' }}>{dist.farmer_name}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.barangay}</TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.fertilizer_type}</TableCell>
                        <TableCell sx={{ ...tableCellStyle, fontWeight: 600, color: 'white' }}>
                          {dist.quantity} {dist.unit}
                        </TableCell>
                        <TableCell sx={tableCellStyle}>
                          <Chip
                            label={dist.status.charAt(0).toUpperCase() + dist.status.slice(1)}
                            color={getStatusColor(dist.status)}
                            size="small"
                            sx={{ height: 22, fontSize: '0.75rem', fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell sx={{...tableCellStyle, color: 'white'}}>{dist.distributed_by}</TableCell>
                        <TableCell sx={{ ...tableCellStyle, textAlign: 'center' }}>
                          <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                            <Tooltip title="Edit">
                              <IconButton 
                                size="small"
                                sx={{ color: '#000080' }}
                                onClick={() => handleEdit(dist)}
                              >
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton 
                                size="small" 
                                color="error"
                                onClick={() => handleDelete(dist)}
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
            // White Font Color for Pagination
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
        <Dialog 
          open={openModal} 
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          sx={{
            '& .MuiBackdrop-root': {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              backdropFilter: 'blur(4px)',
            },
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 600 },
              maxHeight: '90vh',
              overflow: 'auto',
              bgcolor: '#1e293b',
              borderRadius: 2,
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
              border: '1px solid rgba(255,255,255,0.1)',
            }}
          >
            <Box
              sx={{
                p: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                borderBottom: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <Box
                sx={{
                  bgcolor: 'rgba(255,255,255,0.1)',
                  borderRadius: 1.5,
                  p: 1,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontSize: '1.5rem' }}>🌿</Typography>
              </Box>
              <Typography
                variant="h6"
                sx={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '1.25rem',
                }}
              >
                Add Fertilizer Distribution
              </Typography>
              <IconButton
                onClick={handleCloseModal}
                sx={{
                  ml: 'auto',
                  color: 'white',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                    transform: 'rotate(90deg)',
                    transition: 'all 0.2s ease-in-out',
                  },
                }}
              >
                <CancelIcon />
              </IconButton>
            </Box>

            <Box sx={{ p: 3, color: 'white' }}>
              {stockWarning && (
                <Alert severity={stockWarning.includes('❌') ? 'error' : stockWarning.includes('⚠️') ? 'warning' : 'info'} sx={{ mb: 2 }}>
                  {stockWarning}
                </Alert>
              )}

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Autocomplete
                    options={farmers}
                    getOptionLabel={(option) => `${option.name} (${option.barangay})`}
                    value={farmers.find(f => f.id === formData.farmer_id) || null}
                    onChange={(_e, value) => setFormData({ ...formData, farmer_id: value?.id || null })}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Beneficiary Farmer"
                        placeholder="Search farmer by name or barangay"
                        required
                        fullWidth
                        sx={{
                          '& .MuiInputBase-input': {
                            color: 'white',
                            fontSize: '0.875rem',
                          },
                          '& .MuiInputLabel-root': {
                            color: 'rgba(255, 255, 255, 0.7)',
                          },
                          '& .MuiInputLabel-root.Mui-focused': {
                            color: '#667eea',
                          },
                          '& .MuiOutlinedInput-root': {
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
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Fertilizer Product
                    </InputLabel>
                    <Select
                      value={formData.fertilizer_type}
                      label="Fertilizer Product"
                      onChange={(e) => handleFertilizerTypeChange(e.target.value)}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      }}
                    >
                      {fertilizerInventory.map((item) => (
                        <MenuItem key={item.id} value={item.name}>
                          {item.name} • Stock: {item.current_stock} {item.unit}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    label="Date of Distribution"
                    type="date"
                    value={formData.distribution_date}
                    onChange={(e) => setFormData({ ...formData, distribution_date: e.target.value })}
                    required
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiInputBase-root': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiOutlinedInput-root': {
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
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Distribution Status
                    </InputLabel>
                    <Select
                      value={formData.status}
                      label="Distribution Status"
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      }}
                    >
                      <MenuItem value="completed">Completed</MenuItem>
                      <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth required>
                    <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                      Unit of Measure
                    </InputLabel>
                    <Select
                      value={formData.unit}
                      label="Unit of Measure"
                      onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                      sx={{
                        color: 'white',
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.3)',
                        },
                        '&:hover .MuiOutlinedInput-notchedOutline': {
                          borderColor: 'rgba(255, 255, 255, 0.5)',
                        },
                        '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#667eea',
                        },
                        '& .MuiSvgIcon-root': {
                          color: 'white',
                        },
                      }}
                    >
                      <MenuItem value="kg">Kilograms (kg)</MenuItem>
                      <MenuItem value="bags">Bags</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Distribution Amount"
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    placeholder="Enter amount"
                    required
                    inputProps={{ min: 0, step: 0.01 }}
                    sx={{
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiOutlinedInput-root': {
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
                    }}
                  />
                </Grid>

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
                      '& .MuiInputBase-input': {
                        color: 'white',
                      },
                      '& .MuiInputLabel-root': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                      '& .MuiOutlinedInput-root': {
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
                      '& .MuiFormHelperText-root': {
                        color: 'rgba(255, 255, 255, 0.5)',
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                <Button
                  onClick={handleCloseModal}
                  variant="outlined"
                  disabled={isSubmitting}
                  sx={{
                    borderColor: 'rgba(255,255,255,0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'rgba(255,255,255,0.5)',
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  variant="contained"
                  disabled={isSubmitting}
                  sx={{
                    bgcolor: '#667eea',
                    color: 'white',
                    '&:hover': {
                      bgcolor: '#5a6fd6',
                    },
                  }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Distribution'}
                </Button>
              </Box>
            </Box>
          </Box>
        </Dialog>

        {/* Edit Distribution Modal */}
        <Modal open={editModalOpen} onClose={handleCloseModal}>
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
              Edit Fertilizer Distribution
            </Typography>

            {stockWarning && (
              <Alert severity={stockWarning.includes('❌') ? 'error' : stockWarning.includes('⚠️') ? 'warning' : 'info'} sx={{ mb: 2 }}>
                {stockWarning}
              </Alert>
            )}

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Autocomplete
                  options={farmers}
                  getOptionLabel={(option) => `${option.name} (${option.barangay})`}
                  value={farmers.find(f => f.id === formData.farmer_id) || null}
                  onChange={(_e, value) => setFormData({ ...formData, farmer_id: value?.id || null })}
                  renderInput={(params) => (
                    <TextField 
                      {...params} 
                      label="Select Beneficiary Farmer" 
                      required
                      sx={{
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
                <FormControl fullWidth required>
                  <InputLabel>Fertilizer Product</InputLabel>
                  <Select
                    value={formData.fertilizer_type}
                    label="Fertilizer Product"
                    onChange={(e) => handleFertilizerTypeChange(e.target.value)}
                  >
                    {fertilizerInventory.map((item) => (
                      <MenuItem key={item.id} value={item.name}>
                        {item.name} • Stock: {item.current_stock} {item.unit}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

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
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Distribution Amount"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleQuantityChange(e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Additional Notes"
                  multiline
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Enter any additional information or remarks about this distribution"
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button 
                onClick={handleUpdate} 
                variant="contained" 
                color="primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Update Distribution'}
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </FullLayout>
  );
}

export default FertilizerDistribution;
