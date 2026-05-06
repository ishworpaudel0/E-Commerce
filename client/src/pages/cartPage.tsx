import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks/storeHook';
import { fetchCart, removeItem } from '../store/slices/cartSlice';
import { createOrder } from '../store/slices/orderSlice';
import { useNavigate } from 'react-router-dom';
import {
    Container, Typography, Box, Card, CardContent, Button,
    Divider, IconButton, TextField, Alert
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const Cart = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { items, totalPrice, loading: cartLoading } = useAppSelector((state) => state.cart);
    const { loading: orderLoading, error } = useAppSelector((state) => state.orders);

    // Shipping Form State
    const [shipping, setShipping] = useState({
        address: '',
        city: '',
        phone: '',
        paymentMethod: 'COD' as string
    });

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setShipping({ ...shipping, [e.target.name]: e.target.value });
    };

    const handleCheckout = async () => {
        console.log("🛒 Current Redux Cart Items:", items);   // ← Add this
    console.log("👤 User ID from auth:", /* add from selector */);

    if (items.length === 0) {
        alert("Cart is empty in frontend");
        return;
    }
    if (!shipping.address || !shipping.city || !shipping.phone) {
        alert("Please fill in all shipping details");
        return;
    }

    try {

        console.log("Sending order data:", shipping); // ← Debug log

        const result = await dispatch(createOrder(shipping)).unwrap();
        
        console.log("Order created successfully:", result);
        
        // Reset form
        setShipping({
            address: '',
            city: '',
            phone: '',
            paymentMethod: 'COD'
        });

        navigate('/orders');
    } catch (err: any) {
        console.error("Full order error:", err);
    }
};

    if (cartLoading && items.length === 0) return <Typography>Loading cart...</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold' }}>
                Your Shopping Cart
            </Typography>

            {items.length === 0 ? (
                <Typography color="text.secondary">Your cart is empty.</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
                    {/* Cart Items */}
                    <Box sx={{ flex: 2 }}>
                        {items.map((item) => (
                            <Card key={item.product._id} sx={{ display: 'flex', p: 2, mb: 2, borderRadius: 2 }}>
                                <img 
                                    src={item.product.images[0]} 
                                    alt={item.product.name} 
                                    style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 8 }} 
                                />
                                <CardContent sx={{ flex: 1, ml: 2 }}>
                                    <Typography variant="h6">{item.product.name}</Typography>
                                    <Typography color="text.secondary">Qty: {item.quantity}</Typography>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                        Rs. {(item.product.price * item.quantity).toLocaleString()}
                                    </Typography>
                                </CardContent>
                                <IconButton color="error" onClick={() => dispatch(removeItem(item.product._id))}>
                                    <DeleteIcon />
                                </IconButton>
                            </Card>
                        ))}
                    </Box>

                    {/* Order Summary + Shipping */}
                    <Box sx={{ flex: 1 }}>
                        <Card sx={{ p: 3, borderRadius: 2 }}>
                            <Typography variant="h6" gutterBottom>Order Summary</Typography>
                            <Divider sx={{ my: 2 }} />
                            
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography>Total:</Typography>
                                <Typography variant="h5" color="success.main" sx={{fontWeight:"bold"}}>
                                    Rs. {totalPrice.toLocaleString()}
                                </Typography>
                            </Box>

                            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>Shipping Details</Typography>
                            
                            <TextField
                                fullWidth
                                label="Address"
                                name="address"
                                value={shipping.address}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="City"
                                name="city"
                                value={shipping.city}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />
                            <TextField
                                fullWidth
                                label="Phone Number"
                                name="phone"
                                value={shipping.phone}
                                onChange={handleInputChange}
                                margin="normal"
                                required
                            />

                            <Button
                                variant="contained"
                                size="large"
                                fullWidth
                                onClick={handleCheckout}
                                disabled={orderLoading}
                                sx={{ mt: 3, py: 1.5 }}
                            >
                                {orderLoading ? "Placing Order..." : "Place Order"}
                            </Button>

                            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
                        </Card>
                    </Box>
                </Box>
            )}
        </Container>
    );
};

export default Cart;