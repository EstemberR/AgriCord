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
  TablePagination,
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
  InputAdornment,
  Tooltip,
  Alert,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Inventory2 as InventoryIcon,
  AddCircle as AddCircleIcon,
  Remove as RemoveIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Savings as SavingsIcon,
  Inventory as InventoryIcon2,
  Warning as WarningIcon2,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import StatisticsCard from '@/components/cards/StatisticsCard';

interface InventoryItem {
  id: number;
  item_type: string;
  item_name: string;
  current_stock: number;
  unit: string;
  minimum_threshold: number;
  maximum_capacity: number | null;
  last_restock_date: string;
  unit_cost: string;
  total_value: string;
  status: string;
  supplier: string | null;
  notes: string | null;
}

interface LowStockAlert {
  id: number;
  item_name: string;
  current_stock: number;
  minimum_threshold: number;
  unit: string;
  status: string;
  recommended_restock: number;
}

interface Props {
  statistics: {
    totalItems: number;
    lowStockItems: number;
    outOfStockItems: number;
    totalValue: string;
  };
  inventory: InventoryItem[];
  lowStockAlerts: LowStockAlert[];
}

type ModalType = 'add' | 'restock' | 'adjust' | null;

function InventoryManagement() {
  const { statistics, inventory, lowStockAlerts } = usePage<Props>().props;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(25);
  
  // Add Item Form
  const [addForm, setAddForm] = useState({
    item_type: 'fertilizer',
    item_name: '',
    initial_stock: '',
    unit: 'kg',
    minimum_threshold: '',
    maximum_capacity: '',
    unit_cost: '',
    supplier: '',
    notes: '',
  });

  // Restock Form
  const [restockForm, setRestockForm] = useState({
    inventory_id: 0,
    quantity: '',
    unit_cost: '',
    supplier: '',
    reference_number: '',
    notes: '',
  });

  // Adjust Form
  const [adjustForm, setAdjustForm] = useState({
    inventory_id: 0,
    adjustment_type: 'add',
    quantity: '',
    reason: 'correction',
    notes: '',
  });

  // Pagination handlers
  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter inventory
  const filteredInventory = useMemo(() => {
    return inventory.filter((item) => {
      const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || item.item_type === filterType;
      const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
      return matchesSearch && matchesType && matchesStatus;
    });
  }, [inventory, searchTerm, filterType, filterStatus]);

  const handleOpenModal = (type: ModalType, item?: InventoryItem) => {
    setModalType(type);
    if (type === 'restock' && item) {
      setSelectedItem(item);
      setRestockForm({
        ...restockForm,
        inventory_id: item.id,
        unit_cost: item.unit_cost,
      });
    } else if (type === 'adjust' && item) {
      setSelectedItem(item);
      setAdjustForm({
        ...adjustForm,
        inventory_id: item.id,
      });
    }
  };

  const handleCloseModal = () => {
    setModalType(null);
    setSelectedItem(null);
    setAddForm({
      item_type: 'fertilizer',
      item_name: '',
      initial_stock: '',
      unit: 'kg',
      minimum_threshold: '',
      maximum_capacity: '',
      unit_cost: '',
      supplier: '',
      notes: '',
    });
    setRestockForm({
      inventory_id: 0,
      quantity: '',
      unit_cost: '',
      supplier: '',
      reference_number: '',
      notes: '',
    });
    setAdjustForm({
      inventory_id: 0,
      adjustment_type: 'add',
      quantity: '',
      reason: 'correction',
      notes: '',
    });
  };

  const handleAddItem = () => {
    if (!addForm.item_name || !addForm.initial_stock || !addForm.minimum_threshold || !addForm.unit_cost) {
      alert('Please fill in all required fields');
      return;
    }

    router.post('/inventory', addForm, {
      onSuccess: () => handleCloseModal(),
      onError: (errors) => {
        console.error(errors);
        alert('Failed to add item');
      },
    });
  };

  const handleRestock = () => {
    if (!restockForm.quantity || !restockForm.unit_cost) {
      alert('Please fill in all required fields');
      return;
    }

    router.post('/inventory/restock', restockForm, {
      onSuccess: () => handleCloseModal(),
      onError: (errors) => {
        console.error(errors);
        alert('Failed to restock');
      },
    });
  };

  const handleAdjust = () => {
    if (!adjustForm.quantity || !adjustForm.notes) {
      alert('Please fill in all required fields');
      return;
    }

    router.post('/inventory/adjust', adjustForm, {
      onSuccess: () => handleCloseModal(),
      onError: (errors) => {
        console.error(errors);
        alert('Failed to adjust inventory');
      },
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal': return 'success';
      case 'low_stock': return 'warning';
      case 'out_of_stock': return 'error';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal': return '🟢';
      case 'low_stock': return '🟡';
      case 'out_of_stock': return '🔴';
      default: return '';
    }
  };

  return (
    <FullLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Box>
            {/* <Typography variant="h4" sx={{ fontWeight: 600, color: '#1e293b'}}>
            Inventory Management
          </Typography> */}
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal('add')}
            sx={{
              background: '#1e293b',
              '&:hover': {
                background: '1e298b',
              },
            }}
          >
            Add New Item
          </Button>
        </Box>

        {/* Summary Cards */}
        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <InventoryIcon2 sx={{ fontSize: 28, color: '#000080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Items
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.totalItems}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                In Stock
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <WarningIcon2 sx={{ fontSize: 28, color: '#006400' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Low Stock
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.lowStockItems}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Items Below Threshold
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <CancelIcon sx={{ fontSize: 28, color: '#FFA500' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Out of Stock
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                {statistics.outOfStockItems}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Items Need Restock
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ bgcolor: '#1e293b', color: 'white', maxHeight: 130, borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)' }}>
            <CardContent sx={{ p: 2.5, position: 'relative' }}>
              <Box sx={{ position: 'absolute', top: 12, right: 12, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: 2, p: 1 }}>
                <SavingsIcon sx={{ fontSize: 28, color: '#808080' }} />
              </Box>
              <Typography variant="subtitle2" sx={{ opacity: 0.9, mb: 0.5, fontWeight: 600 }}>
                Total Value
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.25 }}>
                ₱{statistics.totalValue}
              </Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                Inventory Worth
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Low Stock Alerts */}
        {lowStockAlerts.length > 0 && (
          <Alert 
            severity="warning" 
            sx={{ 
              mb: 2,
              bgcolor: (theme) => theme.palette.warning.main,
              color: 'white',
              '& .MuiAlert-icon': { 
                color: 'white',
                opacity: 0.9
              }
            }}
          >
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 1 }}>
              Low Stock Alerts ({lowStockAlerts.length})
            </Typography>
            {lowStockAlerts.slice(0, 3).map((alert) => (
              <Box key={alert.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 0.5, gap: 2 }}>
                <Typography variant="body2" sx={{ flex: 1, fontWeight: 500 }}>
                  {getStatusIcon(alert.status)} <strong>{alert.item_name}</strong>: {alert.current_stock} {alert.unit} 
                  (Min: {alert.minimum_threshold} {alert.unit})
                </Typography>
                <Button 
                  size="small" 
                  variant="contained"
                  onClick={() => {
                    const item = inventory.find(i => i.id === alert.id);
                    if (item) handleOpenModal('restock', item);
                  }}
                  sx={{ 
                    ml: 2,
                    bgcolor: 'white',
                    color: (theme) => theme.palette.warning.main,
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)',
                    }
                  }}
                >
                  Restock Now
                </Button>
              </Box>
            ))}
          </Alert>
        )}

        {/* Filters */}
        <Card sx={{ 
          mb: 3,
          bgcolor: '#2C3E50',
          color: 'white',
          borderRadius: 2,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          width: '55%'
        }}>
          <CardContent sx={{ p: 2.5 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Search items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'white' }} />
                      </InputAdornment>
                    ),
                    sx: {
                      color: 'white',
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                      },
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                      },
                    }
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      color: 'white',
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.7)',
                        opacity: 1,
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small" sx={{ minWidth: 150 }}>
                  <InputLabel sx={{ color: 'white' }}>Item Type</InputLabel>
                  <Select
                    value={filterType}
                    label="Item Type"
                    onChange={(e) => setFilterType(e.target.value)}
                    sx={{
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                      },
                      '.MuiSvgIcon-root': {
                        color: 'white',
                      }
                    }}
                  >
                    <MenuItem value="all">All Types</MenuItem>
                    <MenuItem value="fertilizer">Fertilizer</MenuItem>
                    <MenuItem value="seed">Seed</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth size="small">
                  <InputLabel sx={{ color: 'white' }}>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                    sx={{
                      color: 'white',
                      '.MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.3)',
                      },
                      '&:hover .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.5)',
                      },
                      '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'rgba(255, 255, 255, 0.7)',
                      },
                      '.MuiSvgIcon-root': {
                        color: 'white',
                      }
                    }}
                  >
                    <MenuItem value="all">All Status</MenuItem>
                    <MenuItem value="normal">Normal</MenuItem>
                    <MenuItem value="low_stock">Low Stock</MenuItem>
                    <MenuItem value="out_of_stock">Out of Stock</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card sx={tableContainerStyle}>
          <TableContainer>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Type</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Item Name</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Current Stock</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Status</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Min Threshold</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Last Restock</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Unit Cost</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white'}}>Total Value</TableCell>
                  <TableCell sx={{...tableHeaderStyle, color: 'white', textAlign: 'center' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredInventory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
                      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                        <InventoryIcon sx={{ fontSize: 48, color: 'white', opacity: 0.7, mb: 1 }} />
                        <Typography variant="h6" sx={{ color: 'white', opacity: 0.9 }}>
                          No inventory items found
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'white', opacity: 0.7 }}>
                          Try adjusting your filters or add a new item
                        </Typography>
                      </Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInventory.map((item) => (
                    <TableRow 
                      key={item.id} 
                      hover
                      sx={{
                        ...tableRowHoverStyle,
                        backgroundColor: item.status === 'out_of_stock' ? 'rgba(244, 67, 54, 0.08)' : 
                                        item.status === 'low_stock' ? 'rgba(255, 152, 0, 0.08)' : 'inherit'
                      }}
                    >
                      <TableCell sx={{...tableCellStyle, color: '#667eea', fontWeight: 500}}>
                        {item.item_type === 'fertilizer' ? '🧪' : '🌱'} {item.item_type.charAt(0).toUpperCase() + item.item_type.slice(1)}
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, fontWeight: 600, color: 'white' }}>{item.item_name}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white', fontWeight: item.current_stock <= item.minimum_threshold ? 600 : 400}}>
                        {item.current_stock} {item.unit}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={item.status.replace('_', ' ').toUpperCase()}
                          color={getStatusColor(item.status)}
                          size="small"
                          icon={<span>{getStatusIcon(item.status)}</span>}
                          sx={{ height: 22, fontSize: '0.75rem', fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{item.minimum_threshold} {item.unit}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white'}}>{item.last_restock_date}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white', fontWeight: 500}}>₱{item.unit_cost}</TableCell>
                      <TableCell sx={{...tableCellStyle, color: 'white', fontWeight: 600}}>₱{item.total_value}</TableCell>
                      <TableCell sx={{...tableCellStyle, textAlign: 'center'}}>
                        <Tooltip title="Restock">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenModal('restock', item)}
                            sx={{ color: '#000080' }}
                          >
                            <AddCircleIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Adjust Stock">
                          <IconButton 
                            size="small"
                            onClick={() => handleOpenModal('adjust', item)}
                            sx={{ color: '#F59E0B' }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="View History">
                          <IconButton 
                            size="small"
                            sx={{ color: '#000080' }}
                          >
                            <HistoryIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
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
            count={filteredInventory.length}
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

        {/* Add Item Modal */}
        <Modal open={modalType === 'add'} onClose={handleCloseModal}>
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
              Add New Inventory Item
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Item Type *</FormLabel>
                  <RadioGroup
                    row
                    value={addForm.item_type}
                    onChange={(e) => setAddForm({ ...addForm, item_type: e.target.value })}
                  >
                    <FormControlLabel value="fertilizer" control={<Radio />} label="Fertilizer" />
                    <FormControlLabel value="seed" control={<Radio />} label="Seed" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Item Name *"
                  value={addForm.item_name}
                  onChange={(e) => setAddForm({ ...addForm, item_name: e.target.value })}
                  sx={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          minWidth: '330px !important'
                      }}
                   />
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Initial Stock *"
                  type="number"
                  value={addForm.initial_stock}
                  onChange={(e) => setAddForm({ ...addForm, initial_stock: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} sm={4}>
                <FormControl fullWidth>
                  <InputLabel>Unit *</InputLabel>
                  <Select
                    value={addForm.unit}
                    label="Unit *"
                    onChange={(e) => setAddForm({ ...addForm, unit: e.target.value })}
                     sx={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          minWidth: '100px !important'
                      }}
                  >
                    <MenuItem value="kg">kg</MenuItem>
                    <MenuItem value="bags">bags</MenuItem>
                    <MenuItem value="packets">packets</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Unit Cost (₱) *"
                  type="number"
                  value={addForm.unit_cost}
                  onChange={(e) => setAddForm({ ...addForm, unit_cost: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          minWidth: '208px !important'
                      }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Minimum Threshold *"
                  type="number"
                  value={addForm.minimum_threshold}
                  onChange={(e) => setAddForm({ ...addForm, minimum_threshold: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Maximum Capacity"
                  type="number"
                  value={addForm.maximum_capacity}
                  onChange={(e) => setAddForm({ ...addForm, maximum_capacity: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                  sx={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          minWidth: '325px !important'
                      }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Supplier (Optional)"
                  value={addForm.supplier}
                  onChange={(e) => setAddForm({ ...addForm, supplier: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={3}
                  value={addForm.notes}
                  onChange={(e) => setAddForm({ ...addForm, notes: e.target.value })}
                  sx={{
                          fontSize: '0.875rem',
                          color: 'text.secondary',
                          minWidth: '325px !important'
                      }}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleAddItem} variant="contained" color="primary">
                Add Item
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Restock Modal */}
        <Modal open={modalType === 'restock'} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 500 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Restock Inventory
            </Typography>

            {selectedItem && (
              <Alert severity="info" sx={{ mb: 2 }}>
                <strong>{selectedItem.item_name}</strong><br />
                Current Stock: {selectedItem.current_stock} {selectedItem.unit}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity to Add *"
                  type="number"
                  value={restockForm.quantity}
                  onChange={(e) => setRestockForm({ ...restockForm, quantity: e.target.value })}
                  inputProps={{ min: 0.01, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Unit Cost (₱) *"
                  type="number"
                  value={restockForm.unit_cost}
                  onChange={(e) => setRestockForm({ ...restockForm, unit_cost: e.target.value })}
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Supplier (Optional)"
                  value={restockForm.supplier}
                  onChange={(e) => setRestockForm({ ...restockForm, supplier: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Invoice/Receipt Number (Optional)"
                  value={restockForm.reference_number}
                  onChange={(e) => setRestockForm({ ...restockForm, reference_number: e.target.value })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Optional)"
                  multiline
                  rows={2}
                  value={restockForm.notes}
                  onChange={(e) => setRestockForm({ ...restockForm, notes: e.target.value })}
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleRestock} variant="contained" color="primary">
                Restock
              </Button>
            </Box>
          </Box>
        </Modal>

        {/* Adjust Stock Modal */}
        <Modal open={modalType === 'adjust'} onClose={handleCloseModal}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: { xs: '90%', sm: 500 },
              bgcolor: 'background.paper',
              borderRadius: 2,
              boxShadow: 24,
              p: 4,
            }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Adjust Stock
            </Typography>

            {selectedItem && (
              <Alert severity="warning" sx={{ mb: 2 }}>
                <strong>{selectedItem.item_name}</strong><br />
                Current Stock: {selectedItem.current_stock} {selectedItem.unit}
              </Alert>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <FormLabel component="legend">Adjustment Type *</FormLabel>
                  <RadioGroup
                    row
                    value={adjustForm.adjustment_type}
                    onChange={(e) => setAdjustForm({ ...adjustForm, adjustment_type: e.target.value })}
                  >
                    <FormControlLabel value="add" control={<Radio />} label="Add" />
                    <FormControlLabel value="subtract" control={<Radio />} label="Subtract" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Quantity *"
                  type="number"
                  value={adjustForm.quantity}
                  onChange={(e) => setAdjustForm({ ...adjustForm, quantity: e.target.value })}
                  inputProps={{ min: 0.01, step: 0.01 }}
                />
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel>Reason *</InputLabel>
                  <Select
                    value={adjustForm.reason}
                    label="Reason *"
                    onChange={(e) => setAdjustForm({ ...adjustForm, reason: e.target.value })}
                  >
                    <MenuItem value="correction">Correction</MenuItem>
                    <MenuItem value="wastage">Wastage</MenuItem>
                    <MenuItem value="damage">Damage</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Notes (Required for Audit) *"
                  multiline
                  rows={3}
                  value={adjustForm.notes}
                  onChange={(e) => setAdjustForm({ ...adjustForm, notes: e.target.value })}
                  placeholder="Explain the reason for this adjustment..."
                />
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
              <Button onClick={handleCloseModal} variant="outlined">
                Cancel
              </Button>
              <Button onClick={handleAdjust} variant="contained" color="primary">
                Adjust Stock
              </Button>
            </Box>
          </Box>
        </Modal>
      </Box>
    </FullLayout>
  );
}

export default InventoryManagement;
