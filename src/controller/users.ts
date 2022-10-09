import dotenv from "dotenv";
import express, { Request, Response, NextFunction } from "express";
import { v4 as uuidv4, validate } from "uuid";
import { UserInstance }  from "../models/user";
import { validationSchema,options, loginSchema, updateProfileSchema, changePasswordSchema } from '../utils/validation'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { emailVerificationView } from "./mailSender";
import { sendMail } from "./emailService";
import { generateToken } from "../utils/utils";
import { forgotPasswordVerification } from "../email/emailVerification";
import { AccountInstance } from "../models/account";
import { defaultValueSchemable } from "sequelize/types/utils";

const secret = process.env.JWT_SECRET as string



export async function RegisterUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
    const id = uuidv4();

    try {
        const ValidateUser = validationSchema.validate(req.body,options);
        if (ValidateUser.error) {
            return res.status(400).json({
                Error: ValidateUser.error.details[0].message,
            });
        }
        const duplicatEmail = await UserInstance.findOne({
            where: { email: req.body.email },
        });
        if (duplicatEmail) {
            return res.status(409).json({
                msg: "Email is used, please enter another email",
            });
        }

        const duplicatePhone = await UserInstance.findOne({
            where: { phonenumber: req.body.phonenumber },
        });

        if (duplicatePhone) {
            return res.status(409).json({
                msg: "Phone number is used",
            });
        }
        const passwordHash = await bcrypt.hash(req.body.password, 8);
        const record = await UserInstance.create({
            id: id,
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            username: req.body.username,
            email: req.body.email,
            phonenumber: req.body.phonenumber,
            password: passwordHash,
            isVerified: false,
            avatar: "https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg?w=2000",
            wallet: 0
        })
        if (record) {
            const email = req.body.email as string;
            const subject = "User verification";
            const username =req.body.username as string
            const token = jwt.sign({id},secret,{expiresIn:'7d'}) 
            const html:string = emailVerificationView(token)
            await sendMail(html,email,subject,username)
            
        res.json({msg:"User created successfully",record, token})
        }  
    } catch (error) {
      console.log(error);
        res.status(500).json({
            message:'failed to register',
            route:'/create'

        })
    }
  }

export async function verifyUser(token: string) {
  const decode = jwt.verify(token, process.env.JWT_SECRET as string);
  const details = decode as unknown as Record<string, unknown>;
  const id = details.id as string;
  const user = await UserInstance.findByPk(id);
  if (!user) throw new Error('user not found');

  return await user.update({ isVerified: true });
} 


export async function getUser(
  req: Request|any,
  res: Response,
  next: NextFunction
) {
  try {
    //const id=req.user.id;
    const { id } = req.params;
    const record = await UserInstance.findOne({ where: { id } });

    res.status(200).json({"record":record});
  } catch (error) {
    res.status(500).json({
      msg: "Invalid User",
      route: "/read/:id",
    });
  }
}

export async function LoginUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try { 
    const validationResult = loginSchema.validate(req.body, options);
    
    if (validationResult.error) {
      return res.status(400).json({
        Error: validationResult.error.details[0].message
      });
    }
   
    const userEmail = req.body.email;
    const userName = req.body.username;
   
    const record = userEmail
      ? ((await UserInstance.findOne({
          where: [{ email: userEmail }]
        })) as unknown as { [key: string]: string })
      : ((await UserInstance.findOne({
          where: [{ username: userName }]
        })) as unknown as { [key: string]: string });
        //console.log("yayyy")
        if(record.isVerified){
      const { id } = record;
      const { password } = record;

      const token = generateToken({ id });
      const validUser = await bcrypt.compare(req.body.password, password);

      if (!validUser) {
        return res.status(401).json({
          msg: 'Password do not match'
        });
      }

      if (validUser) {
        res.cookie('mytoken', token, {
          httpOnly: true,
          maxAge: 1000 * 60 * 60 * 24
        });
        
        res.status(200).json({
          status: 'success',
          msg: 'login successful',
          record: record,
          token: token
        });
      }
    } else{
      return res.status(400).json({
        msg: "Please verify your email address"
      });
    }
   } catch (err) {
    res.status(500).json({
      msg: 'Incorrect username or email',
      route: '/login'
    });
  }
}

export async function forgotPassword(req: Request, res: Response) {
  try {
    const { email } = req.body;

    const user = (await UserInstance.findOne({
      where: {
        email: email
      }
    })) as unknown as { [key: string]: string };

    if (!user) {
      return res.status(404).json({
        message: 'email not found'
      });
    }

    const { id } = user;
    const fromUser = process.env.FROM as string;
    const subject = process.env.SUBJECT as string;
    const html = forgotPasswordVerification(id);

    await sendMail(html, req.body.email, subject, fromUser);

    res.status(200).json({
      message: 'Check email for the verification link'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function changePassword(req: Request, res: Response) {
  try {
    const { id } = req.params;

    const validationResult = changePasswordSchema.validate(req.body, options);
    if (validationResult.error) {
      return res.status(400).json({
        error: validationResult.error.details[0].message
      });
    }

    const user = await UserInstance.findOne({
      where: {
        id: id
      }
    });
    if (!user) {
      return res.status(403).json({
        message: 'user does not exist'
      });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 8);

    await user?.update({
      password: passwordHash
    });
    return res.status(200).json({
      message: 'Password Successfully Changed'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Internal server error'
    });
  }
}

export async function Updateprofile(req:Request, res:Response, next:NextFunction){
    try{
      const { id } = req.params
      const {firstname,lastname,phonenumber, wallet} = req.body
      const validateResult = updateProfileSchema.validate(req.body,options)
        if(validateResult.error){
            return res.status(400).json({
                Error:validateResult.error.details[0].message
            })
        }
      const record = await UserInstance.findByPk(id)
      if(!record){
        res.status(404).json({
                  Error:"cannot find user",
            })   
    }
    const updaterecord = await record?.update({
        firstname,
        lastname,
        phonenumber,
        wallet
     })
     res.status(201).json({
            message: 'you have successfully updated your profile',
            record: updaterecord 
         })
        
    }catch(error){
           res.status(500).json({
            msg:'failed to update profile',
            route: '/update/:id'

           })
    }
  }

export async function getUsers(req:Request, res:Response, next:NextFunction){
    try{
      const id = req.params.id
      const record = await UserInstance.findOne({where:{id}})
      res.status(200).json({
        record
      })
    }catch(error){
      res.status(500).json({
        msg:'failed to get user',
        route: '/user/:id'

       })
    }
  }


export async function getUserRecords(
  req: Request|any,
  res: Response,
  next: NextFunction
) {
  try {
    const userId = req.user.id;
    const record = (await UserInstance.findOne({
      where: { id: userId },
      include: [{ model: AccountInstance, as: "accounts" }],
    })) as unknown as { [key: string]: string };

    res.status(200).json({
      record: record,
    });
  } catch (err) {
    res.status(500).json({
      msg: "failed to login",
      route: "/login",
    });
  }
}


