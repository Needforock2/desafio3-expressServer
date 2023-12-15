import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import axios from 'axios'
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
const theme = extendTheme({
  colors: {
    custom: {
      text: "#1A1A1A",
      primary: "#FAFAFA",
      background: "#214A5F",
      secondary: "#C42F6D",
    },
  },
  fonts: {
    heading: `'Playfair Display', serif`,
    body: `'Open Sans', sans-serif`,
    button: `'Playfair Display', serif`,
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
