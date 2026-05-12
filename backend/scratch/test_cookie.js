import express from 'express';
import supertest from 'supertest';
const app = express();

app.get('/logout', (req, res) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.json({ success: true });
});

supertest(app).get('/logout').then(res => {
  console.log(res.headers['set-cookie']);
});
