import mongoose from "mongoose";
import User from "./User";


describe('User Model', () => {
  beforeAll(async () => {
    // No need to connect; the preset does it automatically
  });

  afterEach(async () => {
    await User.deleteMany({}); // clean up after each test
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a user successfully', async () => {
    const userData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'hashedpassword',
    };
    const user = new User(userData);
    await user.save();

    expect(user._id).toBeDefined();
    expect(user.name).toBe(userData.name);
    expect(user.email).toBe(userData.email);
  });

  it('should fail when required fields are missing', async () => {
    const user = new User({ name: 'Jane' }); // missing email and password
    let error;
    try {
      await user.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeInstanceOf(mongoose.Error.ValidationError);
    expect(error.errors.email).toBeDefined();
    expect(error.errors.password).toBeDefined();
  });

  it('should enforce unique email', async () => {
    const user1 = new User({
      name: 'John',
      email: 'unique@example.com',
      password: 'pass123',
    });
    await user1.save();

    const user2 = new User({
      name: 'Jane',
      email: 'unique@example.com',
      password: 'pass456',
    });

    let error;
    try {
      await user2.save();
    } catch (err) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.code).toBe(11000); // MongoDB duplicate key error code
  });
});