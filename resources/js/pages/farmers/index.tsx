import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import FullLayout from '@/layouts/full/FullLayout';
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
  Button,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Checkbox,
  Chip,
  Menu,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import {
  Search as SearchIcon,
  GetApp as GetAppIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  Add as AddIcon,
  MoreVert as MoreVertIcon,
} from '@mui/icons-material';
import AddFarmerModal from '@/components/farmers/AddFarmerModal';

interface Farmer {
  id: number;
  farmer_id: string;
  full_name: string;
  date_of_birth?: string;
  gender?: string;
  civil_status?: string;
  contact_number: string;
  email?: string;
  address_purok?: string;
  address_barangay: string;
  address_municipality: string;
  address_province?: string;
  nationality?: string;
  voters_id_number?: string;
  voters_certification_number?: string;
  passport_photo_path?: string;
  farm_name: string;
  farm_location: string;
  farm_size: number;
  land_ownership_type?: string;
  farming_experience_months?: number;
  farming_experience_years?: number;
  emergency_contact_person?: string;
  emergency_contact_number?: string;
  created_at: string;
  updated_at: string;
  status: 'Active' | 'Inactive' | 'Pending Verification';
}

interface FarmerRegistrationProps {
  farmers: Farmer[];
  stats?: {
    total: number;
    active: number;
    newThisMonth: number;
    inactive: number;
  };
}

type Order = 'asc' | 'desc';
type OrderBy = keyof Farmer;

