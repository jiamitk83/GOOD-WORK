import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  TextField,
  IconButton,
  Typography,
  Divider,
  Button,
  CircularProgress,
  Container
} from '@mui/material';
import {
  Refresh,
  ArrowBack,
  ArrowForward,
  Home,
  Search
} from '@mui/icons-material';

interface SimpleBrowserProps {
  initialUrl?: string;
}

// Helper function to extract URL from query parameter
const getUrlFromQueryParams = (): string | null => {
  const queryParams = new URLSearchParams(window.location.search);
  return queryParams.get('url');
};

const SimpleBrowser: React.FC<SimpleBrowserProps> = ({ initialUrl = 'https://www.google.com' }) => {
  // Check if URL is provided in query parameters
  const urlFromParams = getUrlFromQueryParams();
  const startUrl = urlFromParams || initialUrl;
  
  const [url, setUrl] = useState(startUrl);
  const [displayUrl, setDisplayUrl] = useState(startUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([startUrl]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const normalizeUrl = (input: string): string => {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`;
    }
    return input;
  };

  const navigateTo = useCallback((newUrl: string) => {
    setError(null);
    setIsLoading(true);
    
    const normalizedUrl = normalizeUrl(newUrl);
    
    // Add to history
    if (normalizedUrl !== url) {
      const newHistory = history.slice(0, currentHistoryIndex + 1);
      newHistory.push(normalizedUrl);
      setHistory(newHistory);
      setCurrentHistoryIndex(newHistory.length - 1);
    }
    
    setUrl(normalizedUrl);
    setDisplayUrl(normalizedUrl);
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, [url, history, currentHistoryIndex]);

  // Listen for navigation events from other components
  useEffect(() => {
    const handleNavigateEvent = (event: CustomEvent) => {
      if (event.detail && event.detail.url) {
        navigateTo(event.detail.url);
      }
    };

    // Add event listener
    window.addEventListener('simplebrowser:navigate', handleNavigateEvent as EventListener);

    // Cleanup
    return () => {
      window.removeEventListener('simplebrowser:navigate', handleNavigateEvent as EventListener);
    };
  }, [navigateTo]);

  // Handle URL from query parameters
  useEffect(() => {
    if (urlFromParams) {
      navigateTo(urlFromParams);
    }
  }, [urlFromParams, navigateTo]);

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDisplayUrl(e.target.value);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigateTo(displayUrl);
  };

  const handleBack = () => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex(currentHistoryIndex - 1);
      setUrl(history[currentHistoryIndex - 1]);
      setDisplayUrl(history[currentHistoryIndex - 1]);
    }
  };

  const handleForward = () => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex(currentHistoryIndex + 1);
      setUrl(history[currentHistoryIndex + 1]);
      setDisplayUrl(history[currentHistoryIndex + 1]);
    }
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleHome = () => {
    navigateTo(initialUrl);
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, mb: 3 }}>
        {/* Browser toolbar */}
        <Box sx={{ p: 1, bgcolor: 'grey.100', display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton onClick={handleBack} disabled={currentHistoryIndex <= 0}>
            <ArrowBack />
          </IconButton>
          <IconButton onClick={handleForward} disabled={currentHistoryIndex >= history.length - 1}>
            <ArrowForward />
          </IconButton>
          <IconButton onClick={handleRefresh}>
            <Refresh />
          </IconButton>
          <IconButton onClick={handleHome}>
            <Home />
          </IconButton>
          
          <Box component="form" onSubmit={handleSearch} sx={{ display: 'flex', flexGrow: 1 }}>
            <TextField
              fullWidth
              size="small"
              value={displayUrl}
              onChange={handleUrlChange}
              variant="outlined"
              placeholder="Enter URL"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  bgcolor: 'white'
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton type="submit" size="small">
                    <Search />
                  </IconButton>
                )
              }}
            />
          </Box>
        </Box>
        
        <Divider />
        
        {/* Browser content area */}
        <Box 
          sx={{ 
            minHeight: '500px', 
            p: 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? (
            <CircularProgress />
          ) : error ? (
            <Box sx={{ textAlign: 'center' }}>
              <Typography color="error" gutterBottom>
                {error}
              </Typography>
              <Button variant="contained" onClick={handleRefresh}>
                Retry
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center' }}>
              <Typography variant="h5" gutterBottom>
                Simple Browser Emulator
              </Typography>
              <Typography variant="body1" paragraph>
                Currently viewing: {url}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Note: This is a UI demonstration only. To implement a full browser experience,
                you would need to use an iframe or integrate with VS Code's webview API.
              </Typography>
              <Button 
                variant="contained" 
                onClick={() => window.open(url, '_blank')}
                sx={{ mt: 2 }}
              >
                Open in Real Browser
              </Button>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleBrowser;
