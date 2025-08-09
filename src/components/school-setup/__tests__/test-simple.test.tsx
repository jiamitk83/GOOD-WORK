import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import AcademicYearManagement from '../AcademicYearManagement';

// Simple test to debug auth mocking
describe('AcademicYearManagement - Auth Debug', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <BrowserRouter>
        {component}
      </BrowserRouter>
    );
  };

  it('should render without permission error when user is admin', () => {
    // Mock the useAuth hook directly
    vi.doMock('../../context/useAuth', () => ({
      useAuth: () => ({
        user: {
          id: '1',
          name: 'Admin User',
          email: 'admin@school.edu',
          userId: 'ADM001',
          role: 'admin',
          permissions: ['manage_users', 'manage_roles', 'view_dashboard', 'manage_school_settings']
        },
        checkPermission: (permission: string) => {
          const userPermissions = ['manage_users', 'manage_roles', 'view_dashboard', 'manage_school_settings'];
          return userPermissions.includes(permission);
        }
      })
    }));

    const { container } = renderWithRouter(<AcademicYearManagement />);
    
    // Debug: Log what's actually rendered
    console.log('Container HTML:', container.innerHTML);
    
    // Should NOT show permission error
    expect(container.textContent).not.toContain('You do not have permission');
  });
});
