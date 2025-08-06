// This is a helper function to open URLs in the Simple Browser
export const openInBrowser = (url: string) => {
  // Normalize URL (add https:// if missing)
  const normalizedUrl = !url.startsWith('http://') && !url.startsWith('https://') 
    ? `https://${url}` 
    : url;
  
  // Check if we're already on the browser page
  const currentPath = window.location.pathname;
  
  if (currentPath === '/browser') {
    // We're already on the browser page, update URL using an event
    const event = new CustomEvent('simplebrowser:navigate', { 
      detail: { url: normalizedUrl } 
    });
    window.dispatchEvent(event);
  } else {
    // Navigate to browser page with URL parameter
    window.location.href = `/browser?url=${encodeURIComponent(normalizedUrl)}`;
  }
};

export default openInBrowser;
