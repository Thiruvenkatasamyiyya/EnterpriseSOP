import supertest from 'supertest';
import mongoose from 'mongoose';
import app from '../../app';
import User from '../../models/User';
import sendEmail from '../../utils/sendEmail';

// Mock the sendEmail utility
jest.mock('../../utils/sendEmail', () => jest.fn());

describe('User Controller', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  // ==================== 1. REGISTER ====================
  describe('POST /api/v1/register', () => {
    it('should register a new user successfully', async () => {
      const newUser = { name: 'Test User', email: 'test@example.com', password: 'secret123' };
      const res = await supertest(app)
        .post('/api/v1/register')
        .send(newUser)
        .expect(201);

      expect(res.body.message).toBe('wait for permit an access');

      const user = await User.findOne({ email: newUser.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(newUser.name);
    });

    it('should return 400 if required fields missing', async () => {
      const invalidUser = { name: 'No Email' };
      const res = await supertest(app)
        .post('/api/v1/register')
        .send(invalidUser)
        .expect(400);
      expect(res.body.error).toBeDefined();
    });

    it('should return 500 on duplicate email (controller throws MongoError)', async () => {
      await User.create({
        name: 'Existing',
        email: 'duplicate@example.com',
        password: 'hash123',
      });

      const duplicate = {
        name: 'Another',
        email: 'duplicate@example.com',
        password: 'secret',
      };

      const res = await supertest(app)
        .post('/api/v1/register')
        .send(duplicate)
        .expect(500);
      expect(res.body.error).toBeDefined();
    });
  });

  // ==================== 2. LOGIN ====================
  describe('POST /api/v1/login', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Login User',
        email: 'login@example.com',
        password: 'password123',
        access: 'approved',
      });
    });

    it('should login and return token/cookie', async () => {
      const credentials = { email: 'login@example.com', password: 'password123' };
      const res = await supertest(app)
        .post('/api/v1/login')
        .send(credentials)
        .expect(201);

      expect(res.body.token).toBeDefined();
      const cookieHeader = res.headers['set-cookie'];
      expect(cookieHeader).toBeDefined();
    });

    it('should return 500 if email does not exist (controller bug: user.access before null check)', async () => {
      const res = await supertest(app)
        .post('/api/v1/login')
        .send({ email: 'nonexistent@example.com', password: 'anything' })
        .expect(500);
      expect(res.body.error).toBeDefined();
    });

    it('should return 401 if password is wrong', async () => {
      const res = await supertest(app)
        .post('/api/v1/login')
        .send({ email: 'login@example.com', password: 'wrongpass' })
        .expect(401);
      expect(res.body.error).toBe('Invalid email or password');
    });

    it('should return 401 if user access is not approved', async () => {
      await User.create({
        name: 'Pending User',
        email: 'pending@example.com',
        password: 'hash',
        access: 'pending',
      });
      const res = await supertest(app)
        .post('/api/v1/login')
        .send({ email: 'pending@example.com', password: 'hash' })
        .expect(401);
      expect(res.body.message).toContain('Your Status is pending');
    });
  });

  // ==================== 3. LOGOUT ====================
  describe('GET /api/v1/logout', () => {
    it('should clear token cookie and return success', async () => {
      const res = await supertest(app)
        .get('/api/v1/logout')
        .expect(200);

      expect(res.body.message).toBe('Logged out');
      const cookieHeader = res.headers['set-cookie'];
      expect(cookieHeader[0]).toContain('token=null');
      expect(cookieHeader[0]).toContain('Expires=');
    });
  });

  // ==================== 4. FORGOT PASSWORD ====================
  describe('POST /api/v1/password/forgot', () => {
    beforeEach(async () => {
      await User.create({
        name: 'Forgot User',
        email: 'forgot@example.com',
        password: 'hashed',
      });
    });

    it('should send reset email if user exists', async () => {
      const res = await supertest(app)
        .post('/api/v1/password/forgot')
        .send({ email: 'forgot@example.com' })
        .expect(200);

      expect(res.body.message).toContain('Email sent to:forgot@example.com');
      expect(sendEmail).toHaveBeenCalledTimes(1);
      expect(sendEmail).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'forgot@example.com',
          subject: 'Ecom password recovery',
        })
      );

      const user = await User.findOne({ email: 'forgot@example.com' });
      expect(user.resetPasswordToken).toBeDefined();
      expect(user.resetPasswordExpire).toBeDefined();
    });

    it('should return 401 if email not found', async () => {
      const res = await supertest(app)
        .post('/api/v1/password/forgot')
        .send({ email: 'unknown@example.com' })
        .expect(401);
      expect(res.body.error).toBe('User not found with this email');
    });

    it('should handle email sending failure', async () => {
      sendEmail.mockRejectedValueOnce(new Error('Email service down'));

      const res = await supertest(app)
        .post('/api/v1/password/forgot')
        .send({ email: 'forgot@example.com' })
        .expect(500);
      expect(res.body.error).toBe('Email service down');

      const user = await User.findOne({ email: 'forgot@example.com' });
      expect(user.resetPasswordToken).toBeUndefined();
      expect(user.resetPasswordExpire).toBeUndefined();
    });
  });

  // ==================== 5. RESET PASSWORD ====================
  describe('PUT /api/v1/password/reset/:token', () => {
    let user, resetToken;

    beforeEach(async () => {
      user = await User.create({
        name: 'Reset User',
        email: 'reset@example.com',
        password: 'oldpassword',
      });
      resetToken = user.getResetPasswordToken();
      await user.save();
    });

    it('should reset password with valid token', async () => {
      const newPassword = 'newPassword123';
      const res = await supertest(app)
        .put(`/api/v1/password/reset/${resetToken}`)
        .send({ password: newPassword, confirmPassword: newPassword })
        .expect(200);
      expect(res.body.token).toBeDefined();

      const updatedUser = await User.findById(user._id).select('+password');
      const isMatch = await updatedUser.comparePassword(newPassword);
      expect(isMatch).toBe(true);
    });

    it('should return 400 if passwords do not match', async () => {
      const res = await supertest(app)
        .put(`/api/v1/password/reset/${resetToken}`)
        .send({ password: 'new123', confirmPassword: 'different' })
        .expect(400);
      expect(res.body.error).toBe('Password does not match');
    });

    it('should return 400 if token is invalid or expired', async () => {
      const res = await supertest(app)
        .put('/api/v1/password/reset/invalid123')
        .send({ password: 'new123', confirmPassword: 'new123' })
        .expect(400);
      expect(res.body.error).toContain('invalid or has been expires');
    });
  });

  // ==================== 6. GET USER PROFILE ====================
  describe('GET /api/v1/me', () => {
    let token;

    beforeEach(async () => {
      const user = await User.create({
        name: 'Profile User',
        email: 'profile@example.com',
        password: 'secret',
        access: 'approved',
      });
      token = user.getJwtToken();
    });

    it('should return user profile when authenticated', async () => {
      const res = await supertest(app)
        .get('/api/v1/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);
      expect(res.body.user.email).toBe('profile@example.com');
    });

    it('should return 401 if not authenticated', async () => {
      const res = await supertest(app)
        .get('/api/v1/me')
        .expect(401);
    });
  });

  // ==================== 7. UPDATE PASSWORD ====================
  describe('PUT /api/v1/password/update', () => {
    let token, user;

    beforeEach(async () => {
      user = await User.create({
        name: 'Update Password User',
        email: 'updatepass@example.com',
        password: 'oldPass123',
        access: 'approved',
      });
      token = user.getJwtToken();
    });

    it('should update password with correct old password', async () => {
      const res = await supertest(app)
        .put('/api/v1/password/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ oldPassword: 'oldPass123', password: 'newPass456' })
        .expect(200);
      expect(res.body.success).toBe(true);

      const updatedUser = await User.findById(user._id).select('+password');
      const isMatch = await updatedUser.comparePassword('newPass456');
      expect(isMatch).toBe(true);
    });

    it('should return 400 if old password is incorrect', async () => {
      const res = await supertest(app)
        .put('/api/v1/password/update')
        .set('Authorization', `Bearer ${token}`)
        .send({ oldPassword: 'wrongOld', password: 'newPass' })
        .expect(400);
      expect(res.body.error).toBe('old password is incorrect');
    });
  });

  // ==================== 8. ADMIN: ALL USERS ====================
  describe('GET /api/v1/admin/users', () => {
    let adminToken, normalToken;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        access: 'approved',
      });
      adminToken = admin.getJwtToken();

      const normal = await User.create({
        name: 'Normal',
        email: 'normal@example.com',
        password: 'pass',
        role: 'user',
      });
      normalToken = normal.getJwtToken();

      await User.create([
        { name: 'User1', email: 'user1@example.com', password: 'pass1' },
        { name: 'User2', email: 'user2@example.com', password: 'pass2' },
      ]);
    });

    it('should return all users for admin', async () => {
      const res = await supertest(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.users).toHaveLength(4); // admin + normal + user1 + user2
    });

    it('should also return all users for non-admin (no role check in controller)', async () => {
      const res = await supertest(app)
        .get('/api/v1/admin/users')
        .set('Authorization', `Bearer ${normalToken}`)
        .expect(200);
      expect(res.body.users).toHaveLength(4);
    });
  });

  // ==================== 9. ADMIN: GET USER DETAILS ====================
  describe('GET /api/v1/admin/users/:id', () => {
    let adminToken, targetUser;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        access: 'approved',
      });
      adminToken = admin.getJwtToken();

      targetUser = await User.create({
        name: 'Target',
        email: 'target@example.com',
        password: 'pass',
      });
    });

    it('should return user details for valid id', async () => {
      const res = await supertest(app)
        .get(`/api/v1/admin/users/${targetUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.user.email).toBe('target@example.com');
    });

    it('should return 400 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await supertest(app)
        .get(`/api/v1/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
      expect(res.body.error).toContain('User not found with id');
    });
  });

  // ==================== 10. ADMIN: UPDATE USER ====================
  describe('PUT /api/v1/admin/users/:id', () => {
    let adminToken, targetUser;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        access: 'approved',
      });
      adminToken = admin.getJwtToken();

      targetUser = await User.create({
        name: 'Old Name',
        email: 'old@example.com',
        password: 'pass',
        role: 'user',
      });
    });

    it('should update user name, email, role', async () => {
      const updates = { name: 'New Name', email: 'newemail@example.com', role: 'admin' };
      const res = await supertest(app)
        .put(`/api/v1/admin/users/${targetUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);
      expect(res.body.user.name).toBe('New Name');
      expect(res.body.user.email).toBe('newemail@example.com');
      expect(res.body.user.role).toBe('admin');
    });
  });

  // ==================== 11. ADMIN: DELETE USER ====================
  describe('DELETE /api/v1/admin/users/:id', () => {
    let adminToken, targetUser;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        access: 'approved',
      });
      adminToken = admin.getJwtToken();

      targetUser = await User.create({
        name: 'To Delete',
        email: 'delete@example.com',
        password: 'pass',
      });
    });

    it('should delete user successfully', async () => {
      const res = await supertest(app)
        .delete(`/api/v1/admin/users/${targetUser._id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);
      expect(res.body.success).toBe(true);

      const deletedUser = await User.findById(targetUser._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 400 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await supertest(app)
        .delete(`/api/v1/admin/users/${fakeId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(400);
      expect(res.body.error).toContain('User not found with id');
    });
  });

  // ==================== 12. ADMIN: PERMIT USER ====================
  describe('POST /api/v1/admin/permit', () => {
    let adminToken, targetUser;

    beforeEach(async () => {
      const admin = await User.create({
        name: 'Admin',
        email: 'admin@example.com',
        password: 'admin123',
        role: 'admin',
        access: 'approved',
      });
      adminToken = admin.getJwtToken();

      targetUser = await User.create({
        name: 'Pending User',
        email: 'pending@example.com',
        password: 'pass',
        access: 'pending',
      });
    });

    it('should change user access', async () => {
      const res = await supertest(app)
        .post('/api/v1/admin/permit')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: targetUser._id, action: 'approved' })
        .expect(200);
      expect(res.body.response.access).toBe('approved');

      const updatedUser = await User.findById(targetUser._id);
      expect(updatedUser.access).toBe('approved');
    });

    it('should return 400 if user not found', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await supertest(app)
        .post('/api/v1/admin/permit')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({ id: fakeId, action: 'approved' })
        .expect(400);
      expect(res.body.error).toContain('User not found with id');
    });
  });
});