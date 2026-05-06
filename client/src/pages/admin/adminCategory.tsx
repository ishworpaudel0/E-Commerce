import  { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { fetchCategories, createCategory } from '../../store/slices/categorySlice';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, CircularProgress 
} from '@mui/material';
import { Add, Category as CategoryIcon } from '@mui/icons-material';

const Categories = () => {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((state) => state.category);
  
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSave = async () => {
    if (formData.name && formData.description) {
      await dispatch(createCategory(formData));
      setOpen(false);
      setFormData({ name: '', description: '' });
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Categories</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>
          Add Category
        </Button>
      </Box>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#1976D2' }}>
                <TableCell>Name</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Slug</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat._id}>
                  <TableCell sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CategoryIcon color="action" fontSize="small" /> {cat.name}
                  </TableCell>
                  <TableCell>{cat.description}</TableCell>
                  <TableCell>{cat.slug}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Add Category Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="xs">
        <DialogTitle>Create New Category</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField
            label="Name"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSave} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Categories;