const Mailgen = require("mailgen");
const nodeMailer = require("nodemailer");

const sendEmailForResetPassword = async (req, res, user, otp) => {
  let config = {
    service: "gmail",
    auth: {
      user: `${process.env.email}`,
      pass: `${process.env.password}`,
    },
  };

  let transporter = nodeMailer.createTransport(config);

  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "",
      link: "",
    },
  });

  let response = {
    body: {
      intro: "Please, Verify Your Email",
      table: {
        data: [
          {
            description: "Please Verify your email with the given otp",
            OTP: otp,
          },
        ],
      },
      outro: "You can not change your password without the given otp",
    },
  };

  let mail = mailGenerator.generate(response);

  let message = {
    from: `${process.env.email}`,
    to: user.email,
    subject: "Reset Your Password",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      res.json({
        result: true,
        message: "send otp successfully",
        data: sendOTP,
      });
    })
    .catch((error) => {
      return res.status(501).json({ error });
    });
};

const sendEmailForRegistration = async (req, res, user) => {
  console.log(req.body);
  let config = {
    service: "gmail",
    auth: {
      user: `nusratnuhin253@gmail.com`,
      pass: `cjjqjpzoxpygwrad`,
    },
  };

  let transporter = nodeMailer.createTransport(config);

  let mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "Dust Master",
      link: "https://mailgen.js/",
    },
  });

  let response = {
    body: {
      intro: "Please, Verify Your Email",
      table: {
        data: [
          {
            email: user.email,
            password: user.password,
          },
        ],
      },
      outro: "You can not login without the given information",
    },
  };

  let mail = mailGenerator.generate(response);

  let message = {
    from: `nusratnuhin253@gmail.com`,
    to: user.email,
    subject: "Please Verify your email for login",
    html: mail,
  };

  transporter
    .sendMail(message)
    .then(() => {
      return res.status(201).json({
        result: true,
        msg: "You should receive your email",
      });
    })
    .catch((error) => {
      return res.status(501).json({ error });
    });
};

module.exports = {
  sendEmailForResetPassword,
  sendEmailForRegistration,
};
