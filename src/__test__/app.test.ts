import 'dotenv/config';

import app from '../app';

import supertest from 'supertest';

import db from '../config/database.config';

const request = supertest(app);

beforeAll(async () => {
  await db.sync({ force: true }).then(() => {
    console.log('Database successfully created for test');
  });
});
// Testing for sign up
describe('it should test all apis', () => {
  it('it should create a user', async () => {
    const response = await request.post('/users/create').send({
      firstname: 'Mary',

      lastname: 'Doe',

      username: 'maryjoe',

      email: 'marydoe@yahoo.com',

      phonenumber: '08112345678',

      password: '12345678',

      confirmpassword: '12345678'
    });

    expect(response.status).toBe(201);

    expect(response.body.msg).toBe('User created successfully');

    expect(response.body.status).toBe('Success');

    expect(response.body).toHaveProperty('record');
  });
  it('it should login a user using email', async () => {
    const response = await request.post('/users/login').send({
      email: 'marydoe@yahoo.com',

      password: '12345678'
    });

    expect(response.status).toBe(200);

    expect(response.body.msg).toBe('login successful');

    expect(response.body.status).toBe('success');

    expect(response.body).toHaveProperty('record');

    expect(response.body).toHaveProperty('token');
  });

  // Testing for login
  it('it should login a user using username', async () => {
    const response = await request.post('/users/login').send({
      username: 'maryjoe',

      password: '12345678'
    });

    expect(response.status).toBe(200);

    expect(response.body.msg).toBe('login successful');

    expect(response.body.status).toBe('success');

    expect(response.body).toHaveProperty('record');

    expect(response.body).toHaveProperty('token');
  });
  it('it should not login unregestered user', async () => {
    const response = await request.post('/users/login').send({
      username: '4444444',

      password: '12345678'
    });

    expect(response.status).toBe(404);

    expect(response.body.msg).toBe('Incorrect username/e-mail or password');

    expect(response.body.status).toBe('fail');
  });
  // Testing for forgot password
  it('it should return status 200 for hitting thr route successfully', async () => {
    const response = await request.post('/users/forgotpassword').send({
      email: 'marydoe@yahoo.com'
    });

    expect(response.status).toBe(200);
  });
  // Testing for change password
  it('it should change password successfully', async () => {
    const response = await request.post('/users/login').send({
      username: 'maryjoe',

      password: '12345678'
    });

    const { id } = response.body.record;
    const response2 = await request.patch(`/users/change-password/${id}`).send({
      password: '1234567890',
      confirmPassword: '1234567890'
    });
    expect(response2.status).toBe(200);
  });
});

beforeAll(async () => {
  await db.sync({ }).then(() => {
    console.log("Database connected successfully to test");
  })
});
//update user profile
describe("it should test our API", () => {
it("update user profile", async () => {
  const response = await request.post('/users/create').send({
    firstname: "parist",
    lastname: "ohis",
    email: "ddj@yahoo.com",
    username: "parisohis7",
    password: "123456",
    confirmpassword: "123456",
    phonenumber: "09012345678",
  })


    const response2 = await request.post('/users/login').send({
        email: "ddj@yahoo.com",
        password: "123456",
    });
    const {id} = response2.body.record
    const {token} = response2.body
    
    const response3 = await request
    .patch(`/users/update/${id}`)
    .set('authorization', `Bearer ${token}`)
    .send({
        firstname: "Imeh",
        lastname: "Usoro",
    })
    expect(response3.status).toBe(201)
    expect(response3.body.message).toBe('you have successfully updated your profile')
    expect(response3.body).toHaveProperty('record')
})
})
