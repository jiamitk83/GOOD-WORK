const express = require('express');
const router = express.Router();
const User = require('../models/User');
const auth = require('../middleware/auth');
const checkPermission = require('../middleware/checkPermission');

// Get pending user registrations
router.get('/pending-users', auth, checkPermission('admin'), async (req, res) => {
  try {
    const pendingUsers = await User.find({ 
      approvalStatus: 'pending' 
    })
    .populate('role', 'name')
    .select('-password')
    .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: {
        users: pendingUsers,
        count: pendingUsers.length
      }
    });
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pending users',
      error: error.message
    });
  }
});

// Get all users with approval status
router.get('/users', auth, checkPermission('admin'), async (req, res) => {
  try {
    const { status, userType, page = 1, limit = 10 } = req.query;
    
    let query = {};
    if (status) query.approvalStatus = status;
    if (userType) query.userType = userType;

    const users = await User.find(query)
      .populate('role', 'name')
      .populate('approvedBy', 'firstName lastName email')
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      data: {
        users,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        total
      }
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// Approve user registration
router.put('/approve-user/:userId', auth, checkPermission('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { notes } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.approvalStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'User has already been processed'
      });
    }

    user.approvalStatus = 'approved';
    user.isActive = true;
    user.approvedBy = req.user.id;
    user.approvedAt = new Date();
    if (notes) user.approvalNotes = notes;

    await user.save();

    // Populate the updated user data
    const updatedUser = await User.findById(userId)
      .populate('role', 'name')
      .populate('approvedBy', 'firstName lastName email')
      .select('-password');

    res.json({
      success: true,
      message: 'User approved successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({
      success: false,
      message: 'Error approving user',
      error: error.message
    });
  }
});

// Reject user registration
router.put('/reject-user/:userId', auth, checkPermission('admin'), async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;

    if (!reason) {
      return res.status(400).json({
        success: false,
        message: 'Rejection reason is required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.approvalStatus !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'User has already been processed'
      });
    }

    user.approvalStatus = 'rejected';
    user.isActive = false;
    user.rejectionReason = reason;
    user.approvedBy = req.user.id;
    user.approvedAt = new Date();

    await user.save();

    // Populate the updated user data
    const updatedUser = await User.findById(userId)
      .populate('role', 'name')
      .populate('approvedBy', 'firstName lastName email')
      .select('-password');

    res.json({
      success: true,
      message: 'User rejected successfully',
      data: { user: updatedUser }
    });
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({
      success: false,
      message: 'Error rejecting user',
      error: error.message
    });
  }
});

// Bulk approve users
router.put('/bulk-approve', auth, checkPermission('admin'), async (req, res) => {
  try {
    const { userIds, notes } = req.body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    const updateData = {
      approvalStatus: 'approved',
      isActive: true,
      approvedBy: req.user.id,
      approvedAt: new Date()
    };

    if (notes) updateData.approvalNotes = notes;

    const result = await User.updateMany(
      { 
        _id: { $in: userIds },
        approvalStatus: 'pending'
      },
      updateData
    );

    res.json({
      success: true,
      message: `${result.modifiedCount} users approved successfully`,
      data: { modifiedCount: result.modifiedCount }
    });
  } catch (error) {
    console.error('Error bulk approving users:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk approving users',
      error: error.message
    });
  }
});

// Get approval statistics
router.get('/approval-stats', auth, checkPermission('admin'), async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$approvalStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    const userTypeStats = await User.aggregate([
      {
        $group: {
          _id: {
            userType: '$userType',
            approvalStatus: '$approvalStatus'
          },
          count: { $sum: 1 }
        }
      }
    ]);

    // Format the statistics
    const approvalStats = {
      pending: 0,
      approved: 0,
      rejected: 0
    };

    stats.forEach(stat => {
      approvalStats[stat._id] = stat.count;
    });

    const typeStats = {};
    userTypeStats.forEach(stat => {
      const { userType, approvalStatus } = stat._id;
      if (!typeStats[userType]) {
        typeStats[userType] = { pending: 0, approved: 0, rejected: 0 };
      }
      typeStats[userType][approvalStatus] = stat.count;
    });

    res.json({
      success: true,
      data: {
        overall: approvalStats,
        byUserType: typeStats
      }
    });
  } catch (error) {
    console.error('Error fetching approval stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching approval statistics',
      error: error.message
    });
  }
});

module.exports = router;
