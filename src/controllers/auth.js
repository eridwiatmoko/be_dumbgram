// import model
const { user } = require("../../models");

// import joi validation
const joi = require("joi");

// import bcrypt
const bcrypt = require("bcrypt");

// import jwt
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  // our validation schema here
  const schema = joi.object({
    email: joi.string().email().min(6).required(),
    username: joi.string().min(5).required(),
    password: joi.string().min(6).required(),
    fullName: joi.string().required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const emailExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    const usernameExist = await user.findOne({
      where: {
        username: req.body.username,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    if (emailExist && usernameExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email already registered and username already taken",
      });
    }

    if (emailExist) {
      return res.status(400).send({
        status: "failed",
        message: "Email already registered",
      });
    }

    if (usernameExist) {
      return res.status(400).send({
        status: "failed",
        message: "Username already taken",
      });
    }
    // generate salt (random value) with 10 rounds
    const salt = await bcrypt.genSalt(10);

    // hash password from request with salt
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    const newUser = await user.create({
      email: req.body.email,
      username: req.body.username,
      password: hashedPassword,
      fullName: req.body.fullName,
    });

    const dataToken = {
      fullName: newUser.fullName,
      username: newUser.username,
    };

    // generate token
    const token = jwt.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success...",
      data: {
        fullName: newUser.fullName,
        username: newUser.username,
        token,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};

exports.login = async (req, res) => {
  // our validation schema here
  const schema = joi.object({
    email: joi.string().email().min(6).required(),
    password: joi.string().min(6).required(),
  });

  // do validation and get error object from schema.validate
  const { error } = schema.validate(req.body);

  // if error exist send validation error message
  if (error)
    return res.status(400).send({
      error: {
        message: error.details[0].message,
      },
    });

  try {
    const userExist = await user.findOne({
      where: {
        email: req.body.email,
      },
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });

    // compare password between entered from client and from database
    const isValid = await bcrypt.compare(req.body.password, userExist.password);

    // check if not valid then return response with status 400 (bad request)
    if (!isValid) {
      return res.status(400).send({
        status: "failed",
        message: "Email and password do not match",
      });
    }

    const dataToken = {
      fullName: userExist.fullName,
      username: userExist.username,
      email: userExist.email,
    };

    const token = jwt.sign(dataToken, process.env.TOKEN_KEY);

    res.status(200).send({
      status: "success",
      data: {
        user: {
          fullName: userExist.fullName,
          username: userExist.username,
          email: userExist.email,
          token,
        },
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: "failed",
      message: "Server Error",
    });
  }
};
