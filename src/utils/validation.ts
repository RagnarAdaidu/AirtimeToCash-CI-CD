import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import Joi from 'joi';
import jwt from 'jsonwebtoken';

export const validationSchema = Joi.object({
  firstname: Joi.string().trim().required(),
  lastname: Joi.string().trim().required(),
  username: Joi.string().trim().required(),
  email: Joi.string().email().lowercase().required(),
  phonenumber: Joi.string()
    .length(11)
    .pattern(/^[0-9]+$/)
    .required(),
  password: Joi.string().required(),
  confirmpassword: Joi.ref('password')
}).with('password', 'confirmpassword');

export const loginSchema = Joi.object().keys({
  email: Joi.string().email().lowercase(),
  username: Joi.string().trim(),
  password: Joi.string().trim()
});

export const updateProfileSchema = Joi.object().keys({
  firstname: Joi.string().trim(),
  lastname: Joi.string().trim(),
  phonenumber:Joi.string()
  .length(11)
  .pattern(/^[0-9]+$/),
  wallet: Joi.number()
})

//Generate Token
export const generateToken = (user: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(user, pass, { expiresIn: '7d' });
};

export const changePasswordSchema = Joi.object()
  .keys({
    password: Joi.string().required(),
    confirmPassword: Joi.any()
      .equal(Joi.ref('password'))

      .required()

      .label('Confirm password')

      .messages({ 'any.only': '{{#label}} does not match' })
  })
  .with('password', 'confirmPassword');

// export const generateToken = (user: Record<string, unknown>): unknown => {
//   const passPhrase = process.env.JWT_SECRETE as string;
//   return jwt.sign(user, passPhrase, { expiresIn: '7d' });
// };
export const createAccountSchema = Joi.object().keys({
  bankName: Joi.string().required(),
  accNumber: Joi.string().trim().required().pattern(/^[0-9]+$/).length(10),
  accName: Joi.string().required(),
  wallet: Joi.number().min(0)
});

export const sellAirtimeSchema = Joi.object().keys({
  airtimeAmount: Joi.number().required(),
  network: Joi.string().required(),
  phoneNumber: Joi.string().required().pattern(/^[0-9]+$/).length(11),
  destinationPhoneNumber: Joi.string().required().pattern(/^[0-9]+$/).length(11)
})

export const updateStatusSchema=Joi.object().keys({
  airtimeAmount: Joi.number().required(),
})

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: ''
    }
  }
};
