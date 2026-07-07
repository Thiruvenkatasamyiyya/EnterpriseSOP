import nodemailer from "nodemailer";


const sendEmail = async (options) => {

   // Looking to send emails in production? Check out our Email API/SMTP product!
    var transport = nodemailer.createTransport({
        host:process.env.SMTP_HOST,
        port:process.env.SMTP_PORT,
        secure : false,
        auth: {
        user:process.env.SMPT_EMAIL_GMAIL,
        pass:process.env.SMTP_EMAIL_PASSWORD
        }
        
    });
    console.log(process.env.SMTP_EMAIL_GMAIL);
    console.log(process.env.SMTP_EMAIL_PASSWORD);

    const message = {
        from:`${process.env.SMTP_FROM_NAME} <${process.env.SMTP_FROM_EMAIL}>`,
        to:options.email,
        subject:options.subject,
        html:options.message
    }

    await transport.sendMail(message);


}

export default sendEmail;