export default function FarmerRegistration({ farmers = [], stats }: FarmerRegistrationProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterBarangay, setFilterBarangay] = useState('');
  const [filterCropType, setFilterCropType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [order, setOrder] = useState<Order>('asc');
  const [orderBy, setOrderBy] = useState<OrderBy>('full_name');
  const [selected, setSelected] = useState<number[]>([]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [currentFarmer, setCurrentFarmer] = useState<Farmer | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [statusDialogOpen, setStatusDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<'Active' | 'Inactive' | 'Pending Verification'>('Active');
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<Farmer>>({});

  // Predefined crop types
  const cropTypes = [
    'Rice (Palay)',
    'Corn',
    'Coconut',
    'Sugarcane',
    'Banana',
    'Cassava',
  ];

  // Get unique barangays from farmer data
  const barangays = Array.from(new Set(farmers.map((f) => f.address_barangay)))
    .filter(Boolean)
    .sort();

  // Statistics with default values
  const statistics = stats || {
    total: farmers.length,
    active: farmers.filter((f) => f.status === 'Active').length,
    newThisMonth: 0,
    inactive: 0,
  };

  // Filter and search logic
  const filteredFarmers = farmers.filter((farmer) => {
    const matchesSearch =
      farmer.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.farmer_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      farmer.address_municipality.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesBarangay = !filterBarangay || farmer.address_barangay === filterBarangay;
    const matchesCropType = !filterCropType || farmer.farm_name === filterCropType;
    const matchesStatus = !filterStatus || farmer.status === filterStatus;

    return matchesSearch && matchesBarangay && matchesCropType && matchesStatus;
  });

  // Sorting logic
  const sortedFarmers = filteredFarmers.sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    
    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return order === 'asc' 
        ? aValue.localeCompare(bValue) 
        : bValue.localeCompare(aValue);
    }
    
    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return order === 'asc' ? aValue - bValue : bValue - aValue;
    }
    
    return 0;
  });

  // Pagination
  const paginatedFarmers = sortedFarmers.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleRequestSort = (property: OrderBy) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelected(paginatedFarmers.map((f) => f.id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>, farmer: Farmer) => {
    console.log('Menu opened for farmer:', farmer);
    setAnchorEl(event.currentTarget);
    setCurrentFarmer(farmer);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    // Don't clear currentFarmer immediately - let action handlers use it first
  };

  const handleDelete = (farmer: Farmer) => {
    console.log('Delete handler called for farmer:', farmer);
    setCurrentFarmer(farmer);
    setDeleteDialogOpen(true);
    handleMenuClose();
  };

  const handleView = (farmer: Farmer) => {
    console.log('View handler called for farmer:', farmer);
    setCurrentFarmer(farmer);
    setViewDialogOpen(true);
    handleMenuClose();
  };

  const handleEdit = (farmer: Farmer) => {
    console.log('Edit handler called for farmer:', farmer);
    setCurrentFarmer(farmer);
    setEditFormData(farmer);
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleStatusChange = (farmer: Farmer) => {
    console.log('Status change handler called for farmer:', farmer);
    setCurrentFarmer(farmer);
    setNewStatus(farmer.status);
    setStatusDialogOpen(true);
    handleMenuClose();
  };

  const confirmStatusChange = () => {
    console.log('Confirming status change for farmer:', currentFarmer, 'New status:', newStatus);
    if (currentFarmer) {
      router.put(`/farmers/${currentFarmer.id}/status`, 
        { status: newStatus },
        {
          onSuccess: () => {
            console.log('Status change successful');
            setStatusDialogOpen(false);
            setCurrentFarmer(null);
          },
          onError: (errors) => {
            console.error('Status change error:', errors);
            alert('Failed to change status. Check console for errors.');
          },
        }
      );
    } else {
      console.error('No current farmer set!');
    }
  };

  const handleEditSave = () => {
    console.log('Edit save called. Current farmer:', currentFarmer);
    console.log('Edit form data:', editFormData);
    
    if (currentFarmer) {
      // Only send editable fields, exclude readonly fields like id, farmer_id, created_at, etc.
      const dataToSend = {
        full_name: editFormData.full_name,
        date_of_birth: editFormData.date_of_birth,
        gender: editFormData.gender,
        civil_status: editFormData.civil_status,
        contact_number: editFormData.contact_number,
        email: editFormData.email,
        address_purok: editFormData.address_purok,
        address_barangay: editFormData.address_barangay,
        address_municipality: editFormData.address_municipality,
        address_province: editFormData.address_province,
        nationality: editFormData.nationality,
        farm_name: editFormData.farm_name,
        farm_location: editFormData.farm_location,
        farm_size: editFormData.farm_size,
        land_ownership_type: editFormData.land_ownership_type,
        farming_experience_months: editFormData.farming_experience_months,
        farming_experience_years: editFormData.farming_experience_years,
        emergency_contact_person: editFormData.emergency_contact_person,
        emergency_contact_number: editFormData.emergency_contact_number,
      };
      
      console.log('Sending data to /farmers/' + currentFarmer.id, dataToSend);
      router.put(`/farmers/${currentFarmer.id}`, dataToSend, {
        onSuccess: () => {
          console.log('Edit successful');
          setEditDialogOpen(false);
          setCurrentFarmer(null);
          setEditFormData({});
        },
        onError: (errors) => {
          console.error('Edit save error:', errors);
          alert('Failed to save changes. Check console for errors.');
        },
      });
    } else {
      console.error('No current farmer to edit!');
    }
  };

  const confirmDelete = () => {
    console.log('Confirming delete for farmer:', currentFarmer);
    if (currentFarmer) {
      router.delete(`/farmers/${currentFarmer.id}`, {
        onSuccess: () => {
          console.log('Delete successful');
          setDeleteDialogOpen(false);
          setCurrentFarmer(null);
        },
        onError: (errors) => {
          console.error('Delete error:', errors);
          alert('Failed to delete farmer. Check console for errors.');
        },
      });
    } else {
      console.error('No current farmer to delete!');
    }
  };

  const handleExport = (format: 'excel' | 'pdf') => {
    // Get the farmers to export (either selected or all filtered)
    const farmersToExport = selected.length > 0 
      ? sortedFarmers.filter(f => selected.includes(f.id))
      : sortedFarmers;

    // Create CSV data
    const headers = ['Farmer ID', 'Full Name', 'Contact', 'Barangay', 'Municipality', 'Farm Location', 'Farm Size (ha)', 'Crop Type', 'Registration Date', 'Status'];
    const csvData = farmersToExport.map(farmer => [
      farmer.farmer_id,
      farmer.full_name,
      farmer.contact_number,
      farmer.address_barangay,
      farmer.address_municipality,
      farmer.farm_location,
      farmer.farm_size || 'N/A',
      farmer.farm_name,
      new Date(farmer.created_at).toLocaleDateString(),
      farmer.status,
    ]);

    // Convert to CSV string
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `farmers_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    console.log(`Exported ${farmersToExport.length} farmers to ${format}`);
  };

  const handleBulkDelete = () => {
    if (selected.length > 0) {
      if (confirm(`Are you sure you want to delete ${selected.length} farmer(s)? This action cannot be undone.`)) {
        router.delete('/farmers/bulk-delete', {
          data: { ids: selected },
          onSuccess: () => setSelected([]),
          preserveScroll: true,
        });
      }
    }
  };

  return (
    <FullLayout>
      <Head title="Farmer Registration" />
      <Box sx={{ p: 3 }}>
        {/* Header with Add Button */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            {/* <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1e3a8a' }}>
            Farmers Registration
          </Typography> */}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddModalOpen(true)}
              sx={{
                bgcolor: '#1e293b',
                px: 3,
                py: 1.5,
                borderRadius: 2,
                fontWeight: '600',
                '&:hover': {
                  bgcolor: '#1e298b',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              Add New Farmer
            </Button>
          </Box>
        </Box>

        {/* Summary Statistics */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card sx={{ bgcolor: '#000080', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {statistics.total}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>Total Registered Farmers</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#013220', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {statistics.active}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>Active Farmers</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#F59E0B', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {statistics.newThisMonth}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>New This Month</Typography>
            </CardContent>
          </Card>
          <Card sx={{ bgcolor: '#64748B', color: 'white', boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: 'white', mb: 1 }}>
                {statistics.inactive}
              </Typography>
              <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>Inactive Farmers</Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Search and Filters */}
        <Card sx={{ mb: 3, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(5, 1fr)' }, gap: 2, alignItems: 'center' }}>
              <Box sx={{ gridColumn: { xs: '1', md: 'span 2' } }}>
                <TextField
                  fullWidth
                  placeholder="Search by name, ID, or location..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#1e3a8a' }} />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiInputBase-input::placeholder': {
                      color: '#ffffff',
                      opacity: 1,
                    },
                  }}
                />
              </Box>
              <TextField
                select
                fullWidth
                label="Barangay"
                value={filterBarangay}
                onChange={(e) => setFilterBarangay(e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    fontWeight: 500,
                  },
                }}
              >
                <MenuItem value="">All Barangays</MenuItem>
                {barangays.map((barangay) => (
                  <MenuItem key={barangay} value={barangay}>
                    {barangay}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Crop Type"
                value={filterCropType}
                onChange={(e) => setFilterCropType(e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    fontWeight: 500,
                  },
                }}
              >
                <MenuItem value="">All Crops</MenuItem>
                {cropTypes.map((crop) => (
                  <MenuItem key={crop} value={crop}>
                    {crop}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                label="Status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  '& .MuiInputLabel-root': {
                    color: '#ffffff',
                    fontWeight: 500,
                  },
                }}
              >
                <MenuItem value="">All Status</MenuItem>
                <MenuItem value="Active">Active</MenuItem>
                <MenuItem value="Inactive">Inactive</MenuItem>
                <MenuItem value="Pending Verification">Pending Verification</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<GetAppIcon />}
                onClick={() => handleExport('excel')}
              >
                Export to Excel
              </Button>
              <Button
                variant="contained"
                startIcon={<GetAppIcon />}
                onClick={() => handleExport('pdf')}
              >
                Export to PDF
              </Button>
            </Box>

            {/* Bulk Actions */}
            {selected.length > 0 && (
              <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Typography variant="body2" sx={{ alignSelf: 'center', color: '#ffffff', fontWeight: 600 }}>
                  {selected.length} selected
                </Typography>
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={handleBulkDelete}
                  sx={{ fontWeight: 600 }}
                >
                  Delete Selected
                </Button>
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={() => handleExport('excel')}
                  sx={{ 
                    borderColor: '#1e3a8a',
                    color: '#ffffff',
                    fontWeight: 600,
                    '&:hover': {
                      borderColor: '#1e40af',
                      backgroundColor: '#123499',
                    },
                  }}
                >
                  Export Selected
                </Button>
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Data Table */}
        <Card sx={tableContainerStyle}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox" sx={tableHeaderStyle}>
                    <Checkbox
                      checked={paginatedFarmers.length > 0 && selected.length === paginatedFarmers.length}
                      indeterminate={selected.length > 0 && selected.length < paginatedFarmers.length}
                      onChange={handleSelectAll}
                      sx={{ color: 'white', '&.Mui-checked': { color: 'white' }, '&.MuiCheckbox-indeterminate': { color: 'white' } }}
                    />
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'farmer_id'}
                      direction={orderBy === 'farmer_id' ? order : 'asc'}
                      onClick={() => handleRequestSort('farmer_id')}
                      sx={{ 
                        color: 'white !important',
                        '&:hover': { color: 'white !important' },
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Farmer ID
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'full_name'}
                      direction={orderBy === 'full_name' ? order : 'asc'}
                      onClick={() => handleRequestSort('full_name')}
                      sx={{ 
                        color: 'white !important',
                        '&:hover': { color: 'white !important' },
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Full Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>Contact</TableCell>
                  <TableCell sx={tableHeaderStyle}>Address</TableCell>
                  <TableCell sx={tableHeaderStyle}>Farm Location</TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'farm_size'}
                      direction={orderBy === 'farm_size' ? order : 'asc'}
                      onClick={() => handleRequestSort('farm_size')}
                      sx={{ 
                        color: 'white !important',
                        '&:hover': { color: 'white !important' },
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Farm Size
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>Crop</TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'created_at'}
                      direction={orderBy === 'created_at' ? order : 'asc'}
                      onClick={() => handleRequestSort('created_at')}
                      sx={{ 
                        color: 'white !important',
                        '&:hover': { color: 'white !important' },
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Registration Date
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>Status</TableCell>
                  <TableCell sx={{...tableHeaderStyle, textAlign: 'center'}}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedFarmers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center" sx={{ py: 5 }}>
                      <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1rem', fontWeight: 500 }}>
                        No farmers found. Add your first farmer to get started!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedFarmers.map((farmer) => (
                    <TableRow
                      key={farmer.id}
                      hover
                      selected={selected.includes(farmer.id)}
                      sx={tableRowHoverStyle}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={selected.includes(farmer.id)}
                          onChange={() => handleSelectOne(farmer.id)}
                        />
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{farmer.farmer_id}</TableCell>
                      <TableCell sx={{...tableCellStyle, fontWeight: 700, color: 'white'}}>{farmer.full_name}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{farmer.contact_number}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>
                        {farmer.address_barangay}, {farmer.address_municipality}
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{farmer.farm_location}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{farmer.farm_size || 'N/A'} ha</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{farmer.farm_name}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{new Date(farmer.created_at).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Chip
                          label={farmer.status}
                          color={
                            farmer.status === 'Active' 
                              ? 'success' 
                              : farmer.status === 'Pending Verification'
                              ? 'warning'
                              : 'error'
                          }
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <IconButton
                          size="small"
                          onClick={(e) => handleMenuOpen(e, farmer)}
                          sx={{ color: '#1e3a8a' }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredFarmers.length}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={defaultRowsPerPageOptions}
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

        {/* Action Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={() => currentFarmer && handleView(currentFarmer)} sx={{ color: '#ffffff', fontWeight: 500 }}>
            <VisibilityIcon sx={{ mr: 1, color: '#ffffff' }} fontSize="small" />
            View
          </MenuItem>
          <MenuItem onClick={() => currentFarmer && handleEdit(currentFarmer)} sx={{ color: '#ffffff', fontWeight: 500 }}>
            <EditIcon sx={{ mr: 1, color: '#ffffff' }} fontSize="small" />
            Edit
          </MenuItem>
          <MenuItem onClick={() => currentFarmer && handleStatusChange(currentFarmer)} sx={{ color: '#ffffff', fontWeight: 500 }}>
            <HistoryIcon sx={{ mr: 1, color: '#ffffff' }} fontSize="small" />
            Change Status
          </MenuItem>
          <MenuItem onClick={() => currentFarmer && handleDelete(currentFarmer)} sx={{ color: 'error.main', fontWeight: 500 }}>
            <DeleteIcon sx={{ mr: 1 }} fontSize="small" />
            Delete
          </MenuItem>
        </Menu>

        {/* Status Change Dialog */}
        <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)}>
          <DialogTitle sx={{ color: '#ffffff', fontWeight: 700 }}>Change Farmer Status</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#ffffff', fontWeight: 500, mb: 2 }}>
              Change status for <strong style={{ color: '#ffffff' }}>{currentFarmer?.full_name}</strong>
            </Typography>
            <TextField
              select
              fullWidth
              label="Status"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as 'Active' | 'Inactive' | 'Pending Verification')}
              sx={{ mt: 1 }}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Pending Verification">Pending Verification</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setStatusDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button onClick={confirmStatusChange} variant="contained" sx={{ fontWeight: 600, background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }}>
              Update Status
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
          <DialogTitle sx={{ color: '#0f172a', fontWeight: 700 }}>Confirm Delete</DialogTitle>
          <DialogContent>
            <Typography sx={{ color: '#334155', fontWeight: 500 }}>
              Are you sure you want to delete farmer <strong style={{ color: '#0f172a' }}>{currentFarmer?.full_name}</strong>?
              This action cannot be undone.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button onClick={confirmDelete} color="error" variant="contained" sx={{ fontWeight: 600 }}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>

        {/* View Farmer Dialog */}
        <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ fontWeight: 700, bgcolor: '#000080', color: 'white' }}>
            Farmer Details
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            {currentFarmer && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Personal Information */}
                <Box>
                  <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2, borderBottom: '2px solid #1e3a8a', pb: 1 }}>
                    Personal Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Farmer ID</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.farmer_id}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Full Name</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.full_name}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Date of Birth</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.date_of_birth || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Gender</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.gender || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Civil Status</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.civil_status || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Nationality</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.nationality || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Contact Number</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.contact_number}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Email</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.email || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Address Information */}
                <Box>
                  <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2, borderBottom: '2px solid #1e3a8a', pb: 1 }}>
                    Address Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Purok</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.address_purok || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Barangay</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.address_barangay}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Municipality</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.address_municipality}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Province</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.address_province || 'N/A'}</Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Farm Information */}
                <Box>
                  <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2, borderBottom: '2px solid #1e3a8a', pb: 1 }}>
                    Farm Information
                  </Typography>
                  <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Farm Name / Crop Type</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.farm_name}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Farm Location</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.farm_location}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Farm Size</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.farm_size || 0} hectares</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Land Ownership</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.land_ownership_type || 'N/A'}</Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Farming Experience</Typography>
                      <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>
                        {currentFarmer.farming_experience_years || 0} years {currentFarmer.farming_experience_months || 0} months
                      </Typography>
                    </Box>
                    <Box>
                      <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Status</Typography>
                      <Chip
                        label={currentFarmer.status}
                        color={
                          currentFarmer.status === 'Active' 
                            ? 'success' 
                            : currentFarmer.status === 'Pending Verification'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Box>

                {/* Emergency Contact */}
                {(currentFarmer.emergency_contact_person || currentFarmer.emergency_contact_number) && (
                  <Box>
                    <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2, borderBottom: '2px solid #1e3a8a', pb: 1 }}>
                      Emergency Contact
                    </Typography>
                    <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                      <Box>
                        <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Contact Person</Typography>
                        <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.emergency_contact_person || 'N/A'}</Typography>
                      </Box>
                      <Box>
                        <Typography sx={{ color: '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>Contact Number</Typography>
                        <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>{currentFarmer.emergency_contact_number || 'N/A'}</Typography>
                      </Box>
                    </Box>
                  </Box>
                )}
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewDialogOpen(false)} variant="contained" sx={{ fontWeight: 600, bgcolor: '#000080', '&:hover': { bgcolor: '#00006b' } }}>
              Close
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Farmer Dialog */}
        <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="md" fullWidth>
          <DialogTitle sx={{ color: 'white', fontWeight: 700, background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }}>
            Edit Farmer Information
          </DialogTitle>
          <DialogContent sx={{ mt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Personal Information */}
              <Box>
                <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2 }}>Personal Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Full Name"
                    value={editFormData.full_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, full_name: e.target.value })}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                  <TextField
                    label="Date of Birth"
                    type="date"
                    value={editFormData.date_of_birth || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, date_of_birth: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                  <TextField
                    label="Gender"
                    select
                    value={editFormData.gender || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, gender: e.target.value })}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  >
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                  <TextField
                    label="Civil Status"
                    select
                    value={editFormData.civil_status || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, civil_status: e.target.value })}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  >
                    <MenuItem value="Single">Single</MenuItem>
                    <MenuItem value="Married">Married</MenuItem>
                    <MenuItem value="Widowed">Widowed</MenuItem>
                    <MenuItem value="Separated">Separated</MenuItem>
                  </TextField>
                  <TextField
                    label="Contact Number"
                    value={editFormData.contact_number || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, contact_number: e.target.value })}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={editFormData.email || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                </Box>
              </Box>

              {/* Address Information */}
              <Box>
                <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2 }}>Address</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Barangay"
                    value={editFormData.address_barangay || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address_barangay: e.target.value })}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                  <TextField
                    label="Municipality"
                    value={editFormData.address_municipality || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, address_municipality: e.target.value })}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                </Box>
              </Box>

              {/* Farm Information */}
              <Box>
                <Typography variant="h6" sx={{ color: '#1e3a8a', fontWeight: 700, mb: 2 }}>Farm Information</Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
                  <TextField
                    label="Crop Type"
                    select
                    value={editFormData.farm_name || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, farm_name: e.target.value })}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  >
                    {cropTypes.map((crop) => (
                      <MenuItem key={crop} value={crop}>{crop}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Farm Location"
                    value={editFormData.farm_location || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, farm_location: e.target.value })}
                    required
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                  <TextField
                    label="Farm Size (hectares)"
                    type="number"
                    value={editFormData.farm_size || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, farm_size: parseFloat(e.target.value) })}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  />
                  <TextField
                    label="Land Ownership"
                    select
                    value={editFormData.land_ownership_type || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, land_ownership_type: e.target.value })}
                    fullWidth
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: '#1e3a8a', borderWidth: '2px' },
                        '&:hover fieldset': { borderColor: '#1e40af' },
                        '&.Mui-focused fieldset': { borderColor: '#1e40af' },
                      },
                      '& .MuiInputLabel-root': { color: '#0f172a', fontWeight: 600 },
                      '& .MuiInputBase-input': { color: '#0f172a', fontWeight: 500 },
                    }}
                  >
                    <MenuItem value="owner">Owner</MenuItem>
                    <MenuItem value="tenant">Tenant</MenuItem>
                  </TextField>
                </Box>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setEditDialogOpen(false)} sx={{ color: '#64748b', fontWeight: 600 }}>
              Cancel
            </Button>
            <Button onClick={handleEditSave} variant="contained" sx={{ fontWeight: 600, background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)' }}>
              Save Changes
            </Button>
          </DialogActions>
        </Dialog>

        {/* Add Farmer Modal */}
        <AddFarmerModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
        />
      </Box>
    </FullLayout>
  );
}
