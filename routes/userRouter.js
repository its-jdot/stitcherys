const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const { User } = require("../models/userModel");
const admin = require("../middleware/admin");

const crypto = require("crypto");
const nodemailer = require("nodemailer");

let smtpTransport = nodemailer.createTransport({
  service: "Gmail",
  port: 465,
  auth: {
    user: "efitnessclub7@gmail.com",
    pass: "efitness",
  },
});

router.post("/register", async (req, res) => {
  try {
    let {
      name,
      email,
      userName,
      password,
      passwordCheck,
      gender,
      phoneNumber,
      role,
      address,
    } = req.body;
    var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

    // validate

    if (
      !name ||
      !email ||
      !userName ||
      !password ||
      !passwordCheck ||
      !gender ||
      !phoneNumber ||
      !address
    )
      return res.status(400).json({ msg: "Not all fields have been entered" });

    var valid = emailRegex.test(email);
    if (!valid) res.status(400).json({ msg: "Please enter correct email" });

    const existingUser = await User.findOne({ email: email });
    if (existingUser)
      return res
        .status(400)
        .json({ msg: "An account with this email already exists" });

    if (userName.length > 10)
      return res.status(400).json({
        msg: "The username needs to be less than or equal to 10 character",
      });

    const existingUserName = await User.findOne({ userName: userName });
    if (existingUserName)
      return res
        .status(400)
        .json({ msg: "An Account with this username already exists" });

    if (password.length < 5)
      return res
        .status(400)
        .json({ msg: "The password needs to be at least 5 characters long" });

    if (password !== passwordCheck)
      return res
        .status(400)
        .json({ msg: "Enter the same password twice for verification" });

    if (gender !== "Male" && gender !== "Female")
      return res.status(400).json({ msg: "Please select correct gender" });

    if (phoneNumber.length !== 11)
      return res
        .status(400)
        .json({ msg: "The phone number needs to be 11 digits long" });

    const existingPhoneNumber = await User.findOne({
      phoneNumber: phoneNumber,
    });
    if (existingPhoneNumber)
      return res
        .status(400)
        .json({ msg: "An account with this phone number already exists" });
    let duplicatePassword = password;
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      userName,
      password: passwordHash,
      gender,
      phoneNumber,
      role,
      address,
    });

    if (newUser.role === "user") {
      const saveUser = newUser.save().then((user) => {
        smtpTransport.sendMail({
          to: user.email,
          from: "efitnessclub7@gmail.com",
          subject: "Account Signup Success",
          html: `WELCOME TO E-FTINESS CLUB`,
        });
      });
      res.json(saveUser);
    } else {
      const saveEmployee = newUser.save().then((user) => {
        smtpTransport.sendMail({
          to: user.email,
          from: "efitnessclub7@gmail.com",
          subject: "Account Credentials",
          html: `Welcome ${user.name} your role in our website is ${user.role} 
          Your User Name is ${user.userName} and your password is ${duplicatePassword}`,
        });
        res.json(saveEmployee);
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/editUser", auth, async (req, res) => {
  try {
    const { name, address, email, phoneNumber, userName } = req.body;
    if (!name || !address || !email || !phoneNumber || !userName)
      return res.status(400).json({ msg: "Not all fields have been entered" });
    const user = await User.findById(req.user);
    user.name = req.body.name;
    user.address = req.body.address;
    user.email = req.body.email;
    user.phoneNumber = req.body.phoneNumber;
    user.userName = req.body.userName;
    await user.save((err) => {
      if (err) return res.status(400).json({ success: false, err });
      return res.status(200).json({ success: true });
    });
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  //validate
  try {
    if (!email || !password)
      return res.status(400).json({ msg: "Not all fields have been entered" });

    var valid = emailRegex.test(email);
    if (!valid) res.status(400).json({ msg: "Please enter correct email" });

    const user = await User.findOne({ email: email });
    if (!user)
      return res
        .status(400)
        .json({ msg: "No account with this email has been registered" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.jwt_Secret);
    res.json({
      token,
      user: {
        id: user._id,
        userName: user.userName,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Reset Password
router.post("/reset", async (req, res) => {
  let { email } = req.body;
  var emailRegex = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

  if (!email) {
    return res.status(400).json({ msg: "Please enter your email" });
  }

  var valid = emailRegex.test(email);
  if (!valid) {
    return res.status(400).json({ msg: "Please enter correct email" });
  }

  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString("hex");
    User.findOne({ email: email }).then((user) => {
      if (!user) {
        return res
          .status(400)
          .json({ msg: "User do not exist with this email" });
      }
      user.resetToken = token;
      user.expireToken = Date.now() + 3600000;
      user.save().then((result) => {
        smtpTransport.sendMail({
          to: user.email,
          from: "efitnessclub7@gmail.com",
          subject: "Password Reset",
          html: `<p>You requested for reset password</p>
          <h5>Click on the <a href="http://localhost:3000/new/password/${token}">Link</a> to Reset Your Password</h5>
          `,
        });
        res.json({ msg: "Check your email" });
      });
    });
  });
});

//New Password
router.post("/new/password", async (req, res) => {
  const { password, token } = req.body;
  if (!password) {
    res.status(400).json({ msg: "Please enter your new password" });
  }
  await User.findOne({
    resetToken: token,
    expireToken: { $gt: Date.now() },
  })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ msg: "Try again session expired" });
      }
      bcrypt.hash(password, 12).then((hashpassword) => {
        user.password = hashpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveUser) => {
          res.json({ msg: "Your password is updated" });
        });
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

router.delete("/delete", auth, async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.user);
    res.json(deletedUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/tokenisvalid", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.json(false);

    const verified = jwt.verify(token, process.env.jwt_Secret);
    if (!verified) return res.json(false);

    const user = await User.findById(verified.id);
    if (!user) return res.json(false);

    return res.json(true);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.json({
    userName: user.userName,
    id: user.id,
  });
});

router.get("/get", auth, async (req, res) => {
  await User.find((err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//get logged in user
router.get("/getUser", auth, async (req, res) => {
  await User.findById(req.user, (err, doc) => {
    if (err) res.status(400).send(err);
    res.status(200).send(doc);
  });
});

//get all employees
router.get("/get/employee", auth, admin, async (req, res) => {
  let employee = [];
  const users = await User.find((err) => {
    if (err) res.status(400).send(err);
  });
  users.map((user) => {
    if (user.role != "admin" && user.role != "user") {
      employee.push(user);
    }
  });
  res.status(200).send(employee);
});
//get count of different types of users
router.get("/get/countOfUser", auth, admin, async (req, res) => {
  let count = {
    trainerCount: 0,
    nutritionistCount: 0,
    userCount: 0,
    physiatristCount: 0,
  };
  const users = await User.find((err) => {
    if (err) res.status(400).send(err);
  });
  users.map((user) => {
    if (user.role === "user") {
      count.userCount++;
    }
    if (user.role === "trainer") {
      count.trainerCount++;
    }
    if (user.role === "nutritionist") {
      count.nutritionistCount++;
    }
    if (user.role === "physiatrist") {
      count.physiatristCount++;
    }
  });
  res.status(200).send(count);
});
//delete an employee
router.delete("/delete/employee/:id", auth, admin, async (req, res) => {
  await User.findByIdAndDelete({ _id: req.params.id });
});

//add to Cart
router.post("/addToCart/:myQuantity", auth, async (req, res) => {
  const myQuantity = Number(req.params.myQuantity);
  User.findOne({ _id: req.user }, (err, userInfo) => {
    let duplicate = false;
    let flag = 0;
    userInfo.cart.map((cartInfo) => {
      if (cartInfo.id === req.body._id) {
        duplicate = true;
      }
    });
    userInfo.cart.map((cartInfo) => {
      if (cartInfo.id === req.body._id) {
        if (cartInfo.quantity + myQuantity > req.body.quantity) {
          flag = 1;
          res.status(200).json(cartInfo.quantity);
        }
      }
    });
    if (duplicate && flag === 0) {
      User.findOneAndUpdate(
        { _id: req.user, "cart.id": req.body._id },
        { $inc: { "cart.$.quantity": myQuantity } },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart.quantity);
        }
      );
    } else if (flag === 0) {
      User.findByIdAndUpdate(
        { _id: req.user },
        {
          $push: {
            cart: {
              id: req.body._id,
              quantity: myQuantity,
              name: req.body.name,
              imageURL: req.body.imageURL,
              brand: req.body.brand,
              price: req.body.price,
              deliveryCharges: req.body.deliveryCharges,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart.quantity);
        }
      );
    }
  });
});
//get cart
router.get("/getCart", auth, async (req, res) => {
  const user = await User.findById(req.user);
  res.send(user.cart);
});

//remove from cart
router.delete("/removeFromCart/:id", auth, async (req, res) => {
  // User.findOneAndUpdate(
  //   {_id:req.user},
  //   {"$pull":
  //           {"cart":{"id":req.params.id} }
  //   },
  //   {new:true}
  // )

  const user = await User.findByIdAndUpdate(req.user);

  const arr = user.cart.filter((cart) => {
    return cart.id !== req.params.id;
  });
  user.cart = arr;
  await user.save();
});

module.exports = router;
