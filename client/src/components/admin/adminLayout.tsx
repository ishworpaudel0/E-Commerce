import { useState } from 'react';
import { 
  Box, Drawer, List, ListItem, ListItemIcon, ListItemText, Toolbar, Typography,
  AppBar, IconButton, CssBaseline, Divider, Button, Tooltip 
} from '@mui/material';
import { 
  Dashboard, People, Inventory, ShoppingCart, 
  Home as HomeIcon, 
} from '@mui/icons-material';
import MenuIcon from '@mui/icons-material/Menu';
import { Outlet, useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const AdminLayout = () => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Back to Home', icon: <HomeIcon />, path: '/' },
    { text: 'Dashboard', icon: <Dashboard />, path: '/admin/dashboard' },
    { text: 'Users', icon: <People />, path: '/admin/users' },
    { text: 'Products', icon: <Inventory />, path: '/admin/products' },
    { text: 'Categories', icon: <Inventory />, path: '/admin/add-category' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/admin/orders' },
  ];

  const drawerContent = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap sx={{ fontWeight: 'bold' }}>
          Admin Panel
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem 
              key={item.text} 
              onClick={() => {
                navigate(item.path);
                if (mobileOpen) handleDrawerToggle(); 
              }} 
              sx={{ 
                cursor: 'pointer', 
                '&:hover': { backgroundColor: 'action.hover' },
                color: item.text === 'Back to Home' ? 'primary.main' : 'inherit'
              }}
            >
              <ListItemIcon sx={{ color: item.text === 'Back to Home' ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Electronic Store Admin
          </Typography>

          <Tooltip title="View Main Website">
            <Button 
              color="inherit" 
              startIcon={<HomeIcon />}
              onClick={() => navigate('/')}
              sx={{ textTransform: 'none' }}
            >
              Back to Home
            </Button>
          </Tooltip>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { 
            width: drawerWidth, 
            boxSizing: 'border-box' 
          },
        }}
      >
        {drawerContent}
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 3, 
          width: { sm: `calc(100% - ${drawerWidth}px)` } 
        }}
      >
        <Toolbar /> 
        <Outlet /> 
      </Box>
    </Box>
  );
};

export default AdminLayout;