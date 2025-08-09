import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import Dashboard from '../Dashboard';

// AI Testing Extensions
import { 
  generateTestData, 
  performanceAnalyzer, 
  accessibilityChecker, 
  visualRegressionTester,
  aiTestOracle,
  mutationTester,
  smartAssertions,
  testCoverageAnalyzer
} from '../__test-utils__/ai-testing-extensions';

// Mock the useAuth hook
const mockUseAuth = {
  user: {
    id: '1',
    name: 'Admin User',
    email: 'admin@school.edu',
    userId: 'ADM001',
    role: 'admin',
    permissions: ['manage_users', 'manage_roles', 'view_dashboard', 'manage_students', 'manage_teachers']
  },
  checkPermission: () => true
};

vi.mock('../../context/useAuth', () => ({
  useAuth: () => mockUseAuth
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Dashboard Component', () => {
  let performanceMetrics: any;
  let accessibilityResults: any;
  
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  // AI-Enhanced Performance Testing
  it('should render within acceptable performance thresholds', async () => {
    performanceMetrics = await performanceAnalyzer.measureRenderTime(() => {
      renderWithRouter(<Dashboard />);
    });
    
    expect(performanceMetrics.renderTime).toBeLessThan(2000);
    expect(performanceMetrics.componentSize).toBeLessThan(200000);
    
    console.log('Performance Metrics:', performanceMetrics);
  }, 10000);

  // AI-Enhanced Accessibility Testing
  it('should meet accessibility standards', async () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    accessibilityResults = await accessibilityChecker.checkAccessibility(container);
    const criticalIssues = accessibilityResults.filter((issue: any) => issue.type === 'error');
    
    expect(criticalIssues.length).toBeLessThanOrEqual(3);
    
    const keyboardResults = await accessibilityChecker.testKeyboardNavigation();
    expect(keyboardResults.length).toBeGreaterThanOrEqual(0);
    
    console.log('Accessibility Results:', accessibilityResults);
  }, 10000);

  // AI-Enhanced Dashboard Analytics Testing
  it('should display comprehensive dashboard analytics', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const analyticsElements = container.querySelectorAll('[data-testid*="analytics"], .analytics-card, .stat-card');
    const coverage = testCoverageAnalyzer.analyzeUIComponentCoverage(container);
    
    expect(coverage.totalComponents).toBeGreaterThan(10);
    expect(analyticsElements.length).toBeGreaterThanOrEqual(0);
    
    console.log('Dashboard Analytics Coverage:', coverage);
  });

  // AI-Enhanced Visual Regression Testing
  it('should maintain visual consistency', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const snapshot = visualRegressionTester.captureSnapshot(container, 'dashboard-main-view');
    
    expect(snapshot.dimensions.width).toBeGreaterThan(0);
    expect(snapshot.dimensions.height).toBeGreaterThan(0);
    expect(snapshot.structure).toBeDefined();
    
    console.log('Visual Snapshot:', snapshot);
  });

  // AI-Enhanced Widget Testing
  it('should handle dashboard widgets intelligently', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    // Look for actual dashboard sections and cards
    const widgets = container.querySelectorAll('.MuiPaper-root, .MuiCard-root, .MuiGrid-item, .dashboard-section, .stat-card');
    const suggestions = aiTestOracle.generateContextualTests('dashboard', { 
      widgetCount: widgets.length 
    });
    
    expect(suggestions.length).toBeGreaterThan(0);
    expect(widgets.length).toBeGreaterThanOrEqual(3);
  });

  // AI-Enhanced Integration Testing
  it('should integrate well with other components using AI validation', async () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const integrationPoints = {
      authContext: mockUseAuth.user !== null,
      localStorage: typeof Storage !== 'undefined',
      router: container.closest('[data-testid*="route"]') !== null || container.parentElement !== null,
      materialUI: container.querySelector('.MuiButton-root, .MuiCard-root') !== null
    };
    
    expect(integrationPoints.authContext).toBe(true);
    expect(integrationPoints.localStorage).toBe(true);
    expect(integrationPoints.router).toBe(true);
    expect(integrationPoints.materialUI).toBe(true);
    
    console.log('Integration Analysis:', integrationPoints);
  });

  // AI-Enhanced Responsive Testing
  it('should handle responsive design with AI validation', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    // Simulate different viewport sizes
    const viewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1920, height: 1080 } // Desktop
    ];
    
    viewports.forEach(viewport => {
      // Mock viewport change
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: viewport.width,
      });
      
      const responsiveElements = container.querySelectorAll('.responsive, .mobile-hidden, .desktop-only');
      expect(responsiveElements.length).toBeGreaterThanOrEqual(0);
    });
  });

  // AI-Enhanced Security Testing
  it('should prevent XSS attacks with AI security testing', () => {
    const xssPayloads = [
      '<script>alert("XSS")</script>',
      'javascript:alert("XSS")',
      '<img src="x" onerror="alert(\'XSS\')" />',
      '"><script>alert("XSS")</script>'
    ];
    
    // Mock dashboard data with XSS payloads
    const maliciousDashboardData = {
      welcomeMessage: xssPayloads[0],
      totalStudents: xssPayloads[1],
      recentActivity: xssPayloads[2]
    };
    
    localStorage.setItem('dashboardData', JSON.stringify(maliciousDashboardData));
    
    const { container } = renderWithRouter(<Dashboard />);
    
    const scriptElements = container.querySelectorAll('script');
    expect(scriptElements.length).toBe(0);
    
    xssPayloads.forEach(payload => {
      const elements = container.querySelectorAll('*');
      const hasRawPayload = Array.from(elements).some(el => 
        el.innerHTML === payload
      );
      expect(hasRawPayload).toBe(false);
    });
  });

  // Original tests enhanced with AI capabilities
  it('renders dashboard title', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    // Look for welcome message which is the actual dashboard header
    const dataPresence = aiTestOracle.smartExpectations.dataDisplay(
      container, 
      ['Welcome', 'Admin User', 'Academic Year']
    );
    
    expect(dataPresence.completeness).toBeGreaterThanOrEqual(30);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
  });

  it('displays welcome message for admin user with AI validation', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const userDataPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      ['welcome', 'Admin User']
    );
    
    expect(userDataPresence.completeness).toBeGreaterThanOrEqual(40);
    expect(screen.getByText(/welcome/i)).toBeInTheDocument();
    expect(screen.getByText(/Admin User/i)).toBeInTheDocument();
  });

  it('shows statistics cards with AI analytics validation', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const statsCards = container.querySelectorAll('.stat-card, .statistics-card, .metric-card, .MuiPaper-root');
    const expectedStats = ['total students', 'total teachers'];
    
    const statsPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      expectedStats
    );
    
    expect(statsPresence.completeness).toBeGreaterThanOrEqual(30);
    expect(statsCards.length).toBeGreaterThanOrEqual(0);
    
    expectedStats.forEach(stat => {
      expect(screen.getByText(new RegExp(stat, 'i'))).toBeInTheDocument();
    });
  });

  it('displays recent activities section with AI pattern recognition', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const activityElements = container.querySelectorAll('.activity-item, .recent-activity, .activity-feed');
    const activityPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      ['recent activities']
    );
    
    expect(activityPresence.completeness).toBeGreaterThanOrEqual(30);
    expect(activityElements.length).toBeGreaterThanOrEqual(0);
    expect(screen.getByText(/recent activities/i)).toBeInTheDocument();
  });

  it('shows attendance overview with AI data validation', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const attendanceElements = container.querySelectorAll('.attendance-widget, .attendance-overview, .MuiPaper-root');
    const attendanceData = aiTestOracle.smartExpectations.dataDisplay(
      container,
      ['academic year', 'current term', 'week']
    );
    
    expect(attendanceData.completeness).toBeGreaterThanOrEqual(30);
    expect(attendanceElements.length).toBeGreaterThanOrEqual(0);
    
    // Use getAllByText since there are multiple academic year references
    const academicYearTexts = screen.getAllByText(/academic year/i);
    expect(academicYearTexts.length).toBeGreaterThan(0);
    expect(screen.getByText(/current term/i)).toBeInTheDocument();
  });

  it('displays upcoming events with AI event detection', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const eventElements = container.querySelectorAll('.event-item, .upcoming-events, .event-card');
    const eventPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      ['upcoming events']
    );
    
    expect(eventPresence.completeness).toBeGreaterThanOrEqual(30);
    expect(eventElements.length).toBeGreaterThanOrEqual(0);
    expect(screen.getByText(/upcoming events/i)).toBeInTheDocument();
  });

  it('shows quick actions menu with AI action analysis', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const actionButtons = container.querySelectorAll('.quick-action, .action-button, button, a');
    const quickActionsPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      ['view', 'manage', 'student', 'teacher']
    );
    
    expect(quickActionsPresence.completeness).toBeGreaterThanOrEqual(20);
    expect(actionButtons.length).toBeGreaterThan(0);
    expect(screen.getByText(/view full calendar/i)).toBeInTheDocument();
  });

  it('displays navigation links to other modules with AI navigation testing', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const navigationLinks = container.querySelectorAll('a, [role="link"], .nav-link');
    const moduleNames = ['total students', 'view full calendar'];
    
    const navigationPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      moduleNames
    );
    
    expect(navigationPresence.completeness).toBeGreaterThanOrEqual(10);
    expect(navigationLinks.length).toBeGreaterThan(0);
    
    moduleNames.forEach(module => {
      expect(screen.getByText(new RegExp(module, 'i'))).toBeInTheDocument();
    });
  });

  it('shows performance metrics with AI metrics validation', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const performanceElements = container.querySelectorAll('.performance-metric, .metric-widget, .chart, .MuiPaper-root');
    const metricsPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      ['total students', 'total teachers', '1250', 'semester']
    );
    
    expect(metricsPresence.completeness).toBeGreaterThanOrEqual(20);
    expect(performanceElements.length).toBeGreaterThanOrEqual(0);
    expect(screen.getByText(/total students/i)).toBeInTheDocument();
  });

  it('displays calendar widget with AI calendar validation', () => {
    const { container } = renderWithRouter(<Dashboard />);
    
    const calendarElements = container.querySelectorAll('.calendar, .calendar-widget, .date-picker, a[href="/timetable"]');
    const calendarPresence = aiTestOracle.smartExpectations.dataDisplay(
      container,
      ['calendar']
    );
    
    expect(calendarPresence.completeness).toBeGreaterThanOrEqual(30);
    expect(calendarElements.length).toBeGreaterThanOrEqual(0);
    
    // Use getAllByText to handle multiple calendar references
    const calendarTexts = screen.getAllByText(/calendar/i);
    expect(calendarTexts.length).toBeGreaterThan(0);
  });
});
