import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ConfigProvider } from 'antd';
import { ApolloProvider } from '@apollo/client/react';
import { ThemeProvider } from 'styled-components';
import { theme } from './styles/theme';
import './styles/styled.d.ts';
import './index.css';
import App from './App.tsx';
import { apolloClient } from './graphql/config/client.ts';

// Ant Design theme configuration
const antdTheme = {
  token: {
    colorPrimary: '#00a884',
    colorLink: '#00a884',
    colorSuccess: '#00a884',
    borderRadius: 8,
  },
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <ConfigProvider theme={antdTheme}>
          <App />
        </ConfigProvider>
      </ThemeProvider>
    </ApolloProvider>
  </StrictMode>,
);
