const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const nodeMailer = require("nodemailer");
const bcrypt = require("bcrypt");
const Mailgen = require("mailgen");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhg2oh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();
    // Send a ping to confirm a successful connection
      
      const usersCollection = client.db("DNCC").collection("user");

        const verifyAdmin = async (req, res, next) => {
          const email = req.decoded.email;
          const query = { email: email };
          const user = await usersCollection.findOne(query);
          const isAdmin = user?.role === "admin";
          if (!isAdmin) {
            return res.status(403).send({ message: "forbidden access" });
          }
          next();
        };
      
      const verifyToken = async (req, res, next) => {
        let token = req?.cookies?.token;
        console.log("Value of token in middleware: ", token);
        if (!token) {
          return res.status(401).send({ message: "Not Authorized" });
        }
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
          if (err) {
            console.log(err);
            return res.status(401).send({ message: "UnAuthorized" });
          }
          console.log("value in the token", decoded);
          req.user = decoded;
          next();
        });
      };

      app.post("/auth/create", verifyToken, verifyAdmin ,async (req, res) => {
        const user = req.body;

        const userEmail = { email: user.email };
        const findUser = await usersCollection.findOne(userEmail);
        if (findUser) {
          return res.json({ msg: `${user.email} is already registered` });
        } else {
          const userPassword = user.password;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userPassword, salt);
          user.password = hashedPassword;
          user.role = "unassigned";

          const result = await usersCollection.insertOne(user);
          res.send(result);
        }
      });

      app.post("/auth/login", async (req, res) => {
        const { email, password } = req.body;

        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, {
          expiresIn: process.env.EXPIRES_IN,
        });

        res
          .cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
          })
          .json({
            success: true,
            message: "Login successful",
            token,
          });
      });
    

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get("/", (req, res) => {
  res.send("DNCC Server Running");
});

app.listen(port, () => {
  console.log("port no", port);
});
