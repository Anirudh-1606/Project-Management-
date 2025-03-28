import React from "react";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import Board from "./components/Board";

const theme = createTheme({
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f0f2f5",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Board />
    </ThemeProvider>
  );
}

export default App;
