import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { generateToken, requireAuth, AuthenticatedRequest } from '../authMiddleware.js';

const router = express.Router();

// Email validation helper
function isValidEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 1. Applicant Registration
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { full_name, email, phone, password, confirm_password } = req.body;

    // Field presence checks
    if (!full_name || !email || !phone || !password || !confirm_password) {
      res.status(400).json({ error: 'All fields are required. Please fill in full name, email, phone, and password.' });
      return;
    }

    if (!isValidEmail(email)) {
      res.status(400).json({ error: 'Please enter a valid email address.' });
      return;
    }

    if (phone.trim().length < 7) {
      res.status(400).json({ error: 'Please provide a valid phone number with area/country code.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ error: 'Password must be at least 6 characters long.' });
      return;
    }

    if (password !== confirm_password) {
      res.status(400).json({ error: 'Passwords do not match. Please re-enter your password.' });
      return;
    }

    // Check unique email
    const existing = db.getUserByEmail(email);
    if (existing) {
      res.status(409).json({ error: 'An account with this email address already exists. Please log in.' });
      return;
    }

    // Hash password with bcrypt
    const password_hash = await bcrypt.hash(password, 10);

    const user = db.createUser({
      full_name: full_name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password_hash,
      role: 'applicant',
    });

    const token = generateToken(user);

    res.status(201).json({
      message: 'Account created successfully.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error occurred during registration.' });
  }
});

// 2. User Login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: 'Please enter both your email address and password.' });
      return;
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      res.status(401).json({ error: 'Invalid email or password credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      res.status(401).json({ error: 'Invalid email or password credentials.' });
      return;
    }

    const token = generateToken(user);

    res.json({
      message: 'Logged in successfully.',
      token,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error occurred during login.' });
  }
});

// 3. User Logout
router.post('/logout', (req: Request, res: Response): void => {
  res.json({ message: 'Logged out successfully.' });
});

// 4. Current User Info
router.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response): void => {
  if (!req.user) {
    res.status(401).json({ error: 'Not authenticated.' });
    return;
  }

  res.json({
    user: {
      id: req.user.id,
      full_name: req.user.full_name,
      email: req.user.email,
      phone: req.user.phone,
      role: req.user.role,
    },
  });
});

// 5. Update Profile
router.put('/profile', requireAuth, async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Not authenticated.' });
      return;
    }

    const { full_name, email, phone, current_password, new_password } = req.body;

    // If changing email, ensure it's not already in use by another user
    if (email && email.toLowerCase() !== req.user.email.toLowerCase()) {
      if (!isValidEmail(email)) {
        res.status(400).json({ error: 'Please enter a valid email address.' });
        return;
      }
      const existing = db.getUserByEmail(email);
      if (existing && existing.id !== req.user.id) {
        res.status(409).json({ error: 'This email address is already in use.' });
        return;
      }
    }

    let updatedHash = req.user.password_hash;
    if (new_password) {
      if (!current_password) {
        res.status(400).json({ error: 'Current password is required to set a new password.' });
        return;
      }
      const isMatch = await bcrypt.compare(current_password, req.user.password_hash);
      if (!isMatch) {
        res.status(400).json({ error: 'Current password does not match.' });
        return;
      }
      if (new_password.length < 6) {
        res.status(400).json({ error: 'New password must be at least 6 characters.' });
        return;
      }
      updatedHash = await bcrypt.hash(new_password, 10);
    }

    const updatedUser = db.updateUser(req.user.id, {
      full_name: full_name?.trim() || req.user.full_name,
      email: email?.trim().toLowerCase() || req.user.email,
      phone: phone?.trim() || req.user.phone,
      password_hash: updatedHash,
    });

    if (!updatedUser) {
      res.status(404).json({ error: 'User not found.' });
      return;
    }

    const token = generateToken(updatedUser);

    res.json({
      message: 'Profile updated successfully.',
      token,
      user: {
        id: updatedUser.id,
        full_name: updatedUser.full_name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      },
    });
  } catch (error: any) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// 6. Forgot Password
router.post('/forgot-password', (req: Request, res: Response): void => {
  const { email } = req.body;
  if (!email || !isValidEmail(email)) {
    res.status(400).json({ error: 'Please provide a valid email address.' });
    return;
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    // Return friendly generic confirmation for security
    res.json({
      message: 'If an account exists with this email address, password reset instructions have been dispatched.',
    });
    return;
  }

  // Simulated reset token dispatch
  res.json({
    message: 'If an account exists with this email address, password reset instructions have been dispatched.',
  });
});

export default router;
