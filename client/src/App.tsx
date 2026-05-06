import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "./hooks/storeHook";
import { fetchCart } from "./store/slices/cartSlice";
import Navbar from "./components/navbar";
import AppRoutes from "./routes";
import { Box, ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import Footer from "./components/footer";

function App() {
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  //Light and dark mode stored in Local Storage so that we can retrive it easily
  const [mode, setMode] = useState<'light' | 'dark'>(
    (localStorage.getItem("themeMode") as 'light' | 'dark') || 'light'
  );

  const toggleTheme = () => {
    const newMode = mode === 'light' ? 'dark' : 'light';
    setMode(newMode);
    localStorage.setItem("themeMode", newMode);
  };

  // We make reate the theme object based on current mode
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: '#1976d2',
      },
    },
  }), [mode]);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchCart());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets CSS and sets background color according to theme */}
      <CssBaseline /> 
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Navbar />
        <Box sx={{ flex: 1 }}>
          <AppRoutes />
        </Box>
        {/* Pass theme props to Footer */}
        <Footer mode={mode} toggleTheme={toggleTheme} />
      </Box>
    </ThemeProvider>
  );
}

export default App;