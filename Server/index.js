import express from "express";
import mongoose from "mongoose";
import Account from "./models/Account.js";
import Note from "./models/Note.js";
import cors from "cors";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const app = express();
const port = 8080;
app.use(cors());
app.use(express.json());
const uri =
  ""; // Mongodb url
mongoose
  .connect(uri)
  .then(() => {
    console.log("MongoDB connected successfully");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


// Register User
app.post("/register", async (req, res) => {
  try {
    const user = mongoose.model("account", Account);
    const { data } = req.body;
    const isalredy = await user.findOne({ email: data.Email });
    if (isalredy) {
      res.status(500).json({ message: "Account already exist" });
      return;
    }
    const hashedPassword = await bcrypt.hash(data.Password, 10);
    const newuser = new user({
      name: data.Name,
      email: data.Email,
      password: hashedPassword,
    });
    await newuser.save();
    const token = jwt.sign(data, "private_key_#$", { expiresIn: "168h" });
    res.status(201).json({ message: token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Login User
app.get("/login", async (req, res) => {
  try {
    const { formdata } = req.query;
    const parsedData = JSON.parse(formdata);
    const { Email, Password } = parsedData;
    const user = mongoose.model("account", Account);
    const account = await user.findOne({ email: Email });
    if (!account) {
      res.status(500).json({ message: "Invalid Email/Password" });
      return;
    }
    const match = await bcrypt.compare(Password, account.password);
    if (!match) {
      res.status(500).json({ message: "Invalid Email/Password" });
      return;
    }
    const token = jwt.sign(parsedData, "private_key_#$", { expiresIn: "168h" });
    res.status(201).json({ message: token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Verify user
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token is required" });
  }
  jwt.verify(token, "private_key_#$", (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
}

// Retrive note
app.get("/get_note", verifyToken, async (req, res) => {
  try {
    const { Email } = req.user;
    const note = mongoose.model("notes", Note);
    const newnote = await note.find({ email: Email });
    res.status(201).json(newnote);
  } catch (error) {
    res.status(401).json({ message: "Internal Server Error" });
  }
});


// Add note
app.post("/add_note", verifyToken, async (req, res) => {
  try {
    const { Email } = req.user;
    const { _data_ } = req.body;
    const note = mongoose.model("notes", Note);
    const newnote = new note({
      email: Email,
      note: _data_,
    });
    await newnote.save();
    res.status(201).json({ message: "Successfully added " });
  } catch (error) {
    res.status(401).json({ message: "Internal Server Error" });
  }
});

// delete note 
app.delete("/delete_note:id", async (req, res) => {
  try {
    const id = req.params.id;
    const note = mongoose.model("notes", Note);
    await note.findOneAndDelete({ _id: id });
  } catch (error) {
    res.status(401).json({ message: "Internal Server Error" });
  }
});

// delete user 
app.delete("/delete_account:email", async (req, res) => {
  try {
    const Email = req.params.email;
    const user = mongoose.model("account", Account);
    const note = mongoose.model("notes", Note);
    await note.deleteMany({ email: Email });
    await user.deleteOne({ email: Email });
  } catch (error) {
    res.status(401).json({ message: "Internal Server Error" });
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
