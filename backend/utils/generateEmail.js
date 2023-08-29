import nodemailer from "nodemailer";

const generateEmail = (email, token, user) => {
  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: `${process.env.NODEMAILER_GMAIL_ID}`,
      pass: `${process.env.NODEMAILER_GMAIL_PW}`,
    },
  });

  var mailOptions = {
    from: `${process.env.NODEMAILER_GMAIL_ID}`,
    to: `${email}`,
    subject: "[GENFA] Olvidé mi contraseña:",
    text: `Parece que sos medio boludito y te olvidaste la contraseña, metete acá para poder resetearla: https://genfa.vercel.app/reset-password/${user._id}/${token}`,
  };

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
    } else {
      return res.status({ Status: "Success" });
    }
  });
};

export default generateEmail;