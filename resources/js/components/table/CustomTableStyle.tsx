// Table styles for consistent look across the application
export const tableHeaderStyle = {
  fontWeight: 700, 
  backgroundColor: '#2C3E50', 
  color: 'white', 
  fontSize: '0.85rem', 
  py: 2, 
  borderBottom: '2px solid #667eea'
};

export const tableContainerStyle = {
  boxShadow: 2,
  borderRadius: 2,
  overflow: 'hidden',
  border: '1px solid #e2e8f0'
};

export const tableRowHoverStyle = {
  backgroundColor: '#2C3E50',
  '&:hover': {
    backgroundColor: '#34495E !important',
  }
};

export const tableCellStyle = {
  fontSize: '0.875rem',
  color: 'white',
  fontWeight: 500,
};

export const tablePaginationStyle = {
  borderTop: '1px solid #e2e8f0',
  '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
    color: '#334155',
    fontWeight: 500,
  },
  '& .MuiTablePagination-select': {
    color: '#334155',
  }
};

// Common table options
export const defaultRowsPerPageOptions = [10, 25, 50, 100];