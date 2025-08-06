import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Checkbox,
  FormControlLabel,
  Grid,
  Box,
  IconButton,
  Chip
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { useAuth } from '../context/useAuth';

// Sample role and permission data
const SAMPLE_PERMISSIONS = [
  'view_dashboard',
  'manage_users',
  'manage_roles',
  'view_students',
  'manage_students',
  'view_teachers',
  'manage_teachers',
  'view_courses',
  'manage_courses',
  'view_attendance',
  'manage_attendance',
  'view_grades',
  'manage_grades',
  'view_timetable',
  'manage_timetable',
  'view_examinations',
  'manage_examinations',
  'view_fees',
  'manage_fees',
  'view_parents',
  'manage_parents',
  'manage_school_settings'
];

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const initialRoles: Role[] = [
  {
    id: '1',
    name: 'Admin',
    description: 'Full system access',
    permissions: SAMPLE_PERMISSIONS
  },
  {
    id: '2',
    name: 'Teacher',
    description: 'Teacher access to manage classes and grades',
    permissions: ['view_dashboard', 'view_students', 'view_courses', 'manage_grades', 'view_timetable']
  },
  {
    id: '3',
    name: 'Student',
    description: 'Limited access for students',
    permissions: ['view_dashboard', 'view_courses', 'view_grades', 'view_timetable']
  }
];

const RolesManagement: React.FC = () => {
  const { user, checkPermission } = useAuth();
  const [roles, setRoles] = useState<Role[]>(initialRoles);
  const [open, setOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  // Check if user has permission to manage roles
  const canManageRoles = user?.role === 'admin' || checkPermission('manage_roles');

  const handleOpen = (role?: Role) => {
    if (role) {
      setSelectedRole(role);
      setRoleName(role.name);
      setRoleDescription(role.description);
      setSelectedPermissions([...role.permissions]);
    } else {
      setSelectedRole(null);
      setRoleName('');
      setRoleDescription('');
      setSelectedPermissions([]);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePermissionChange = (permission: string) => {
    setSelectedPermissions(prev => 
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };

  const handleSave = () => {
    if (!roleName.trim()) {
      // Show error - role name is required
      return;
    }

    const newRole: Role = {
      id: selectedRole ? selectedRole.id : String(roles.length + 1),
      name: roleName,
      description: roleDescription,
      permissions: selectedPermissions
    };

    if (selectedRole) {
      // Update existing role
      setRoles(roles.map(role => role.id === selectedRole.id ? newRole : role));
    } else {
      // Add new role
      setRoles([...roles, newRole]);
    }

    handleClose();
  };

  const handleDelete = (id: string) => {
    // In a real app, show confirmation dialog
    setRoles(roles.filter(role => role.id !== id));
  };

  // Group permissions by category for better display
  const permissionCategories = {
    'Dashboard': ['view_dashboard'],
    'Users': ['manage_users', 'manage_roles'],
    'Students': ['view_students', 'manage_students'],
    'Teachers': ['view_teachers', 'manage_teachers'],
    'Academics': ['view_courses', 'manage_courses', 'view_timetable', 'manage_timetable'],
    'Assessment': ['view_grades', 'manage_grades', 'view_examinations', 'manage_examinations'],
    'Administration': ['view_attendance', 'manage_attendance', 'view_fees', 'manage_fees', 'view_parents', 'manage_parents', 'manage_school_settings']
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Roles Management
        </Typography>
        {canManageRoles && (
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<Add />}
            onClick={() => handleOpen()}
          >
            Add New Role
          </Button>
        )}
      </Box>

      <Paper sx={{ width: '100%', mb: 2, overflowX: 'auto' }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Role Name</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Description</Typography></TableCell>
                <TableCell><Typography variant="subtitle1" fontWeight="bold">Permissions</Typography></TableCell>
                {canManageRoles && <TableCell align="right"><Typography variant="subtitle1" fontWeight="bold">Actions</Typography></TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {roles.map((role) => (
                <TableRow key={role.id}>
                  <TableCell>{role.name}</TableCell>
                  <TableCell>{role.description}</TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {role.permissions.length > 5 ? (
                        <>
                          {role.permissions.slice(0, 5).map((perm) => (
                            <Chip key={perm} label={perm.replace('_', ' ')} size="small" />
                          ))}
                          <Chip 
                            label={`+${role.permissions.length - 5} more`} 
                            size="small" 
                            variant="outlined" 
                          />
                        </>
                      ) : (
                        role.permissions.map((perm) => (
                          <Chip key={perm} label={perm.replace('_', ' ')} size="small" />
                        ))
                      )}
                    </Box>
                  </TableCell>
                  {canManageRoles && (
                    <TableCell align="right">
                      <IconButton color="primary" onClick={() => handleOpen(role)}>
                        <Edit />
                      </IconButton>
                      {role.name !== 'Admin' && (
                        <IconButton color="error" onClick={() => handleDelete(role.id)}>
                          <Delete />
                        </IconButton>
                      )}
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Role Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>{selectedRole ? 'Edit Role' : 'Add New Role'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Role Name"
            fullWidth
            variant="outlined"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="Description"
            fullWidth
            variant="outlined"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            sx={{ mb: 3 }}
          />

          <Typography variant="h6" gutterBottom>
            Permissions
          </Typography>

          <Grid container spacing={2}>
            {Object.entries(permissionCategories).map(([category, permissions]) => (
              <Grid item xs={12} md={6} key={category}>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                    {category}
                  </Typography>
                  {permissions.map((permission) => (
                    <FormControlLabel
                      key={permission}
                      control={
                        <Checkbox
                          checked={selectedPermissions.includes(permission)}
                          onChange={() => handlePermissionChange(permission)}
                        />
                      }
                      label={permission.replace('_', ' ')}
                    />
                  ))}
                </Paper>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSave} variant="contained" color="primary">
            {selectedRole ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default RolesManagement;
