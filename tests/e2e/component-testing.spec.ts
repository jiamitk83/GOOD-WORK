import { test, expect } from '@playwright/test';

/**
 * Comprehensive End-to-End Testing for School ERP System
 * Tests all integrated components with different user roles
 */

const BASE_URL = 'http://localhost:3000';

const TEST_USERS = {
  ADMIN: {
    email: 'admin@school.edu',
    password: 'SecureAdmin2024!',
    role: 'admin'
  },
  TEACHER: {
    email: 'teacher@school.edu',
    password: 'SecureTeacher2024!',
    role: 'teacher'
  },
  STUDENT: {
    email: 'student@school.edu',
    password: 'SecureStudent2024!',
    role: 'student'
  }
};

const MAIN_ROUTES = [
  { path: '/dashboard', name: 'Dashboard', requiresAuth: true },
  { path: '/students', name: 'Students', requiresAuth: true },
  { path: '/teachers', name: 'Teachers', requiresAuth: true },
  { path: '/courses', name: 'Courses', requiresAuth: true },
  { path: '/timetable', name: 'TimeTable', requiresAuth: true },
  { path: '/attendance', name: 'Attendance', requiresAuth: true },
  { path: '/grades', name: 'Grades', requiresAuth: true },
  { path: '/fees', name: 'Fees Management', requiresAuth: true },
  { path: '/browser', name: 'Browser', requiresAuth: true }
];

const ADMIN_ROUTES = [
  { path: '/roles', name: 'Roles Management', requiresAuth: true, adminOnly: true },
  { path: '/admin/user-approvals', name: 'User Approvals', requiresAuth: true, adminOnly: true },
  { path: '/school-setup', name: 'School Setup', requiresAuth: true, adminOnly: true }
];

const PUBLIC_ROUTES = [
  { path: '/login', name: 'Login', requiresAuth: false },
  { path: '/register', name: 'Register', requiresAuth: false },
  { path: '/forgot-password', name: 'Forgot Password', requiresAuth: false }
];

// Helper function to login
async function login(page, user) {
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[name="email"]', user.email);
  await page.fill('input[name="password"]', user.password);
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/dashboard`);
}

// Test public routes (no authentication required)
test.describe('Public Routes Testing', () => {
  PUBLIC_ROUTES.forEach(route => {
    test(`Should load ${route.name} page`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`);
      await expect(page).toHaveURL(`${BASE_URL}${route.path}`);
      
      // Check for common UI elements
      if (route.path === '/login') {
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
        await expect(page.locator('button[type="submit"]')).toBeVisible();
      }
      
      if (route.path === '/register') {
        await expect(page.locator('input[name="name"]')).toBeVisible();
        await expect(page.locator('input[name="email"]')).toBeVisible();
        await expect(page.locator('input[name="password"]')).toBeVisible();
      }
      
      if (route.path === '/forgot-password') {
        await expect(page.locator('input[name="email"]')).toBeVisible();
      }
    });
  });
});

