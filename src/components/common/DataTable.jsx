import React, { useState } from 'react';
import { Table, TableHead, TableRow, TableCell, TableBody, TablePagination, Paper, IconButton, TextField, Box, Button, InputAdornment } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import SearchIcon from '@mui/icons-material/Search';

const DataTable = ({ columns, data, onEdit, onDelete, onView, onActivate, pagination, onPageChange, onRowsPerPageChange, search, onSearchChange, searchPlaceholder = 'Buscar...' }) => {
  const [draftSearch, setDraftSearch] = useState(search || '');

  const handleSearch = () => {
    if (onSearchChange) {
      onSearchChange(draftSearch);
      if (onPageChange) onPageChange(1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  return (
    <Paper sx={{ width: '100%', overflowX: 'auto' }}>
      {onSearchChange && (
        <Box sx={{ p: 2, pb: 0, display: 'flex', gap: 1, alignItems: 'center' }}>
          <TextField
            size="small"
            placeholder={searchPlaceholder}
            value={draftSearch}
            onChange={(e) => setDraftSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            sx={{ maxWidth: 320 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
            }}
          />
          <Button variant="contained" size="small" onClick={handleSearch}>Buscar</Button>
        </Box>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell key={col.field}>{col.headerName}</TableCell>
            ))}
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {columns.map((col) => (
                <TableCell key={col.field}>{col.render ? col.render(row) : row[col.field]}</TableCell>
              ))}
              <TableCell>
                {onView && (
                  <IconButton onClick={() => onView(row)}><VisibilityIcon /></IconButton>
                )}
                {row.estado === 'Activo' && (
                  <>
                    <IconButton onClick={() => onEdit(row)}><EditIcon /></IconButton>
                    <IconButton onClick={() => onDelete(row.id)}><DeleteIcon /></IconButton>
                  </>
                )}
                {row.estado !== 'Activo' && onActivate && (
                  <IconButton onClick={() => onActivate(row)} color="success"><RestoreFromTrashIcon /></IconButton>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          component="div"
          count={pagination.total || 0}
          page={(pagination.page || 1) - 1}
          rowsPerPage={pagination.limit || 10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          onPageChange={(_, newPage) => onPageChange(newPage + 1)}
          onRowsPerPageChange={(e) => onRowsPerPageChange(parseInt(e.target.value, 10))}
        />
      )}
    </Paper>
  );
};

export default DataTable;
