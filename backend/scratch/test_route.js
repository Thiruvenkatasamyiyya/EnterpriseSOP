import mongoose from 'mongoose';
import supertest from 'supertest';
import app from '../app.js';
import User from '../models/User.js';

async function run() {
  await mongoose.connect(process.env.DB_URI || 'mongodb://localhost:27017/test');
  
  const admin = await User.create({
    name: 'Admin',
    email: 'admin_test@example.com',
    password: 'admin123',
    role: 'admin',
    access: 'approved',
  });
  const adminToken = admin.getJwtToken();
  const fakeId = new mongoose.Types.ObjectId();

  const res = await supertest(app)
    .delete(`/api/v1/admin/users/${fakeId}`)
    .set('Authorization', `Bearer ${adminToken}`);

  console.log("STATUS:", res.status);
  console.log("BODY:", res.body);
  console.log("TEXT:", res.text);
  
  await mongoose.disconnect();
}

run().catch(console.error);
