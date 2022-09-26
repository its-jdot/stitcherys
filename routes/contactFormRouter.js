const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");

let smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  auth: {
    user: "efitnessclub7@gmail.com",
    pass: "efitness",
  },
});

router.post("/form", (req, res) => {
  let { name, email, subject, message } = req.body;
  var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ msg: "Please enter all fields." });
  }

  var valid = emailRegex.test(email);
  if (!valid) {
    return res.status(400).json({ msg: "Please enter correct email." });
  }

  smtpTransport.sendMail({
    from: email,
    to: "efitnessclub7@gmail.com",
    subject: subject,
    html: `
        <h3>User Information</h3>
        <ul>
            <li>${name}</li>
            <li>${email}</li>
        </ul>
        <h3>Message</h3>
        <ul>
            <p>${message}</p>
        </ul>`,
  });
});

module.exports = router;
