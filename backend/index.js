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
    origin: [
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:3001',
    ],
    credentials: true,
  }
));
app.use(express.json());
app.use(cookieParser());

// ========================Calculate Distance by Function👇================>
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

// =========================Calculate Nearest Time👇=======================>
function findNearestTime(data) {
  const current = new Date();
  let currentHours = current.getHours();
  let currentMinutes = current.getMinutes();

  if (currentHours < 10) {
    currentHours = "0" + currentHours;
  }

  if (currentMinutes < 10) {
    currentMinutes = "0" + currentMinutes;
  }

  const currentTime = parseInt(currentHours) * 60 + parseInt(currentMinutes);

  let nearestTime = Infinity;
  let nearestIndex = -1;

  data.forEach((item, index) => {
    const [arrivalHours, arrivalMinutes] = item.arrival.split(":");
    const arrivalTime = parseInt(arrivalHours) * 60 + parseInt(arrivalMinutes);

    const [departureHours, departureMinutes] = item.departure.split(":");
    const departureTime =
      parseInt(departureHours) * 60 + parseInt(departureMinutes);

    const timeDifferenceArrival = Math.abs(arrivalTime - currentTime);
    const timeDifferenceDeparture = Math.abs(departureTime - currentTime);

    const minTimeDifference = Math.min(
      timeDifferenceArrival,
      timeDifferenceDeparture
    );

    if (minTimeDifference < nearestTime) {
      nearestTime = minTimeDifference;
      nearestIndex = index;
    }
  });

  return data[nearestIndex];
}