// Test main routes with admin user
test.describe('Main Components Testing - Admin User', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.ADMIN);
  });

  MAIN_ROUTES.forEach(route => {
    test(`Should load ${route.name} component`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`);
      await expect(page).toHaveURL(`${BASE_URL}${route.path}`);
      
      // Wait for content to load
      await page.waitForLoadState('networkidle');
      
      // Check for Material-UI components (common across all pages)
      await expect(page.locator('.MuiContainer-root, .MuiPaper-root, .MuiTypography-root')).toBeVisible();
      
      // Component-specific checks
      switch(route.path) {
        case '/dashboard':
          await expect(page.locator('text=Dashboard')).toBeVisible();
          break;
        case '/students':
          await expect(page.locator('text=Student Management')).toBeVisible();
          break;
        case '/teachers':
          await expect(page.locator('text=Teacher Management')).toBeVisible();
          break;
        case '/courses':
          await expect(page.locator('text=Course Management')).toBeVisible();
          break;
        case '/timetable':
          await expect(page.locator('text=Time Table')).toBeVisible();
          break;
        case '/attendance':
          await expect(page.locator('text=Attendance Management')).toBeVisible();
          break;
        case '/grades':
          await expect(page.locator('text=Grade Management')).toBeVisible();
          break;
        case '/fees':
          await expect(page.locator('text=Fee Management')).toBeVisible();
          break;
        case '/browser':
          await expect(page.locator('text=Simple Browser')).toBeVisible();
          break;
      }
    });
  });
});

// Test admin-only routes
test.describe('Admin Routes Testing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.ADMIN);
  });

  ADMIN_ROUTES.forEach(route => {
    test(`Should load ${route.name} component`, async ({ page }) => {
      await page.goto(`${BASE_URL}${route.path}`);
      await expect(page).toHaveURL(`${BASE_URL}${route.path}`);
      
      // Wait for content to load
      await page.waitForLoadState('networkidle');
      
      // Check for admin-specific content
      switch(route.path) {
        case '/roles':
          await expect(page.locator('text=Role Management')).toBeVisible();
          break;
        case '/admin/user-approvals':
          await expect(page.locator('text=User Approval Management')).toBeVisible();
          break;
        case '/school-setup':
          await expect(page.locator('text=School Setup')).toBeVisible();
          break;
      }
    });
  });
});

// Test School Setup sub-components (tabs)
test.describe('School Setup Sub-Components Testing', () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USERS.ADMIN);
    await page.goto(`${BASE_URL}/school-setup`);
  });

  const schoolSetupTabs = [
    { name: 'School Profile', content: 'School Profile' },
    { name: 'Academic Years', content: 'Academic Year' },
    { name: 'Classes & Sections', content: 'Class Structure' },
    { name: 'Subjects', content: 'Subject Management' }
  ];

  schoolSetupTabs.forEach((tab, index) => {
    test(`Should load ${tab.name} tab`, async ({ page }) => {
      // Click on the tab
      await page.locator(`[role="tab"]:nth-child(${index + 1})`).click();
      
      // Wait for tab content to load
      await page.waitForTimeout(500);
      
      // Check if tab content is visible
      await expect(page.locator(`text=${tab.content}`)).toBeVisible();
    });
  });
});

// Test navigation menu
test.describe('Navigation Testing', () => {
  test('Should navigate through all menu items', async ({ page }) => {
    await login(page, TEST_USERS.ADMIN);
    
    // Test main navigation items
    const menuItems = [
      'Dashboard', 'Students', 'Teachers', 'Courses', 
      'TimeTable', 'Attendance', 'Grades', 'Fees', 'Browser'
    ];
    
    for (const item of menuItems) {
      // Open navigation drawer if needed (mobile)
      try {
        await page.locator('[data-testid="MenuIcon"]').click();
        await page.waitForTimeout(300);
      } catch (e) {
        // Navigation might already be open
      }
      
      // Click menu item
      await page.locator(`text=${item}`).click();
      await page.waitForLoadState('networkidle');
      
      // Verify navigation worked
      await expect(page.locator('.MuiContainer-root')).toBeVisible();
    }
  });
});

// Test responsive design
test.describe('Responsive Design Testing', () => {
  test('Should work on mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await login(page, TEST_USERS.ADMIN);
    
    // Test that navigation drawer works on mobile
    await expect(page.locator('[data-testid="MenuIcon"]')).toBeVisible();
    
    // Test a few key components on mobile
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('text=Dashboard')).toBeVisible();
    
    await page.goto(`${BASE_URL}/students`);
    await expect(page.locator('text=Student Management')).toBeVisible();
  });
  
  test('Should work on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await login(page, TEST_USERS.ADMIN);
    
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page.locator('text=Dashboard')).toBeVisible();
  });
});

// Test user permissions
test.describe('Permission Testing', () => {
  test('Teacher should not access admin routes', async ({ page }) => {
    await login(page, TEST_USERS.TEACHER);
    
    // Try to access admin route
    await page.goto(`${BASE_URL}/roles`);
    
    // Should be redirected or show error
    await expect(page).not.toHaveURL(`${BASE_URL}/roles`);
  });
  
  test('Student should have limited access', async ({ page }) => {
    await login(page, TEST_USERS.STUDENT);
    
    // Should access dashboard
    await page.goto(`${BASE_URL}/dashboard`);
    await expect(page).toHaveURL(`${BASE_URL}/dashboard`);
    
    // Should access grades (view only)
    await page.goto(`${BASE_URL}/grades`);
    await expect(page).toHaveURL(`${BASE_URL}/grades`);
    
    // Should not access admin routes
    await page.goto(`${BASE_URL}/roles`);
    await expect(page).not.toHaveURL(`${BASE_URL}/roles`);
  });
});

// Test error handling
test.describe('Error Handling Testing', () => {
  test('Should handle invalid routes', async ({ page }) => {
    await page.goto(`${BASE_URL}/invalid-route`);
    
    // Should redirect to home or show 404
    await expect(page).not.toHaveURL(`${BASE_URL}/invalid-route`);
  });
  
  test('Should handle authentication redirect', async ({ page }) => {
    await page.goto(`${BASE_URL}/dashboard`);
    
    // Should redirect to login
    await expect(page).toHaveURL(`${BASE_URL}/login`);
  });
});

// Performance testing
test.describe('Performance Testing', () => {
  test('All components should load within reasonable time', async ({ page }) => {
    await login(page, TEST_USERS.ADMIN);
    
    for (const route of MAIN_ROUTES) {
      const startTime = Date.now();
      await page.goto(`${BASE_URL}${route.path}`);
      await page.waitForLoadState('networkidle');
      const loadTime = Date.now() - startTime;
      
      // Should load within 3 seconds
      expect(loadTime).toBeLessThan(3000);
    }
  });
});
