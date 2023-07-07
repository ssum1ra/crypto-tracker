import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from "react-query";
import { RouterProvider } from "react-router-dom";
import { ThemeProvider } from 'styled-components';
import { lightTheme, darkTheme }  from "./theme";
import router from './Router';

const queryClient = new QueryClient();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={lightTheme}>
        <RouterProvider router={router}/>
      </ThemeProvider>
    </QueryClientProvider>
  </React.StrictMode>
);