// =====================Calculate Date Method👇======================>
let today = new Date();
let dd = today.getDate();
let mm = today.getMonth() + 1;
let yyyy = today.getFullYear();
let currentDate = `${dd}/${mm}/${yyyy}`;

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

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

    const usersCollection = client.db("DNCC").collection("user");
    const resetPasswordOTPCollection = client.db("DNCC").collection("reset");
    const vehiclesCollection = client.db("DNCC").collection("vehicles");
    const stsCollection = client.db("DNCC").collection("sts");
    const stsLeavingCollection = client.db("DNCC").collection("stsLeaving");
    const landfillCollection = client.db("DNCC").collection("landfill");
    const truckDumpingCollection = client.db("DNCC").collection("truckDumping");
    const rolesCollection = client.db("DNCC").collection("roles");


    // ===================== Verify Token👇 ==========================>
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

    // ===================== Verify Admin👇===========================>
    const verifyAdmin = async (req, res, next) => {
      const email = req.decoded?.email;
      const query = { email: email };
      const user = await usersCollection.findOne(query);
      const isAdmin = user?.role === "System Admin";
      if (!isAdmin) {
        return res.status(403).send({ message: "forbidden access" });
      }
      next();
    };

    // =====================Create New User 👇=======================>
    app.post("/users", verifyToken, verifyAdmin, async (req, res) => {
      const user = req.body;
      console.log(user);
      const roleQuery = { roleName: user.role };

      const plainPassword = user.password;
      const userEmail = { email: user.email };
      const findUser = await usersCollection.findOne(userEmail);
      if (findUser) {
        return res.json({
          result: false,
          message: `${user.email} is already registered`
        });
      } else {
        const userPassword = user.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        user.password = hashedPassword;
        user.assigned = false;

        const updatedRoleAllocation = {
          $inc: {
            allocate: -1,
          },
        };
        if (user.role === 'System Admin' || user.role === 'unassigned') {
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
                  message: "User Created Successfully",
                });
              })
              .catch((error) => {
                return res.status(501).json({ error });
              });
          }

        } else {
          const roleUpdate = await rolesCollection.updateOne(roleQuery, updatedRoleAllocation);
          if (roleUpdate.modifiedCount > 0) {
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
                    message: "User Created Successfully",
                  });
                })
                .catch((error) => {
                  return res.status(501).json({ error });
                });
            }
          }
        }
      }
    });

    // ======================Login User👇============================>
    app.post("/auth/login", async (req, res) => {
      try {
        const { email, password } = req.body;
        const user = await usersCollection.findOne({ email });
        if (!user) {
          return res.json({
            result: false,
            message: "Invalid email or password"
          });
        }
        if (user.role == 'unassigned') {
          return res.json({
            result: false,
            message: "You are unassigned now!"
          })
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return res.json({
            result: false,
            message: "Invalid password"
          });
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
      } catch (error) {
        res.json({
          success: false,
          message: error.message,
        })

      }
    });


    // ======================Logout User👇============================>
    app.get("/auth/logout", (req, res) => {
      res.clearCookie("token");
      res.json({
        success: true,
        message: "Logout successful",
      });
    });

    // =====================Reset Password Initiate👇==================>
    app.post("/auth/reset-password/initiate", async (req, res) => {
      const user = req.body;
      const otp = Math.floor(100000 + Math.random() * 900000);

      const query = { email: user.email };
      const findUser = await usersCollection.findOne(query);

      if (findUser) {
        const resetInfo = {
          email: user.email,
          otp: otp,
        };
        await resetPasswordOTPCollection.insertOne(resetInfo);
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
              data: otp,
            });
          })
          .catch((error) => {
            return res.status(501).json({ error });
          });
      } else {
        res.json({
          result: false,
          message: `${user.email} does not exist`,
        });
      }
    });


    // =====================Reset Password Confirm👇===================>
    app.put("/auth/reset-password/confirm", async (req, res) => {
      const userInfo = req.body;
      const query = { email: userInfo.email };
      const findUser = await resetPasswordOTPCollection.findOne(query);

      if (findUser) {
        if (userInfo.otp == findUser.otp) {
          const deleteResetInfo = await resetPasswordOTPCollection.deleteOne(
            query
          );
          if (deleteResetInfo.deletedCount > 0) {
            res.json({
              result: true,
              message: "OTP matched"
            })
          }
        } else {
          res.json({
            result: false,
            message: "OTP not matched",
          });
        }
      } else {
        return res.json({ message: `${userInfo.email} Do Not Valid Email` });
      }
    });

    // ======================= Reset Password 👇=====================>
    app.put("/auth/reset-password", async (req, res) => {
      const userInfo = req.body;
      const query = { email: userInfo.email };
      const findUser = await usersCollection.findOne(query);

      if (findUser) {
        const userPassword = userInfo.newPassword;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        userInfo.newPassword = hashedPassword;
        const updatedPassword = {
          $set: {
            password: userInfo.newPassword,
          },
        };
        const result = await usersCollection.updateOne(query, updatedPassword);
        if (result.modifiedCount > 0) {
          res.json({
            result: true,
            message: "Successfully Reset your password"
          });
        } else {
          res.json({
            result: false,
            message: "Password don't update"
          });
        }
      } else {
        return res.json({
          result: false,
          message: `${information.email} Do Not Valid Email`
        })
      }
    })

    // =====================Change PassWord👇==========================>
    app.put("/auth/change-password", verifyToken, async (req, res) => {
      const information = req.body;
      const query = { email: information.email };
      const findUser = await usersCollection.findOne(query);

      if (findUser) {
        const isMatch = await bcrypt.compare(
          information.oldPassword,
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
          const result = await usersCollection.updateOne(query, updatedPassword, options);
          if (result.modifiedCount > 0) {
            res.json({
              result: true,
              message: "Successfully updated your password"
            });
          } else {
            res.json({
              result: false,
              message: "Password don't update"
            });
          }
        } else {
          res.json({ message: "Current Password is not Matched" });
        }
      } else {
        return res.json({ message: `${information.email} Do Not Valid Email` });
      }
    });


    // =====================Get All User👇=============================>
    // User Management Endpoints
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });

    // ===========Get Single User And All Available Roles👇============>
    // admin access
    app.get("/users/:userId", async (req, res) => {
      try {
        const userId = req.params.userId;
        //All Available Users
        if (userId === "roles") {
          const allRoles = await rolesCollection.find().toArray();
          const availableRoles = allRoles.filter(role => role.allocate > 0)
          res.send(availableRoles);
        } else {
          // Get Single User
          const query = { _id: new ObjectId(userId) };
          const result = await usersCollection.findOne(query);
          if (!result) {
            return res.status(404).send("User not found");
          }
          res.send(result);
        }
      } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).send("Internal Server Error");
      }
    });

    // ==================Delete Single User👇==========================>
    // admin access
    app.delete("/users/:userId", verifyToken, verifyAdmin, async (req, res) => {
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) }
      const allLandfill = await landfillCollection.find().toArray();
      const allSts = await stsCollection.find().toArray();
      let userInfo = await usersCollection.findOne(query);
      let flag = 0;
      let deleted = 0;
      if (userInfo.assigned) {
        if (userInfo.role === 'Sts Manager') {
          let newStsManager = [];
          let newSts;
          for (let i = 0; i < allSts.length; i++) {
            const managers = allSts[i].manager;
            for (let j = 0; j < managers.length; j++) {
              if (managers[j] == id) {
                newStsManager = allSts[i].manager?.filter(mId => mId !== id);
                allSts[i].manager = newStsManager;
                newSts = allSts[i];
                flag = 1;
                break;
              }
            }
            if (flag) break;
          }
          const UpdatedDocument = {
            $set: {
              manager: newSts.manager
            }
          }
          let LandQuery = { name: newSts.name };
          let removed = await stsCollection.updateOne(LandQuery, UpdatedDocument);
          if (removed.modifiedCount > 0) {
            const result = await usersCollection.deleteOne(query);
            if (result.deletedCount > 0) {
              deleted = 1;
            }
          }
        } else if (userInfo.role === 'Land Manager') {
          let NewLandManager = [];
          let newLand;
          for (let i = 0; i < allLandfill.length; i++) {
            const managers = allLandfill[i].manager;
            for (let j = 0; j < managers.length; j++) {
              if (managers[j] == id) {
                NewLandManager = allLandfill[i].manager?.filter(mId => mId !== id);
                allLandfill[i].manager = NewLandManager;
                newLand = allLandfill[i];
                flag = 1;
                break
              }
            }
            if (flag) break;
          }
          const UpdatedDocument = {
            $set: {
              manager: newLand.manager
            }
          }
          let LandQuery = { name: newLand.name };
          let removed = await landfillCollection.updateOne(LandQuery, UpdatedDocument);
          if (removed.modifiedCount > 0) {
            const result = await usersCollection.deleteOne(query);
            if (result.deletedCount > 0) {
              deleted = 1;
            }
          }
        } else {
          const result = await usersCollection.deleteOne(query);
          if (result.deletedCount > 0) {
            deleted = 1;
          }
        }
      } else {
        const result = await usersCollection.deleteOne(query);
        if (result.deletedCount > 0) {
          deleted = 1;
        }
      }
      if (deleted == 1) {
        res.json({
          result: true,
          message: "Successfully Deleted User"
        });
      } else {
        res.json({
          result: false,
          message: "Something went wrong"
        });
      }
    });

    // ===================Update Role to User👇=======================>
    //admin access
    app.put("/users/:userId/roles", async (req, res) => {
      const updatedRoleInfo = req.body;
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      const placeQuery = { name: updatedRoleInfo.place }
      const userInfo = await usersCollection.findOne(query);
      const managerInfo = id;

      const allLandfill = await landfillCollection.find().toArray();
      const allSts = await stsCollection.find().toArray();

      let assignedFlag = 0;
      if (!userInfo.assigned) {
        if (updatedRoleInfo.role != 'Sts Manager' && updatedRoleInfo.role != 'Land Manager') {
          const updatedRole = {
            $set: {
              role: updatedRoleInfo.role
            }
          }
          const updateRoleIntoDB = await usersCollection.updateOne(query, updatedRole);
          if (updateRoleIntoDB.modifiedCount > 0) {
            assignedFlag = 1;
          }
          //Done
        } else if (updatedRoleInfo.role == "Sts Manager") {
          let stsPlace = await stsCollection.findOne(placeQuery);
          stsPlace.manager.push(managerInfo);
          let UpdatedDoc = {
            $set: {
              manager: stsPlace.manager
            }
          }

          let update = await stsCollection.updateOne(placeQuery, UpdatedDoc);
          if (update.modifiedCount > 0) {
            const updatedRole = {
              $set: {
                assigned: true,
                role: updatedRoleInfo.role
              }
            }
            const updateRoleIntoDB = await usersCollection.updateOne(query, updatedRole);
            if (updateRoleIntoDB.modifiedCount > 0) {
              assignedFlag = 1;
            }
          }
        } //Done 
        else if (updatedRoleInfo.role == "Land Manager") {
          let landPlace = await landfillCollection.findOne(placeQuery);
          landPlace.manager.push(managerInfo);
          let UpdatedLandDoc = {
            $set: {
              manager: landPlace.manager
            }
          }
          let update = await landfillCollection.updateOne(placeQuery, UpdatedLandDoc);
          if (update.modifiedCount > 0) {
            const updatedRole = {
              $set: {
                assigned: true,
                role: updatedRoleInfo.role
              }
            }
            const updateRoleIntoDB = await usersCollection.updateOne(query, updatedRole);
            if (updateRoleIntoDB.modifiedCount > 0) {
              assignedFlag = 1;
            }
          }
        }
        if (assignedFlag) {
          res.json({
            result: true,
            message: "Update Your Role Successfully"
          })
        } else {
          res.json({
            result: false,
            message: "Sorry! Do Not Update Your Role",
          });
        }
      } else {
        let flag = 0;
        if (userInfo.role == 'Land Manager' && updatedRoleInfo.role == 'Sts Manager') {
          let NewLandManager = [];
          let newLand;
          for (let i = 0; i < allLandfill.length; i++) {
            const managers = allLandfill[i].manager;
            for (let j = 0; j < managers.length; j++) {
              if (managers[j] == id) {
                NewLandManager = allLandfill[i].manager?.filter(mId => mId !== id);
                allLandfill[i].manager = NewLandManager;
                newLand = allLandfill[i];
                flag = 1;
                break
              }
            }
            if (flag) break;
          }
          const UpdatedDocument = {
            $set: {
              manager: newLand.manager
            }
          }
          let LandQuery = { name: newLand.name };
          let removed = await landfillCollection.updateOne(LandQuery, UpdatedDocument);
          let newSts;
          if (removed.modifiedCount > 0) {
            for (let i = 0; i < allSts.length; i++) {
              if (allSts[i].name == updatedRoleInfo.place) {
                allSts[i].manager.push(managerInfo);
                newSts = allSts[i];
              }
            }
            let updateStsManager = {
              $set: {
                manager: newSts.manager
              }
            }
            let addtoSts = await stsCollection.updateOne(placeQuery, updateStsManager);
            if (addtoSts.modifiedCount > 0) {
              const updatedRole = {
                $set: {
                  role: updatedRoleInfo.role
                }
              }
              const updateRoleIntoDB = await usersCollection.updateOne(query, updatedRole);
              if (updateRoleIntoDB.modifiedCount > 0) {
                assignedFlag = 1;
              }
            }
          }
        } else if (userInfo.role == 'Sts Manager' && updatedRoleInfo.role == 'Land Manager') {
          let newStsManager = [];
          let newSts;
          for (let i = 0; i < allSts.length; i++) {
            const managers = allSts[i].manager;
            for (let j = 0; j < managers.length; j++) {
              if (managers[j] == id) {
                newStsManager = allSts[i].manager?.filter(mId => mId !== id);
                allSts[i].manager = newStsManager;
                newSts = allSts[i];
                flag = 1;
                break;
              }
            }
            if (flag) break;
          }
          const UpdatedDocument = {
            $set: {
              manager: newSts.manager
            }
          }
          let LandQuery = { name: newSts.name };
          let removed = await stsCollection.updateOne(LandQuery, UpdatedDocument);

          if (removed.modifiedCount > 0) {
            let newLandfill;
            for (let i = 0; i < allLandfill.length; i++) {
              if (allLandfill[i].name == updatedRoleInfo.place) {
                allLandfill[i].manager.push(managerInfo)
                newLandfill = allLandfill[i];
                break;
              }
            }
            let updateStsManager = {
              $set: {
                manager: newLandfill.manager
              }
            }
            let addtoLand = await landfillCollection.updateOne(placeQuery, updateStsManager);
            if (addtoLand.modifiedCount > 0) {
              const updatedRole = {
                $set: {
                  role: updatedRoleInfo.role
                }
              }
              const updateRoleIntoDB = await usersCollection.updateOne(query, updatedRole);
              if (updateRoleIntoDB.modifiedCount > 0) {
                assignedFlag = 1;
              }
            }
          }

        } else if ((userInfo.role == 'Sts Manager') && (updatedRoleInfo.role != 'Sts Manager' && updatedRoleInfo.role != 'Land Manager')) {
          let newStsManager = [];
          let newSts;
          for (let i = 0; i < allSts.length; i++) {
            const managers = allSts[i].manager;
            for (let j = 0; j < managers.length; j++) {
              if (managers[j] == id) {
                newStsManager = allSts[i].manager?.filter(mId => mId !== id);
                allSts[i].manager = newStsManager;
                newSts = allSts[i];
                flag = 1;
                break
              }
            }
            if (flag) break;
          }
          const UpdatedDocument = {
            $set: {
              manager: newSts.manager
            }
          }
          let StsQuery = { name: newSts.name };
          let removed = await stsCollection.updateOne(StsQuery, UpdatedDocument);
          if (removed.modifiedCount > 0) {
            const updatedRole = {
              $set: {
                assigned: false,
                role: updatedRoleInfo.role
              }
            }
            const updateRoleIntoDB = await usersCollection.updateOne(query, updatedRole);
            if (updateRoleIntoDB.modifiedCount > 0) {
              assignedFlag = 1;
            }
          }
        } else if ((userInfo.role == 'Land Manager') && (updatedRoleInfo.role != 'Sts Manager' && updatedRoleInfo.role != 'Land Manager')) {
          let newLandManager = [];
          let newLand;
          for (let i = 0; i < allLandfill.length; i++) {
            const managers = allLandfill[i].manager;
            for (let j = 0; j < managers.length; j++) {
              if (managers[j] == id) {
                newLandManager = allLandfill[i].manager?.filter(mId => mId !== id);
                allLandfill[i].manager = newLandManager;
                newLand = allLandfill[i];
                flag = 1;
                break
              }
            }
            if (flag) break;
          }
          const UpdatedDocument = {
            $set: {
              manager: newLand.manager
            }
          }
          let landQuery = { name: newLand.name };
          let removed = await landfillCollection.updateOne(landQuery, UpdatedDocument);
          if (removed.modifiedCount > 0) {
            const updatedRole = {
              $set: {
                assigned: false,
                role: updatedRoleInfo.role
              }
            }
            const updateRoleIntoDB = await usersCollection.updateOne(query, updatedRole);
            if (updateRoleIntoDB.modifiedCount > 0) {
              assignedFlag = 1;
            }
          }
        }
        if (assignedFlag) {
          res.json({
            result: true,
            message: "Update Your Role Successfully",
          });
        } else {
          res.json({
            result: false,
            message: "Sorry! Do Not Update Your Role",
          });
        }
      }

    });


    // =====================Create a Vehicle👇========================>
    app.post("/create-vehicles", async (req, res) => {
      const vehicles = req.body;
      const sts = vehicles.stsName;

      const exist = await vehiclesCollection.findOne({
        vehicleRegNum: vehicles.vehicleRegNum,
      });

      if (exist) {
        return res.json({
          result: false,
          message: "Registration Number Already Exist"
        })
      }

      const result = await vehiclesCollection.insertOne(vehicles);
      if (result.insertedId) {
        const query = { name: sts };
        const updatedInfo = {
          $push: {
            vehicles: vehicles
          }
        }
        const result = await stsCollection.updateOne(query, updatedInfo);
        if (result.modifiedCount > 0) {
          res.json({
            result: true,
            message: "Vehicles Added Successfully",
          });
        }
      }
    });

    // ====================Create a Landfill👇========================>
    //admin access
    app.post("/create-landfill", async (req, res) => {
      const landfillInfo = req.body;
      const id = landfillInfo.id;

      landfillInfo.manager = [];
      landfillInfo.manager.push(id);
      delete landfillInfo.id;
      const result = await landfillCollection.insertOne(landfillInfo);
      if (result.insertedId) {
        const updatedDoc = {
          $set: {
            assigned: true,
          },
        };
        const updateUserInfo = await usersCollection.updateOne(
          { _id: new ObjectId(id) },
          updatedDoc
        );
        if (updateUserInfo.modifiedCount > 0) {
          res.json({
            result: true,
            message: "Landfill Added Successfully",
          });
        }
      }
    });

    // =======================Create a Sts👇==========================>
    // admin access
    app.post("/create-sts", async (req, res) => {
      const stsInfo = req.body;
      const id = stsInfo.id;

      const exist = await stsCollection.findOne({
        wardNumber: stsInfo.wardNumber,
      });

      if (exist) {
        return res.json({
          result: false,
          message: "Ward Number Already Exist",
        })
      }

      stsInfo.manager = [];
      stsInfo.manager.push(id);
      delete stsInfo.id;
      stsInfo.vehicles = [];
      const result = await stsCollection.insertOne(stsInfo);
      if (result.insertedId) {
        const updatedDoc = {
          $set: {
            assigned: true,
          }
        }
        const updateUserInfo = await usersCollection.updateOne({ _id: new ObjectId(id) }, updatedDoc);
        if (updateUserInfo.modifiedCount > 0) {
          res.json({
            result: true,
            message: "STS Added Successfully",
          });
        }
      }
    });

    // ===================Data Entry of Sts Manager👇=================>
    //sts manager
    app.post("/create-entry-vehicles-leaving", async (req, res) => {
      const stsVehicleLeavingInfo = req.body;
      stsVehicleLeavingInfo.date = currentDate;
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

    // ======================Get All The Sts👇========================>
    app.get('/get-all-sts', async (req, res) => {
      const result = await stsCollection.find().toArray();
      res.send(result);
    });

    // ======================Get All The Sts👇========================>
    app.get('/get-all-landfill', async (req, res) => {
      const result = await landfillCollection.find().toArray();
      res.send(result);
    });

    // =====================Get All The Vehicle👇=====================>
    app.get('/get-all-vehicle', async (req, res) => {
      const result = await vehiclesCollection.find().toArray();
      res.send(result);
    });

    app.get("/available-sts-manager", async (req, res) => {
      const allUsers = await usersCollection.find().toArray();
      const availableSTSManager = allUsers.filter(user => user.assigned == false && user.role == 'Sts Manager');
      res.json({
        result: true,
        data: availableSTSManager
      })
    })

    app.get("/available-landfill-manager", async (req, res) => {
      const allUsers = await usersCollection.find().toArray();
      const availableLandfillManager = allUsers.filter(
        (user) => user.assigned == false && user.role == "Land Manager"
      );
      res.json({
        result: true,
        data: availableLandfillManager,
      });
    });

    // =======================Get The Bill👇==========================>
    //landfill manager
    app.post("/create-truck-dumping", async (req, res) => {
      const truckDumpingInfo = req.body;
      console.log(truckDumpingInfo)

      const allTrackDumpingInfo = await truckDumpingCollection.find().toArray();
      const checkingDate = allTrackDumpingInfo.filter(truck => truck.vehicleRegNum == truckDumpingInfo.vehicleRegNum && truck?.date == currentDate);

      if (checkingDate.length < 3) {

        const vehicleQuery = { vehicleRegNum: truckDumpingInfo.vehicleRegNum };
        const truckInfo = await vehiclesCollection.findOne(vehicleQuery);

        const stsQuery = { name: truckDumpingInfo.stsName };
        const stsInfo = await stsCollection.findOne(stsQuery);
        console.log(stsInfo);

        const landfillQuery = { name: truckDumpingInfo.landName };
        const landfillInfo = await landfillCollection.findOne(landfillQuery);

        const distanceFromStsToLandfill = distance(stsInfo.lat, stsInfo.lng, landfillInfo.lat, landfillInfo.lng);
        let cost = 0;

        if (truckDumpingInfo.waste < truckInfo.capacity) {
          cost =
            truckInfo.fualCostUnloaded +
            (truckDumpingInfo.waste / truckInfo.capacity) *
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

    // ===================Get all vehicle of a sts👇==================>

    // =======================Get A Profile👇=========================>
    app.get("/sts-vehicles/:id", async (req, res) => {
      const wardNumber = req.params.id;
      const query = { wardNumber: wardNumber };
      const sts = await stsCollection.findOne(query);
      res.json({
        result: true,
        data: sts.vehicles
      })
    });


    //profile management endpoints
    app.get("/profile", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await usersCollection.findOne(query);
      res.send(result);
    });

    // =====================Update User Profile👇=====================>
    //update login user info
    app.put("/users/:userId", async (req, res) => {
      const id = req.params.userId;
      console.log(id);
      const query = { _id: new ObjectId(id) };
      const updatedUserInfo = req.body;
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          userName: updatedUserInfo.userName,
          email: updatedUserInfo.email,
          phone: updatedUserInfo.phone,
          dateOfBirth: updatedUserInfo.dateOfBirth,
          gender: updatedUserInfo.gender,
          address: updatedUserInfo.address,
          thana: updatedUserInfo.thana,
          district: updatedUserInfo.district,
          division: updatedUserInfo.division,
        },
      };
      const result = await usersCollection.updateOne(query, updatedDoc, options);
      if (result.modifiedCount > 0) {
        res.json({
          result: true,
          message: "Update User Successfully",
        });
      } else {
        res.json({
          result: false,
          message: "Update User Failed",
        });
      }
    });


    // ==================Create a Role with Role Id👇===================>
    // role
    app.post("/rbac/roles", async (req, res) => {
      const defineRoleBody = req.body;
      let query = { roleName: defineRoleBody.roleName };
      let exist = await rolesCollection.findOne(query);
      if (exist) {
        return res.json({
          result: false,
          message: `Role ${defineRoleBody.roleName} already exist`
        })
      }
      let id;
      const allDefinedRole = await rolesCollection.find().toArray();
      if (allDefinedRole.length == 0) {
        id = 1;
      } else {
        const lastDefinedRoleId = allDefinedRole[(allDefinedRole.length) - 1].id;
        id = parseInt(lastDefinedRoleId) + 1;
      }
      defineRoleBody.id = id;
      const result = await rolesCollection.insertOne(defineRoleBody);
      if (result.insertedId) {
        res.json({
          result: true,
          message: "Role Defined Successfully"
        })
      } else {
        res.json({
          result: false,
          message: "Role Defined Failed"
        })
      }
    });

    // =====================Check User Role👇======================>
    app.post("/rbac/permissions", async (req, res) => {
      const permissionBody = req.body;
      const query = { email: permissionBody.email };
      const getUser = await usersCollection.findOne(query);
      if (getUser) {
        res.json({
          result: true,
          message: getUser.role,
        });
      }
      else {
        res.json({
          result: false,
          message: `${permissionBody.email} is not exist`
        });
      }
    });

    // =====================Check Landfill Manager's Landfill👇======================>
    app.get("/landfill-manager/:email", async (req, res) => {
      const email = req.params.email;
      const userInfo = await usersCollection.findOne({ email: email });
      const id = userInfo._id.toString();
      console.log(id);

      const allLandfillCollection = await landfillCollection.find().toArray();

      let landfill = null;
      for (let i = 0; i < allLandfillCollection.length; i++) {
        const landfillManagers = allLandfillCollection[i].manager;
        console.log("Landfill Managers :", landfillManagers);
        for (let j = 0; j < landfillManagers.length; j++) {
          let land = landfillManagers[j];
          console.log("Landfill id", land);
          if (land === id) {
            landfill = allLandfillCollection[i];
            console.log("Landfill", landfill);
            break;
          }
          // if (!landfill) break;
        }
      }

      if (landfill) {
        res.json({
          result: true,
          message: landfill
        })
      } else {
        res.json({
          result: false,
          message: landfill,
        });
      }
    });

    // =====================Check Sts Manager's Sts and vehicle👇======================>
    app.get("/stsid/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const getUserInfo = await usersCollection.findOne(query);
      const id = getUserInfo._id.toString();

      const allStsCollection = await stsCollection.find().toArray();
      for (let i = 0; i < allStsCollection.length; i++) {
        const stsManagers = allStsCollection[i].manager;
        for (let j = 0; j < stsManagers.length; j++) {
          if (stsManagers[j] == id) {
            return res.json({
              result: true,
              data: allStsCollection[i].wardNumber,
              vehicles: allStsCollection[i].vehicles,
            });
          }
        }
      }
    });

    // =====================Admin Real Time Monitoring👇======================>
    //Dashboard Monitoring
    app.get("/dashboard", async (req, res) => {
      const allVehicles = await vehiclesCollection.find().toArray();
      let result = [];
      for (let i = 0; i < allVehicles.length; i++) {
        const vehicleNum = allVehicles[i].vehicleRegNum;
        const truckDumpingInfo = await truckDumpingCollection
          .find({
            $and: [
              { vehicleRegNum: vehicleNum },
              { date: currentDate }
            ],
          })
          .toArray();

        const fuelCost = truckDumpingInfo.reduce(
          (accumulator, current) => accumulator + current.bill,
          0
        );

        const totalWasteVolumeOfLandfill = truckDumpingInfo.reduce(
          (accumulator, current) => accumulator + current.waste,
          0
        );

        const stsTruckInfo = await stsLeavingCollection
          .find({
            $and: [{ vehicleNum: vehicleNum }, { date: currentDate }],
          })
          .toArray();
        const totalWasteVolume = stsTruckInfo.reduce(
          (accumulator, current) => accumulator + current.volumeWaste,
          0
        );

        const totalTransportation = [...stsTruckInfo, ...truckDumpingInfo];
        const nearestTime = findNearestTime(totalTransportation);

        let lastLocation;
        if (nearestTime?.hasOwnProperty('stsId')) {
          lastLocation = `${nearestTime?.stsName} STS`;
        } else if (nearestTime?.hasOwnProperty("landName")) {
          lastLocation = `${nearestTime?.landName} Landfill`;
        }

        const truckCostInfo = {
          vehicleNum: vehicleNum,
          stsName: allVehicles[i].stsName,
          fuelCost: fuelCost,
          stsWasteWeight: totalWasteVolume,
          landfillWasteWeight: totalWasteVolumeOfLandfill,
          landLocation: lastLocation || "Can Not Enter Any Landfill or STS",
          arrival: nearestTime?.arrival || "Can Not Enter Any Landfill or STS",
          departure:
            nearestTime?.departure || "Can Not Enter Any Landfill or STS",
        };
        result.push(truckCostInfo);
      }
      res.send(result);
    });

    // =====================Sts Manager View Optimal Path👇======================>
    app.get("/sts-info/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const getUserInfo = await usersCollection.findOne(query);

      const allStsCollection = await stsCollection.find().toArray();
      for (let i = 0; i < allStsCollection.length; i++) {
        const stsManagers = allStsCollection[i].manager;
        for (let j = 0; j < stsManagers.length; j++) {
          if (stsManagers[j] == getUserInfo._id) {
            return res.json({
              result: true,
              data: allStsCollection[i],
            });
          }
        }
      }
    });

    app.get("/minimum-vehicle-and-cost/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const getUserInfo = await usersCollection.findOne(query);

      let vehicleInfo;
      let target;

      const allStsCollection = await stsCollection.find().toArray();
      for (let i = 0; i < allStsCollection.length; i++) {
        const stsManagers = allStsCollection[i].manager;
        for (let j = 0; j < stsManagers.length; j++) {
          if (stsManagers[j] == getUserInfo._id.toString()) {
            vehicleInfo = allStsCollection[i].vehicles;
            target = allStsCollection[i].capacity;
          }
        }
      }
      const trucks = vehicleInfo.filter(
        (truck) => truck.type == "Compactor" || truck.type == "Dump Truck"
      );

      let reqData = []

      for (let i = 0; i < trucks.length; i++) {
        let truck = trucks[i];
        if (truck.type == "Compactor") {
          truck.capacity = (truck.capacity);
        }
        const newInfoOfTruck = {
          name: truck.vehicleRegNum,
          capacity: truck.capacity,
          cost: truck?.fualCostLoaded + truck?.fualCostUnloaded,
        };
        reqData.push(newInfoOfTruck)
      }

      res.json({
        result: true,
        trucks: reqData,
        stsCapacity: target,
      });
    })

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
