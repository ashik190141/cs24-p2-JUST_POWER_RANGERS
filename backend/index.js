let cookieParser = require('cookie-parser')
const express = require("express");
const app = express();
const cors = require("cors");
const Mailgen = require("mailgen");
const nodeMailer = require("nodemailer");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const port = process.env.PORT || 5000;

app.use(cors(
  {
    origin: "http://localhost:5173",
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());

const distance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
    Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return d;
};

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
//This is for Ashik
// const uri =
//   `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nhg2oh1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

//This is for Shojib
const uri =
  `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.oglq0ui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    const resetPasswordOTPCollection = client.db("DNCC").collection("reset");
    const vehiclesCollection = client.db("DNCC").collection("vehicles");
    const stsCollection = client.db("DNCC").collection("sts");
    const stsLeavingCollection = client.db("DNCC").collection("stsLeaving");
    const landfillCollection = client.db("DNCC").collection("landfill");
    const truckDumpingCollection = client.db("DNCC").collection("truckDumping");


    // ===============================Verify Token ===================================
    const verifyToken = async (req, res, next) => {
      let token = req?.cookies?.token;
      console.log("Value of token in middleware: ", token);
      if (!token) {
        return res.status(401).send({ message: "Not Authorized" });
      }
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return res.status(401).send({ message: "UnAuthorized" });
        }
        console.log("value in the token", decoded);
        req.decoded = decoded;
        next();
      });
    };

    // ===============================Verify Admin👇===================================
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded?.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "Admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // ===============================Check Admin👇===================================
    app.get('/users/admin/:email', verifyToken, async (req, res) => {
      let userEmail = req.params.email;
      if (userEmail !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidded access' })
      }
      let query = { email: userEmail };
      let user = await usersCollection.findOne(query);
      let admin = false;
      if (user) {
        admin = user?.role == 'Admin'
      }
      res.send({ admin });
    });


    // ===============================Check Sts Manager===================================
    app.get('/users/stsmanager/:email', verifyToken, async (req, res) => {
      let userEmail = req.params.email;
      if (userEmail !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidded access' })
      }
      let query = { email: userEmail };
      let user = await usersCollection.findOne(query);
      let stsManager = false;
      if (user) {
        stsManager = user?.role == 'StsManager'
      }
      res.send({ stsManager });
    });

    // ===============================Check Land Manager===================================
    app.get('/users/landmanager/:email', verifyToken, async (req, res) => {
      let userEmail = req.params.email;
      if (userEmail !== req.decoded.email) {
        return res.status(403).send({ message: 'forbidded access' })
      }
      let query = { email: userEmail };
      let user = await usersCollection.findOne(query);
      let LandManager = false;
      if (user) {
        LandManager = user?.role == 'LandManager'
      }
      res.send({ LandManager });
    });

    // ===============================Create New User 👇===================================
    // app.post("/auth/create", verifyToken, verifyAdmin, async (req, res) => {
    //   const user = req.body;
    //   const userEmail = { email: user.email };
    //   const findUser = await usersCollection.findOne(userEmail);
    //   if (findUser) {
    //     return res.json({ msg: `${user.email} is already registered` });
    //   } else {
    //     const userPassword = user.password;
    //     const salt = await bcrypt.genSalt(10);
    //     const hashedPassword = await bcrypt.hash(userPassword, salt);
    //     user.password = hashedPassword;
    //     user.role = "unassigned";

    //     const result = await usersCollection.insertOne(user);
    //     res.send(result);
    //   }
    // });

    // verifyToken, verifyAdmin,
    app.post("/auth/create", verifyToken, verifyAdmin, async (req, res) => {
      const user = req.body;
      const plainPassword = user.password;
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
        if (result.insertedId) {
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
                    password: plainPassword,
                  },
                ],
              },
              outro: "You can not login without the given information",
            },
          };

          let mail = mailGenerator.generate(response);

          let message = {
            from: `${process.env.email}`,
            to: user.email,
            subject: "Check Email For Login",
            html: mail,
          };

          transporter
            .sendMail(message)
            .then(() => {
              return res.json({
                result: true,
                message: "check your email",
              });
            })
            .catch((error) => {
              return res.status(501).json({ error });
            });
        }
      }
    });


    // ===============================Login User👇===================================
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

    // ===============================Logout User👇====================================
    app.get("/auth/logout", (req, res) => {
      res.clearCookie("token");
      res.json({
        success: true,
        message: "Logout successful",
      });
    });

    // ===============================Reset Password Initiate👇===================================
    // app.post("/auth/reset-password/initiate", async (req, res) => {
    //   const user = req.body;
    //   const otp = Math.floor(100000 + Math.random() * 900000);

    //   const query = { email: user.email };
    //   const findUser = await usersCollection.findOne(query);

    //   if (findUser) {
    //     const res = sendEmailForResetPassword(user, otp);
    //     if (res.result) {
    //       const resetInfo = {
    //         email: user.email,
    //         otp: otp,
    //       };
    //       const sendOTP = await resetPasswordOTPCollection.insertOne(resetInfo);
    //       res.json({
    //         result: true,
    //         message: "send otp successfully",
    //         data: sendOTP,
    //       });
    //     }
    //   } else {
    //     res.json({
    //       result: false,
    //       message: `${user.email} does not exist`
    //     })
    //   }
    // });
    app.post("/auth/reset-password/initiate", async (req, res) => {
      const user = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000);

      const query = { email: user.email };
      const findUser = await usersCollection.findOne(query);

      if (findUser) {
        const res = sendEmailForResetPassword(user, otp);
        if (res.result) {
          const resetInfo = {
            email: user.email,
            otp: otp,
          };
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
                    OTP: resetInfo.otp,
                  },
                ],
              },
              outro: "You can not change your password without the given otp",
            },
          };

          let mail = mailGenerator.generate(response);

          let message = {
            from: `${process.env.email}`,
            to: resetInfo.email,
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
        }
      } else {
        res.json({
          result: false,
          message: `${user.email} does not exist`,
        });
      }
    });

    // ===============================Reset Password Confirm👇===================================
    app.put("/auth/reset-password/confirm", async (req, res) => {
      const userInfo = req.body;
      const query = { email: userInfo.email };
      const findUser = await usersCollection.findOne(query);

      if (findUser) {
        const userPassword = userInfo.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        userInfo.password = hashedPassword;
        const updatedPassword = {
          $set: {
            password: userInfo.password,
          },
        };
        const result = await usersCollection.updateOne(query, updatedPassword);
        if (result.modifiedCount > 0) {
          const deleteResetInfo = await resetPasswordOTPCollection.deleteOne(
            query
          );
          if (deleteResetInfo.deletedCount > 0) {
            res.json({ message: "Successfully updated your password" });
          } else {
            res.json({ message: "Password don't update" });
          }
        } else {
          res.json({ message: "Password don't update" });
        }
      } else {
        return res.json({ message: `${information.email} Do Not Valid Email` });
      }
    });

    app.put("/auth/change-password", async (req, res) => {
      const information = req.body;
      const query = { email: information.email };
      const findUser = await usersCollection.findOne(query);

      if (findUser) {
        const isMatch = await bcrypt.compare(
          information.currentPassword,
          findUser.password
        );
        if (isMatch) {
          const userPassword = information.newPassword;
          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(userPassword, salt);
          information.newPassword = hashedPassword;

          const options = { upsert: true };
          const updatedPassword = {
            $set: {
              password: information.newPassword,
            },
          };
          const result = await usersCollection.updateOne(
            query,
            updatedPassword,
            options
          );
          if (result.modifiedCount > 0) {
            res.json({ message: "Successfully updated your password" });
          } else {
            res.json({ message: "Password don't update" });
          }
        } else {
          res.json({ message: "Current Password is not Matched" });
        }
      } else {
        return res.json({ message: `${information.email} Do Not Valid Email` });
      }
    });

    // User Management Endpoints
    // admin access
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // admin access
    app.get("/users/:userId", async (req, res) => {
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // admin access
    app.delete("/users/:userId", async (req, res) => {
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    //admin access
    app.put("/users/:userId/roles", async (req, res) => {
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      const updatedRoleInfo = req.body;
      const updatedDoc = {
        $set: {
          role: updatedRoleInfo.role,
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc);
      if (result.modifiedCount > 0) {
        res.json({
          result: true,
          message: "Update User Role Successfully",
        });
      }
    });

    // admin access
    app.post("/create-vehicles", async (req, res) => {
      const vehicles = req.body;
      const result = await vehiclesCollection.insertOne(vehicles);
      if (result.insertedId) {
        res.json({
          result: true,
          message: "Vehicles Added Successfully"
        })
      }
    });

    //admin access
    app.post("/create-landfill", async (req, res) => {
      const landfillInfo = req.body;
      landfillInfo.manager = [];
      const result = await landfillCollection.insertOne(landfillInfo);
      if (result.insertedId) {
        res.json({
          result: true,
          message: "Landfill Created Successfully",
        });
      }
    });

    // admin access
    app.post("/create-sts", async (req, res) => {
      const stsInfo = req.body;
      stsInfo.manager = false;
      const result = await stsCollection.insertOne(stsInfo);
      if (result.insertedId) {
        res.json({
          result: true,
          message: "STS Added Successfully",
        });
      }
    });

    //sts manager
    app.post("/create-entry-vehicles-leaving", async (req, res) => {
      const stsVehicleLeavingInfo = req.body;
      const result = await stsLeavingCollection.insertOne(
        stsVehicleLeavingInfo
      );
      if (result.insertedId) {
        res.json({
          result: true,
          message: "Vehicles Leaving From STS Added Successfully",
        });
      } else {
        res.json({
          result: false,
          message: "Data Enrty Error",
        });
      }
    });

    //Get all The Sts
    app.get('/get-all-sts', async (req, res) => {
      const result = await stsCollection.find().toArray();
      res.send(result);
    })
    //Get all Vehicle
    app.get('/get-all-vehicle', async (req, res) => {
      const result = await vehiclesCollection.find().toArray();
      res.send(result);
    })


    //landfill manager For billing
    app.post("/create-truck-dumping", async (req, res) => {
      const truckDumpingInfo = req.body;

      const allTrackDumpingInfo = await truckDumpingCollection.find().toArray();
      const checkingDate = allTrackDumpingInfo.filter(truck => truck.vehicleNum == truckDumpingInfo.vehicleNum && truck.date == currentDate);

      if (checkingDate.length < 3) {

        const vehicleQuery = { vehicleRegNum: truckDumpingInfo.vehicleNum };
        const truckInfo = await vehiclesCollection.findOne(vehicleQuery);

        const stsQuery = { name: truckDumpingInfo.stsName };
        const stsInfo = await stsCollection.findOne(stsQuery);

        const landfillQuery = { landfillSite: truckDumpingInfo.landfillName };
        const landfillInfo = await landfillCollection.findOne(landfillQuery);

        const distanceFromStsToLandfill = distance(stsInfo.lat, stsInfo.lon, landfillInfo.lat, landfillInfo.lon);
        let cost = 0;

        if (truckDumpingInfo.volumeWaste < truckInfo.capacity) {
          cost =
            truckInfo.fualCostUnloaded +
            (truckDumpingInfo.volumeWaste / truckInfo.capacity) *
            (truckInfo.fualCostLoaded - truckInfo.fualCostUnloaded);
        } else {
          cost = truckInfo.fualCostLoaded;
        }

        let today = new Date();
        let dd = today.getDate();
        let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        let currentDate = `${dd}/${mm}/${yyyy}`;

        const bill = distanceFromStsToLandfill * cost;
        truckDumpingInfo.date = currentDate;
        truckDumpingInfo.bill = bill;
        const result = await truckDumpingCollection.insertOne(truckDumpingInfo);
        if (result.insertedId) {
          res.json({
            result: true,
            message: "Dumping Truck Information Added Successfully",
            bill: bill,
            distance: distanceFromStsToLandfill,
          });
        }
      } else {
        res.json({
          result: false,
          message:
            "A vehicle goes to the landfill from STS at most three times every day.",
        });
      }
    });
    //profile management endpoints
    app.get("/profile", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    //update login user info
    app.put("/profile", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const updatedUserInfo = req.body;
      const updatedDoc = {
        $set: {
          name: updatedUserInfo.name,
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc);
      if (result.modifiedCount > 0) {
        res.json({
          result: true,
          message: "Update User Role Successfully",
        });
      }
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
  console.log("DNCC Server Running at", port);
});
