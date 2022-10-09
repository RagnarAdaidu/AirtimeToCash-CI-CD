import nodemailer from 'nodemailer';
import 'dotenv/config';

export async function sendMail(html:string, mail:string,subject:string,username:string) {
    const password = process.env.EMAIL_PASS as string
    const email = process.env.USER_EMAIL as string
    try {
        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: email,
                pass: password
            },
        });
       
        let mailOptions = {
            from: email,
            username:username,
            to: mail,
            subject: subject,
            html: html,
            
        };

        return new Promise ( (resolve, reject) => {
            transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve(info)
            }
        })
    })
    } catch (err) {
       return err
        }
      }
