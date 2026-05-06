import { Box, Typography, Container, Paper, Stack, Divider } from "@mui/material";

const AboutPage = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 5, mb: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" gutterBottom sx={{fontWeight:"bold"}} color="primary">
            About Us
          </Typography>
          <Typography variant="h6" color="textSecondary">
            Your trusted source for all things tech.
          </Typography>
        </Box>

        <Divider sx={{ mb: 4 }} />

        <Stack spacing={4}>
          <Box>
            <Typography variant="h5" sx={{fontWeight:"bold"}} gutterBottom>
              Our Story
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{lineHeight:1.7}}>
              Founded in 2026, Electronic Store started as a small project to bridge the gap 
              between high-end hardware and everyday developers. We focus on dependability, 
              customer service, and providing the latest in full-stack electronic solutions.
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, 
            gap: 4 
          }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6" sx={{fontWeight:"bold"}} color="secondary" gutterBottom>
                Our Mission
              </Typography>
              <Typography variant="body2">
                To provide high-quality electronic components that empower innovation 
                for developers and tech enthusiasts alike.
              </Typography>
            </Box>
            
            <Box sx={{ flex: 1 }}>
              <Typography variant="h6"  color="secondary" sx={{fontWeight:"bold"}}gutterBottom>
                Our Vision
              </Typography>
              <Typography variant="body2">
                To become the premier global destination for developers seeking 
                reliable components and a seamless shopping experience.
              </Typography>
            </Box>
          </Box>
        </Stack>
      </Paper>
    </Container>
  );
};

export default AboutPage;