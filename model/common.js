//Imports
const db = require("./mongodb");
const bcrypt = require("bcrypt");
const fs = require("fs").promises;
const jwt = require("jsonwebtoken");
const { message } = require("./message");
const { ObjectId } = require("bson");
const fsRead = require("fs");
const { transporter } = require("./mail");
const ejs = require("ejs")
function getImageAsBase64(imagePath) {
  const imageBuffer = fsRead.readFileSync(imagePath);
  const imageBase64 = imageBuffer.toString("base64");
  const imageExtension = imagePath.split(".").pop();
  return `data:image/${imageExtension};base64,${imageBase64}`;
}

//Forgot Password Mail
const forgotPasswordMail = async (mailData) => {
  // let templatePathUser = path.resolve('../templates/user/')
  ejs.renderFile(
    "./templates/user/forgotPassword.ejs",
    {
      fullName: mailData.fullName,
      email: mailData.emailTo,
      url: mailData.url,
      linkdinUrl: mailData.linkdinUrl,
      instaUrl: mailData.instaUrl,
      otp: mailData.otp,
      logoUrl: getImageAsBase64(imagePath),
    },
    (err, data) => {
      if (err) {
        console.log(err);
      } else {
        let mailOptions = {
          from: process.env.SMTP_AUTH_USER,
          to: mailData.emailTo,
          subject: `AllMasters | Attention! Password Reset Request`,
          html: data,
        };

        //Send Mail

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            if (mailResendAttempts !== 0) {
              forgotPasswordMail(mailData);
              mailResendAttempts--;
            } else {
              mailResendAttempts = 2;
            }
            logger.error(`Mail Not Sent - ${error}`);
            return console.log(error);
          }
          logger.info(`Mail sent:  - ${info.messageId}`);
        });
      }
    }
  );
};

const otpGenerate = () => {
  let otp = Math.random().toString().substring(2, 8);
  if (otp.length !== 6) {
    otpGenerate();
  } else {
    return otp;
  }
};

const loginParameter = async (model, loginData, res, req) => {
  let user,
    passwordMatch,
    generatedToken,
    loginTime,
    updateLogIn,
    privateKey;

  privateKey = await fs.readFile("privateKey.key", "utf8");
  user = await db.findSingleDocument(model, {
    email: loginData.email,
    status: 1
  });

  if (user !== null && Object.keys(user).length !== 0) {
    if (user.password !== undefined) {
      // && (user.logoutTime === undefined || user.logoutTime !== null)
      passwordMatch = bcrypt.compareSync(loginData.password, user.password);
      if (passwordMatch === true) {
        generatedToken = jwt.sign(
          {
            userId: user._id,
            role: user.role,
            status: user.status,
            type: loginData.type,
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60,
          },
          privateKey,
          { algorithm: "RS256" }
        );
        res.setHeader("Authorization", "Bearer " + generatedToken)
        loginTime = Date.now();
        updateLogIn = await db.updateOneDocument(
          model,
          { _id: user._id },
          { loginTime: loginTime, logoutTime: "" }
        );
        if (updateLogIn.modifiedCount !== 0 && updateLogIn.matchedCount !== 0) {
          return res.send({
            status: 1,
            response: message.login,
            data: JSON.stringify({
              userId: user._id,
              token: generatedToken,
              fullName: user.fullName
            }),
          });
        }
      } else {
        return res.send({ status: 0, response: message.wrongPassword });
      }
    } else {
      if (user.password === undefined) {
        return res.send({ status: 0, response: message.userNotFound });
      }

      return res.send({ status: 0, response: message.wrongPassword });
    }
  } else {
    return res.send({ status: 0, response: message.loginFailed });
  }
};

const logoutParameter = async (model, logoutData, res, req) => {
  let logoutTime, updateLogOut;

  logoutTime = Date.now();
  updateLogOut = await db.updateOneDocument(
    model,
    { _id: new ObjectId(logoutData.id) },
    { logoutTime: logoutTime }
  );
  if (updateLogOut.modifiedCount !== 0 && updateLogOut.matchedCount !== 0) {
    return res.send({
      status: 1,
      response: message.logoutSucess,
    });
  } else {
    return res.send({ status: 0, response: message.invalidCredential });
  }
};


module.exports = {
  otpGenerate,
  loginParameter,
  logoutParameter,
  getImageAsBase64,
};
