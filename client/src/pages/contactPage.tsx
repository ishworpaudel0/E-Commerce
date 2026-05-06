import React, { useState, useRef } from "react";
import { 
  Box, Typography, Container, Paper, Stack, 
  TextField, Button, Divider, Alert, Snackbar 
} from "@mui/material";
import { Email, Phone, LocationOn, Send } from "@mui/icons-material";
import emailjs from "@emailjs/browser";

const ContactPage = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formRef.current) return;

    setIsSending(true);

    try {
      await emailjs.sendForm(
        import.meta.env.VITE_EmailJS_Service_ID,
        import.meta.env.VITE_EmailJS_Template_ID,
        formRef.current,
        import.meta.env.VITE_EmailJS_Public_key
      );

      setStatus({ type: 'success', msg: "Message sent successfully!" });
      formRef.current.reset();
    } catch (error) {
      console.error("EmailJS Error:", error);
      setStatus({ type: 'error', msg: "Failed to send message. Please try again." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{ fontWeight: "bold" }} color="primary">
            Contact Us
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Have questions? We'd love to hear from you.
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', md: 'row' }, 
          gap: 6 
        }}>
          <Stack spacing={3} sx={{ flex: 1 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              Get in Touch
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Email color="primary" />
              <Typography>support@electronicstore.com</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Phone color="primary" />
              <Typography>+977 1-4444444</Typography>
            </Box>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <LocationOn color="primary" />
              <Typography>New Baneshwor, Kathmandu, Nepal</Typography>
            </Box>
          </Stack>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

          {/* Contact Form Section */}
          <Box sx={{ flex: 1.5 }}>
            <Typography variant="h5" sx={{ fontWeight: "bold" }} gutterBottom>
              Send a Message
            </Typography>
            
            <form ref={formRef} onSubmit={handleSubmit}>
              <Stack spacing={2}>
                <TextField 
                  fullWidth 
                  name="name" 
                  label="Your Name" 
                  variant="outlined" 
                  required 
                />
                <TextField 
                  fullWidth 
                  name="email" 
                  label="Email Address" 
                  variant="outlined" 
                  required 
                  type="email" 
                />
                <TextField 
                  fullWidth 
                  name="subject" 
                  label="Subject" 
                  variant="outlined" 
                  required 
                />
                <TextField 
                  fullWidth 
                  name="message" 
                  label="Message" 
                  variant="outlined" 
                  required 
                  multiline 
                  rows={4} 
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  size="large" 
                  disabled={isSending}
                  startIcon={<Send />}
                  sx={{ mt: 2 }}
                >
                  {isSending ? "Sending..." : "Send Message"}
                </Button>
              </Stack>
            </form>
          </Box>
        </Box>
      </Paper>

      {/* Feedback Notification */}
      <Snackbar 
        open={!!status} 
        autoHideDuration={6000} 
        onClose={() => setStatus(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {status ? (
          <Alert onClose={() => setStatus(null)} severity={status.type} sx={{ width: '100%' }}>
            {status.msg}
          </Alert>
        ) : undefined}
      </Snackbar>
    </Container>
  );
};

export default ContactPage;