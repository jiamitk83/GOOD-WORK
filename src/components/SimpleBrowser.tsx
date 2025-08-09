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
  Container,
  useTheme,
  useMediaQuery,
  Alert,
  Tooltip,
  Stack
} from '@mui/material';
import {
  Refresh,
  ArrowBack,
  ArrowForward,
  Home,
  Search,
  OpenInNew,
  Bookmark,
  BookmarkBorder,
  Language
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
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  // Check if URL is provided in query parameters
  const urlFromParams = getUrlFromQueryParams();
  const startUrl = urlFromParams || initialUrl;
  
  const [url, setUrl] = useState(startUrl);
  const [displayUrl, setDisplayUrl] = useState(startUrl);
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<string[]>([startUrl]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [bookmarks, setBookmarks] = useState<string[]>([
    'https://www.google.com',
    'https://education.gov.in',
    'https://www.khanacademy.org'
  ]);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const normalizeUrl = (input: string): string => {
    if (!input.startsWith('http://') && !input.startsWith('https://')) {
      return `https://${input}`;
    }
    return input;
  };

  // Check if current URL is bookmarked
  useEffect(() => {
    setIsBookmarked(bookmarks.includes(url));
  }, [url, bookmarks]);

  const toggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks(bookmarks.filter(bookmark => bookmark !== url));
    } else {
      setBookmarks([...bookmarks, url]);
    }
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
    <Container maxWidth="xl" sx={{ py: isMobile ? 1 : 2 }}>
      <Paper elevation={3} sx={{ overflow: 'hidden', borderRadius: 2, mb: 3 }}>
        {/* Browser toolbar */}
        <Box sx={{ 
          p: isMobile ? 0.5 : 1, 
          bgcolor: 'grey.100', 
          display: 'flex', 
          alignItems: 'center', 
          gap: isMobile ? 0.5 : 1,
          flexWrap: isMobile ? 'wrap' : 'nowrap'
        }}>
          {/* Navigation buttons */}
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <Tooltip title="Back">
              <IconButton 
                onClick={handleBack} 
                disabled={currentHistoryIndex <= 0}
                size={isMobile ? "small" : "medium"}
              >
                <ArrowBack />
              </IconButton>
            </Tooltip>
            <Tooltip title="Forward">
              <IconButton 
                onClick={handleForward} 
                disabled={currentHistoryIndex >= history.length - 1}
                size={isMobile ? "small" : "medium"}
              >
                <ArrowForward />
              </IconButton>
            </Tooltip>
            <Tooltip title="Refresh">
              <IconButton onClick={handleRefresh} size={isMobile ? "small" : "medium"}>
                <Refresh />
              </IconButton>
            </Tooltip>
            <Tooltip title="Home">
              <IconButton onClick={handleHome} size={isMobile ? "small" : "medium"}>
                <Home />
              </IconButton>
            </Tooltip>
          </Box>
          
          {/* URL bar */}
          <Box 
            component="form" 
            onSubmit={handleSearch} 
            sx={{ 
              display: 'flex', 
              flexGrow: 1,
              width: isMobile ? '100%' : 'auto',
              order: isMobile ? 2 : 1
            }}
          >
            <TextField
              fullWidth
              size="small"
              value={displayUrl}
              onChange={handleUrlChange}
              variant="outlined"
              placeholder="Enter URL or search term"
              sx={{ 
                '& .MuiOutlinedInput-root': {
                  borderRadius: '16px',
                  bgcolor: 'white',
                  fontSize: isMobile ? '0.875rem' : '1rem'
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

          {/* Action buttons */}
          <Box sx={{ display: 'flex', gap: 0.5, order: isMobile ? 1 : 2 }}>
            <Tooltip title={isBookmarked ? "Remove Bookmark" : "Add Bookmark"}>
              <IconButton onClick={toggleBookmark} size={isMobile ? "small" : "medium"}>
                {isBookmarked ? <Bookmark color="primary" /> : <BookmarkBorder />}
              </IconButton>
            </Tooltip>
            <Tooltip title="Open in New Tab">
              <IconButton 
                onClick={() => window.open(url, '_blank')}
                size={isMobile ? "small" : "medium"}
              >
                <OpenInNew />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
        
        <Divider />
        
        {/* Bookmarks bar */}
        {bookmarks.length > 0 && (
          <>
            <Box sx={{ 
              p: 1, 
              bgcolor: 'grey.50', 
              display: 'flex', 
              gap: 1, 
              overflowX: 'auto',
              '&::-webkit-scrollbar': {
                height: 4
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'grey.300',
                borderRadius: 2
              }
            }}>
              <Typography variant="caption" sx={{ minWidth: 'fit-content', alignSelf: 'center', mr: 1 }}>
                Bookmarks:
              </Typography>
              {bookmarks.map((bookmark, index) => (
                <Button
                  key={index}
                  size="small"
                  variant={url === bookmark ? "contained" : "outlined"}
                  onClick={() => navigateTo(bookmark)}
                  sx={{ 
                    minWidth: 'fit-content', 
                    fontSize: isMobile ? '0.75rem' : '0.875rem',
                    px: isMobile ? 1 : 1.5
                  }}
                >
                  {new URL(bookmark).hostname}
                </Button>
              ))}
            </Box>
            <Divider />
          </>
        )}
        
        {/* Browser content area */}
        <Box 
          sx={{ 
            minHeight: isMobile ? '400px' : '500px', 
            p: isMobile ? 1 : 2, 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          {isLoading ? (
            <Box sx={{ textAlign: 'center' }}>
              <CircularProgress sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Loading {new URL(url).hostname}...
              </Typography>
            </Box>
          ) : error ? (
            <Box sx={{ textAlign: 'center', maxWidth: 400 }}>
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
              <Button variant="contained" onClick={handleRefresh}>
                Retry
              </Button>
            </Box>
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', maxWidth: 600 }}>
              <Language sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant={isMobile ? "h5" : "h4"} gutterBottom>
                Simple Browser Emulator
              </Typography>
              <Typography variant="body1" paragraph color="primary.main">
                Currently viewing: {new URL(url).hostname}
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                This is a UI demonstration of a browser interface. In a real implementation, 
                you could use an iframe or integrate with VS Code's webview API for actual web content.
              </Typography>
              
              <Stack 
                direction={isMobile ? "column" : "row"} 
                spacing={2} 
                justifyContent="center"
                sx={{ mt: 3 }}
              >
                <Button 
                  variant="contained" 
                  onClick={() => window.open(url, '_blank')}
                  startIcon={<OpenInNew />}
                  fullWidth={isMobile}
                >
                  Open in Real Browser
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => navigateTo('https://www.khanacademy.org')}
                  fullWidth={isMobile}
                >
                  Try Khan Academy
                </Button>
              </Stack>
              
              {/* Quick links for educational resources */}
              <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>
                  Educational Resources
                </Typography>
                <Stack 
                  direction={isMobile ? "column" : "row"} 
                  spacing={1} 
                  justifyContent="center"
                  flexWrap="wrap"
                >
                  {[
                    { name: 'Google', url: 'https://www.google.com' },
                    { name: 'Wikipedia', url: 'https://www.wikipedia.org' },
                    { name: 'Khan Academy', url: 'https://www.khanacademy.org' },
                    { name: 'Coursera', url: 'https://www.coursera.org' }
                  ].map((site) => (
                    <Button
                      key={site.name}
                      size="small"
                      variant="text"
                      onClick={() => navigateTo(site.url)}
                      fullWidth={isMobile}
                    >
                      {site.name}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default SimpleBrowser;
