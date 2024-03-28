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
      const roleQuery = { name: user.role };

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
                  message: "check your email",
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
                    message: "check your email",
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
    // ===============================Login User👇===================================
    app.post("/auth/login", async (req, res) => {
      const { email, password } = req.body;
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      if (user.role == 'unassigned') {
        return res.json({
          result: false,
          message: "You can not login now!"
        })
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
    app.put("/auth/change-password", async (req, res) => {
      const information = req.body;
      console.log(information);
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
    // admin access
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
    app.delete("/users/:userId", async (req, res) => {
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });

    // ===================Update Role to User👇=======================>
    //admin access
    app.put("/users/:userId/roles", async (req, res) => {
      const updatedRoleInfo = req.body;
      const id = req.params.userId;
      const query = { _id: new ObjectId(id) };
      const userInfo = await usersCollection.findOne(query);

      // role info
      // const roleInfo = await rolesCollection.findOne({name:updatedRoleInfo.role})

      // all sts collection
      const allStsCollection = await stsCollection.find().toArray();

      // all landfill collection
      const allLandfillCollection = await landfillCollection.find().toArray();

      // if place exist in the body
      if (updatedRoleInfo.place) {
        console.log('Place Hitted');
        let placeQuery = { name: updatedRoleInfo.place };
        let assignManager;

        // manager info with manager name and email
        const mangerInfo = {
          managerName: userInfo.userName,
          email: userInfo.email
        }

        // set database
        const assignManagerPlace = {
          $push: {
            manager: mangerInfo,
          },
        };

        // if sts manager query
        // todo
        if (updatedRoleInfo.role == 'Sts Manager') {
          assignManager = await stsCollection.updateOne(placeQuery, assignManagerPlace);
        } else {
          assignManager = await landfillCollection.updateOne(placeQuery, assignManagerPlace);
        }
        if (assignManager.modifiedCount > 0) {
          const updatedDoc = {
            $set: {
              assigned: true,
              role: updatedRoleInfo.role,
            },
          };
          const assignedConfirm = await usersCollection.updateOne(query, updatedDoc);
          if (assignedConfirm.modifiedCount > 0) {
            res.json({
              result: true,
              message: "User Assigned Successfully",
            });
          }
        }
      } else {

        let placeName = null;
        let removeUser = null;
        const mangerInfo = {
          managerName: userInfo.name,
          email: userInfo.email
        }

        const updatedDoc = {
          $set: {
            role: updatedRoleInfo.role,
          },
        };

        const result = await usersCollection.updateOne(query, updatedDoc);

        if (result.modifiedCount > 0) {
          if (userInfo.role == 'Sts Manager') {
            // check all sts to find the user and remove 
            for (let i = 0; i < allStsCollection.length; i++) {
              const stsManagers = allStsCollection[i].manager;
              for (let j = 0; j < stsManagers.length; j++) {
                const stsManagerEmail = stsManagers[j].email;
                if (stsManagerEmail == userInfo.email) {
                  placeName = allStsCollection[i].name;
                  break;
                }
              }
              if (!placeName) break;
            }

            // update information
            const removeUserInfo = {
              $pull: {
                manager: mangerInfo,
                assigned: false
              },
            };
            removeUser = await stsCollection.updateOne({ name: placeName }, removeUserInfo);

          } else if (userInfo.role == "Land Manager") {
            // check all landfill to find the user and remove
            for (let i = 0; i < allLandfillCollection.length; i++) {
              const landfillManagers = allLandfillCollection[i].manager;
              for (let j = 0; j < landfillManagers.length; j++) {
                const landfillManagerEmail = landfillManagers[j].email;
                if (landfillManagerEmail == userInfo.email) {
                  placeName = allLandfillCollection[i].name;
                  break;
                }
              }
              if (!placeName) break;
            }
            const removeUserInfo = {
              $pull: {
                manager: mangerInfo
              },
            };

            removeUser = await landfillCollection.updateOne({ name: placeName }, removeUserInfo);

          }
          if (removeUser == null || removeUser.modifiedCount > 0) {
            res.json({
              result: true,
              message: "Update User Role Successfully",
            });
          }
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
      landfillInfo.manager = [];
      const result = await landfillCollection.insertOne(landfillInfo);
      if (result.insertedId) {
        res.json({
          result: true,
          message: "Landfill Created Successfully",
        });
      }
    });

    // =======================Create a Sts👇==========================>
    // admin access
    app.post("/create-sts", async (req, res) => {
      const stsInfo = req.body;
      stsInfo.manager = [];
      stsInfo.vehicles = [];
      const result = await stsCollection.insertOne(stsInfo);
      if (result.insertedId) {
        res.json({
          result: true,
          message: "STS Added Successfully",
        });
      }
    });

    // ===================Data Entry of Sts Manager👇=================>
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

    // =======================Get The Bill👇==========================>
    //landfill manager
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

    // =======================Get A Profile👇==========================>
    //profile management endpoints
    app.get("/profile", async (req, res) => {
      const email = req.query.email; //it will be body maybe
      const query = { email: email };
      const result = await usersCollection.find(query).toArray();
      res.send(result);
    });

    // =====================Update User Profile👇======================>
    //update login user info
    app.put("/profile", async (req, res) => {
      const email = req.query.email;  //it will be body maybe
      const query = { email: email };
      const updatedUserInfo = req.body;
      const updatedDoc = {
        $set: {
          //ToDO: should be user Email Also
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

    // =====================Calculate Fuel Cost👇======================>
    //Dashboard Monitoring
    app.get("/dashboard", async (req, res) => {
      const allVehicles = await vehiclesCollection.find().toArray();
      let result = [];
      for (let i = 0; i < allVehicles.length; i++) {
        const vehicleNum = allVehicles[i].vehicleRegNum;

        // truck fuel cost
        const vehicleNumQuery = { vehicleNum: vehicleNum };

        const truckDumpingInfo = await truckDumpingCollection.find(vehicleNumQuery, { date: currentDate }).toArray();
        const fuelCost = truckDumpingInfo.reduce((accumulator, current) => accumulator + current.bill, 0);

        const stsTruckInfo = await stsLeavingCollection.find(vehicleNumQuery, { date: currentDate }).toArray();
        const totalWasteVolume = stsTruckInfo.reduce((accumulator, current) => accumulator + current.volumeWaste, 0);

        const landfillDumpingInfo = await truckDumpingCollection.find(vehicleNumQuery, { date: currentDate }).toArray();
        const totalWasteVolumeOfLandfill = landfillDumpingInfo.reduce(
          (accumulator, current) => accumulator + current.volumeWaste,
          0
        );

        const totalTransportation = [...stsTruckInfo, ...landfillDumpingInfo]
        const nearestTime = findNearestTime(totalTransportation);

        const truckCostInfo = {
          vehicleNum: vehicleNum,
          fuelCost: fuelCost,
          stsWasteWeight: totalWasteVolume,
          landfillWasteWeight: totalWasteVolumeOfLandfill,
          transportation: nearestTime,
        };
        result.push(truckCostInfo)
      }
      res.send(result);
    });

    // ==================Create a Role with Role Id👇===================>
    // role
    app.post("/rbac/roles", async (req, res) => {
      const defineRoleBody = req.body;
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
