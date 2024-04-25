const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const UserModel = require("../db/user/user.model");

const userDB = [];

router.get("/", function (request, response) {
  response.send(userDB);
});

router.post("/", async function (request, response) {
  const body = request.body;

  const newUserResponse = await UserModel.createUser(body);

  response.send("Created new user!");
});

router.post("/login", async function (req, res) {
  const { username, password } = req.body;

  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    const user = await UserModel.findUserByUsername(username);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ username: user.username }, "MINGYI", {
      expiresIn: "1h",
    });

    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    // ************* 加的
    res.cookie("username", user.username, {
      httpOnly: false, // This allows JavaScript to access this cookie from client-side
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Use secure flag in production
    });
    // *****************
    return res.json({ username: user.username, token: token });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during the login process" });
  }
});

router.post("/register", async function (req, res) {
  const { username, password } = req.body;

  // Ensure both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  }

  try {
    // Check if user already exists
    const existingUser = await UserModel.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    // Create new user if username is not taken
    const newUser = await UserModel.createUser({
      username: username,
      password: password, // Consider hashing the password before storing
    });

    // Generate JWT token
    const token = jwt.sign({ username: newUser.username }, "MINGYI", {
      expiresIn: "1h",
    });

    // Set the JWT token as a httpOnly cookie
    res.cookie("token", token, { httpOnly: true, sameSite: "strict" });

    // ********** added
    res.cookie("username", newUser.username, {
      httpOnly: false, // This allows JavaScript to access this cookie from client-side
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production", // Use secure flag in production
    });
    // ************* added

    // Return the username and token as a JSON object
    return res.status(201).json({ username: newUser.username, token: token });
  } catch (error) {
    console.error("Register error:", error);
    return res
      .status(500)
      .json({ message: "An error occurred during the registration process" });
  }
});

router.get("/isLoggedIn", async function (req, res) {
  const username = req.cookies.username;

  if (!username) {
    return res.send({ username: null });
  }
  let decryptedUsername;
  try {
    decryptedUsername = jwt.verify(username, "HUNTERS_PASSWORD");
  } catch (e) {
    return res.send({ username: null });
  }

  if (!decryptedUsername) {
    return res.send({ username: null });
  } else {
    return res.send({ username: decryptedUsername });
  }
});

router.post("/logOut", async function (req, res) {
  res.cookie("username", "", {
    maxAge: 0,
  });

  res.send(true);
});

router.get("/:username", async function (req, res) {
  const username = req.params.username;

  const userData = await UserModel.findUserByUsername(username);

  return res.send(userData);
});

module.exports = router;
