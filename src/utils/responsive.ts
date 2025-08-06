import { useTheme, useMediaQuery } from '@mui/material';

// Custom hook for responsive design
export const useResponsive = () => {
  const theme = useTheme();
  
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  const isLargeScreen = useMediaQuery(theme.breakpoints.up('lg'));

  return {
    isMobile,
    isTablet,
    isDesktop,
    isLargeScreen,
    screenSize: isMobile ? 'mobile' : isTablet ? 'tablet' : isDesktop ? 'desktop' : 'large'
  };
};

// Mobile-optimized table component
export const getMobileTableProps = (isMobile: boolean) => ({
  size: isMobile ? 'small' : 'medium',
  stickyHeader: true,
  sx: {
    '& .MuiTableCell-root': {
      padding: isMobile ? '8px 4px' : '16px',
      fontSize: isMobile ? '0.75rem' : '0.875rem'
    },
    '& .MuiTableRow-root': {
      minHeight: isMobile ? 48 : 53
    }
  }
});

// Mobile-optimized dialog props
export const getMobileDialogProps = (isMobile: boolean) => ({
  fullScreen: isMobile,
  fullWidth: true,
  maxWidth: isMobile ? false : 'md',
  sx: {
    '& .MuiDialog-paper': {
      margin: isMobile ? 0 : 32,
      borderRadius: isMobile ? 0 : 8
    }
  }
});

// Mobile-optimized form field props
export const getMobileFieldProps = (isMobile: boolean) => ({
  size: isMobile ? 'small' : 'medium',
  fullWidth: true,
  sx: {
    mb: isMobile ? 1.5 : 2
  }
});

// Mobile-optimized button props
export const getMobileButtonProps = (isMobile: boolean) => ({
  size: isMobile ? 'small' : 'medium',
  sx: {
    minHeight: isMobile ? 36 : 42,
    fontSize: isMobile ? '0.75rem' : '0.875rem'
  }
});

// Responsive grid breakpoints for cards
export const getResponsiveGridProps = (cols: { xs?: number; sm?: number; md?: number; lg?: number }) => ({
  xs: cols.xs || 12,
  sm: cols.sm || 6,
  md: cols.md || 4,
  lg: cols.lg || 3
});

// Mobile-optimized spacing
export const getMobileSpacing = (isMobile: boolean) => ({
  containerPadding: isMobile ? 1 : 3,
  sectionMargin: isMobile ? 1 : 2,
  cardPadding: isMobile ? 2 : 3
});
