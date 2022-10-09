import express from 'express';
import Joi from "joi"
import jwt from "jsonwebtoken";

export const generateToken=(user:{[key:string]:unknown}):unknown=>{
    const pass = process.env.JWT_SECRET as string
     return jwt.sign(user,pass, {expiresIn:'7d'})
}

export const withdrawalSchema = Joi.object().keys({
    accNumber: Joi.string().trim().required().pattern(/^[0-9]+$/).length(10),
    bankName: Joi.string().trim().required(),
    amount: Joi.number().required(),
  });
  
  