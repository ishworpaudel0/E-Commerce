import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/storeHook';
import { fetchProducts, addProduct, updateExistingProduct } from '../../store/slices/productSlice';
import { fetchCategories } from '../../store/slices/categorySlice';
import { 
  Box, Typography, Button, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Dialog, DialogTitle, 
  DialogContent, TextField, DialogActions, MenuItem, IconButton 
} from '@mui/material';
import { Add, PhotoCamera, Edit } from '@mui/icons-material';
import { CircularProgress } from '@mui/material';

const AdminProducts = () => {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.product);
  const { categories } = useAppSelector((state) => state.category);
  
  const [open, setOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  
  const [formData, setFormData] = useState({
    name: '', description: '', price: '', stock: '', brand: '', category: ''
  });

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }));
    dispatch(fetchCategories());
  }, [dispatch]);

  // Open modal for editing
  const handleEditClick = (product: any) => {
    setIsEdit(true);
    setEditId(product._id);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      stock: product.stock.toString(),
      brand: product.brand,
      category: product.category?._id || ''
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setIsEdit(false);
    setEditId(null);
    setFormData({ name: '', description: '', price: '', stock: '', brand: '', category: '' });
    setSelectedFiles(null);
  };
const handleSave = async () => {
  if (isEdit && editId) {
    const updateData = {
      ...formData,
      price: Number(formData.price),
      stock: Number(formData.stock),
      category:
        typeof formData.category === 'object'
          ? (formData.category as any)._id
          : formData.category,
    };

    const result = await dispatch(updateExistingProduct({ id: editId, data: updateData }));
    if (updateExistingProduct.fulfilled.match(result)) {
      handleClose();
    }

  } else {
    const data = new FormData();
    Object.entries(formData).forEach(([key, val]) => data.append(key, val));
    if (selectedFiles) {
      Array.from(selectedFiles).forEach((file) => data.append('images', file));
    }
    const result = await dispatch(addProduct(data));
    if (addProduct.fulfilled.match(result)) {
      handleClose();
    }
  }
};

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Product Inventory</Typography>
        <Button 
            variant="contained" 
            startIcon={<Add />} 
            onClick={() => { setIsEdit(false); setOpen(true); }}
        >
            Add Product
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#1976D2' }}>
              <TableCell>Product</TableCell>
              <TableCell>Category</TableCell>
              <TableCell>Price</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((prod) => (
              <TableRow key={prod._id}>
                <TableCell>{prod.name}</TableCell>
                <TableCell>{prod.category?.name || 'Uncategorized'}</TableCell>
                <TableCell>Rs. {prod.price}</TableCell>
                <TableCell>{prod.stock}</TableCell>
                <TableCell align="right">
                  <IconButton color="primary" onClick={() => handleEditClick(prod)}>
                    <Edit />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Shared Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{isEdit ? 'Edit Product' : 'Add New Product'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField 
            label="Name" fullWidth value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})} 
          />
          <TextField 
            select label="Category" fullWidth value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            {categories.map((cat) => (
              <MenuItem key={cat._id} value={cat._id}>{cat.name}</MenuItem>
            ))}
          </TextField>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField 
                label="Price" type="number" fullWidth value={formData.price}
                onChange={(e) => setFormData({...formData, price: e.target.value})} 
            />
            <TextField 
                label="Stock" type="number" fullWidth value={formData.stock}
                onChange={(e) => setFormData({...formData, stock: e.target.value})} 
            />
          </Box>
          <TextField 
            label="Brand" fullWidth value={formData.brand}
            onChange={(e) => setFormData({...formData, brand: e.target.value})} 
          />
          <TextField 
            label="Description" multiline rows={3} fullWidth value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
          
          {!isEdit && ( // Image upload usually handled separately for edits to avoid complexity
            <>
              <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                Upload Images
                <input type="file" hidden multiple onChange={(e) => setSelectedFiles(e.target.files)} />
              </Button>
              {selectedFiles && <Typography variant="caption">{selectedFiles.length} files selected</Typography>}
            </>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button 
            onClick={handleSave} variant="contained" disabled={loading}
            startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {loading ? 'Processing...' : isEdit ? 'Update Product' : 'Save Product'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminProducts;