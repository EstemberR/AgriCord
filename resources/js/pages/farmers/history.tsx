import { useState } from 'react';
import { Head } from '@inertiajs/react';
import FullLayout from '@/layouts/full/FullLayout';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  MenuItem,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TableSortLabel,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Close as CloseIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import {
  tableHeaderStyle,
  tableContainerStyle,
  tableRowHoverStyle,
  tableCellStyle,
  tablePaginationStyle,
  defaultRowsPerPageOptions
} from '@/components/table/CustomTableStyle';

interface HistoryRecord {
  id: number;
  date_time: string;
  action_type: 'New Registration' | 'Updated' | 'Deleted' | 'Status Changed';
  farmer_name: string;
  farmer_id: string;
  changed_by: string;
  details: string;
  previous_value: string | null;
}

interface HistoryPageProps {
  history: HistoryRecord[];
  admins: string[];
}

type Order = 'asc' | 'desc';

export default function FarmerHistory({ history, admins }: HistoryPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [selectedAdmin, setSelectedAdmin] = useState('All');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [orderBy, setOrderBy] = useState<keyof HistoryRecord>('date_time');
  const [order, setOrder] = useState<Order>('desc');
  const [detailsDialog, setDetailsDialog] = useState<{
    open: boolean;
    record: HistoryRecord | null;
  }>({
    open: false,
    record: null,
  });

  // Filter data
  const filteredHistory = history.filter((record) => {
    const matchesSearch =
      record.farmer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.farmer_id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesAdmin =
      selectedAdmin === 'All' || record.changed_by === selectedAdmin;
    return matchesSearch && matchesAdmin;
  });

  // Sort data
  const sortedHistory = [...filteredHistory].sort((a, b) => {
    const aValue = a[orderBy];
    const bValue = b[orderBy];
    if (aValue === null || bValue === null) return 0;
    if (aValue < bValue) return order === 'asc' ? -1 : 1;
    if (aValue > bValue) return order === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedHistory = sortedHistory.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const handleSort = (property: keyof HistoryRecord) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'New Registration':
        return '✅';
      case 'Updated':
        return '✏️';
      case 'Status Changed':
        return '🔄';
      case 'Deleted':
        return '🗑️';
      default:
        return '📝';
    }
  };

  const getActionColor = (
    actionType: string
  ): 'success' | 'info' | 'warning' | 'error' | 'default' => {
    switch (actionType) {
      case 'New Registration':
        return 'success';
      case 'Updated':
        return 'info';
      case 'Status Changed':
        return 'warning';
      case 'Deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDateTime = (dateTime: string) => {
    const date = new Date(dateTime);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  return (
    <FullLayout>
      <Head title="Registration History - AgriCord" />

      <Box sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h4"
            sx={{
              color: '#0f172a',
              fontWeight: 700,
              mb: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            Registration History
          </Typography>
          <Typography variant="body2" sx={{ color: '#64748b' }}>
            Track all farmer registration activities and changes
          </Typography>
        </Box>

        {/* Filters and Search Card */}
        <Card
          sx={{
            mb: 3,
            boxShadow: 3,
            border: '2px solid #e2e8f0',
            borderRadius: 2,
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
          }}
        >
          <CardContent sx={{ p: 2.5 }}>
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                },
                gap: 2,
              }}
            >
              {/* Date Range Filter */}
              <TextField
                select
                label="Date Range"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                size="small"
                sx={{
                  '& .MuiInputLabel-root': { color: '#ffffff', fontWeight: 600 },
                  '& .MuiInputBase-input': { color: '#ffffff', fontWeight: 500 },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#0B0B45' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                  },
                  '& .MuiSvgIcon-root': { color: '#ffffff' },
                }}
              >
                <MenuItem value="Last 7 Days">Last 7 Days</MenuItem>
                <MenuItem value="Last 30 Days">Last 30 Days</MenuItem>
                <MenuItem value="Last 3 Months">Last 3 Months</MenuItem>
                <MenuItem value="Last 6 Months">Last 6 Months</MenuItem>
                <MenuItem value="All Time">All Time</MenuItem>
              </TextField>

              {/* Admin Filter */}
              <TextField
                select
                label="Admin"
                value={selectedAdmin}
                onChange={(e) => setSelectedAdmin(e.target.value)}
                size="small"
                sx={{
                  '& .MuiInputLabel-root': { color: '#ffffff', fontWeight: 600 },
                  '& .MuiInputBase-input': { color: '#ffffff', fontWeight: 500 },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#0B0B45' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                  },
                  '& .MuiSvgIcon-root': { color: '#ffffff' },
                }}
              >
                <MenuItem value="All">All Admins</MenuItem>
                {admins.map((admin) => (
                  <MenuItem key={admin} value={admin}>
                    {admin}
                  </MenuItem>
                ))}
              </TextField>

              {/* Search Farmer */}
              <TextField
                label="Search Farmer"
                placeholder="Name or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                size="small"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: '#ffffff' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiInputLabel-root': { color: '#ffffff', fontWeight: 600 },
                  '& .MuiInputBase-input': { color: '#ffffff', fontWeight: 500 },
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#0B0B45' },
                    '&:hover fieldset': { borderColor: '#ffffff' },
                    '&.Mui-focused fieldset': { borderColor: '#ffffff' },
                  },
                }}
              />
            </Box>
          </CardContent>
        </Card>

        {/* History Table Card */}
        <Card sx={tableContainerStyle}>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'date_time'}
                      direction={orderBy === 'date_time' ? order : 'asc'}
                      onClick={() => handleSort('date_time')}
                      sx={{
                        color: 'white !important',
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Date/Time
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'action_type'}
                      direction={orderBy === 'action_type' ? order : 'asc'}
                      onClick={() => handleSort('action_type')}
                      sx={{
                        color: 'white !important',
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Action Type
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'farmer_name'}
                      direction={orderBy === 'farmer_name' ? order : 'asc'}
                      onClick={() => handleSort('farmer_name')}
                      sx={{
                        color: 'white !important',
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Farmer Name
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    Farmer ID
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    <TableSortLabel
                      active={orderBy === 'changed_by'}
                      direction={orderBy === 'changed_by' ? order : 'asc'}
                      onClick={() => handleSort('changed_by')}
                      sx={{
                        color: 'white !important',
                        '& .MuiTableSortLabel-icon': { color: 'white !important' },
                      }}
                    >
                      Changed By
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={tableHeaderStyle}>
                    Details
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {paginatedHistory.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                        No history records found
                      </Typography>
                      <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                        Try adjusting your filters
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedHistory.map((record) => (
                      <TableRow
                      key={record.id}
                      sx={tableRowHoverStyle}
                    >
                      <TableCell sx={tableCellStyle}>
                        {formatDateTime(record.date_time)}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              <span>{getActionIcon(record.action_type)}</span>
                              <span>{record.action_type}</span>
                            </Box>
                          }
                          color={getActionColor(record.action_type)}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {record.farmer_name}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {record.farmer_id}
                      </TableCell>
                      <TableCell sx={tableCellStyle}>
                        {record.changed_by}
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography
                            variant="body2"
                            sx={{
                              color: 'white',
                              fontWeight: 500,
                              maxWidth: '250px',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {record.details}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => setDetailsDialog({ open: true, record })}
                            sx={{ color: '#1e40af' }}
                          >
                            <InfoIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={filteredHistory.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
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
      </Box>

      {/* Details Dialog */}
      <Dialog
        open={detailsDialog.open}
        onClose={() => setDetailsDialog({ open: false, record: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
            color: 'white',
            fontWeight: 700,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>📋</span>
            <span>Change Details</span>
          </Box>
          <IconButton
            onClick={() => setDetailsDialog({ open: false, record: null })}
            sx={{ color: 'white' }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ mt: 2 }}>
          {detailsDialog.record && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {/* Date/Time */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Date/Time
                </Typography>
                <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>
                  {formatDateTime(detailsDialog.record.date_time)}
                </Typography>
              </Box>

              {/* Action Type */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Action Type
                </Typography>
                <Chip
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <span>{getActionIcon(detailsDialog.record.action_type)}</span>
                      <span>{detailsDialog.record.action_type}</span>
                    </Box>
                  }
                  color={getActionColor(detailsDialog.record.action_type)}
                  size="small"
                  sx={{ fontWeight: 600, mt: 0.5 }}
                />
              </Box>

              {/* Farmer */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Farmer
                </Typography>
                <Typography sx={{ color: '#0f172a', fontWeight: 600 }}>
                  {detailsDialog.record.farmer_name}
                </Typography>
                <Typography variant="body2" sx={{ color: '#64748b' }}>
                  {detailsDialog.record.farmer_id}
                </Typography>
              </Box>

              {/* Changed By */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Changed By
                </Typography>
                <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>
                  {detailsDialog.record.changed_by}
                </Typography>
              </Box>

              {/* Details */}
              <Box>
                <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                  Details/Changes
                </Typography>
                <Typography sx={{ color: '#0f172a', fontWeight: 500 }}>
                  {detailsDialog.record.details}
                </Typography>
              </Box>

              {/* Previous Value */}
              {detailsDialog.record.previous_value && (
                <Box>
                  <Typography variant="subtitle2" sx={{ color: '#64748b', fontWeight: 600 }}>
                    Previous Value
                  </Typography>
                  <Typography
                    sx={{
                      color: '#0f172a',
                      fontWeight: 500,
                      bgcolor: '#fef2f2',
                      p: 1.5,
                      borderRadius: 1,
                      border: '1px solid #fecaca',
                    }}
                  >
                    {detailsDialog.record.previous_value}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2, pt: 0 }}>
          <Button
            variant="contained"
            onClick={() => setDetailsDialog({ open: false, record: null })}
            sx={{
              background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
              color: 'white',
              fontWeight: 700,
              '&:hover': {
                background: 'linear-gradient(135deg, #1e40af 0%, #2563eb 100%)',
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </FullLayout>
  );
}
