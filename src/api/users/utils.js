require("dotenv").config();
const axios = require("axios");
const utils = require("@strapi/utils");
const _ = require("lodash");

const CLOVER_APP_URL = process.env.CLOVER_APP_URL;

const {
  getService,
} = require("@strapi/plugin-users-permissions/server/utils/index");
const { sanitize } = utils;
const { ApplicationError, ValidationError } = utils.errors;

const admin = require("../../../config/admin");

const sanitizeUser = (user, ctx) => {
  const { auth } = ctx.state;
  const userSchema = strapi.getModel("plugin::users-permissions.user");

  return sanitize.contentAPI.output(user, userSchema, { auth });
};
const register = async (ctx) => {
  let { email, password, phoneNumber, username, role, firebase } =
    ctx.request.body;

  const pluginStore = await strapi.store({
    type: "plugin",
    name: "users-permissions",
  });
  const settings = await pluginStore.get({ key: "advanced" });
  //const cloverId = await createCloverUser(ctx, entry.access_token);

  const params = {
    ..._.omit(
      {
        email,
        password,
        username,
        role,
      },
      [
        "confirmed",
        "blocked",
        "confirmationToken",
        "resetPasswordToken",
        "id",
        "createdAt",
        "updatedAt",
        "createdBy",
      ]
    ),
    provider: "local",
  };
  const { provider } = params;
  const identifierFilter = {
    $or: [{ email: email.toLowerCase() }],
  };
  const conflictingUserCount = await strapi
    .query("plugin::users-permissions.user")
    .count({
      where: { ...identifierFilter, provider },
    });
  if (conflictingUserCount > 0) {
    throw new ApplicationError("Email is already taken");
  }
  const entryInfo = await strapi.entityService.create(
    "api::user-info.user-info",
    {
      data: {
        firebase,
        phoneNumber,
      },
    }
  );
  const newUser = {
    ...params,
    //role: role.id,
    userInfo: entryInfo.id,
    email: email.toLowerCase(),
    confirmed: !settings.email_confirmation,
  };
  const user = await getService("user").add(newUser);
  user.userInfo = { id: entryInfo.id, firebase, phoneNumber };
  const sanitizedUser = await sanitizeUser(user, ctx);

  //sanitizedUser["roleId"] = role.id;
  if (settings.email_confirmation) {
    try {
      await getService("user").sendConfirmationEmail(sanitizedUser);
    } catch (err) {
      throw new ApplicationError(err.message);
    }

    return ctx.send({ user: sanitizedUser });
  }
  const jwt = getService("jwt").issue(_.pick(user, ["id"]));

  return {
    jwt,
    user: sanitizedUser,
  };
  //}
  //return { error: "No access token" };
};
const getUser = async (ctx, next) => {
  console.log(
    "ctx.params",
    new Date().toLocaleDateString("fr-CA", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  );
  const { email } = ctx.params;
  try {
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: { email },
      select: ["email"],
      populate: {
        storeAdmin: {
          select: ["id", "name"],
          populate: {
            employee: {
              select: ["id"],
              populate: {
                userInfo: {
                  select: [
                    "firstName",
                    "lastName",
                    "displayColor",
                    "id",
                    "pushToken",
                  ],
                },
                appointmentsSpecialist: {
                  filters: {
                    date: {
                      $eq: new Date().toLocaleDateString("fr-CA", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      }),
                    },
                  },
                },
              },
            },
          },
        },
        storeEmployee: true,
        role: {
          select: ["name", "id"],
        },
        userInfo: {
          select: [
            "firstName",
            "lastName",
            "phoneNumber",
            "firebase",
            "pushToken",
          ],
          populate: {
            profileImg: {
              select: ["url"],
            },
          },
        },
        favorites: {
          populate: {
            logo: {
              select: ["url"],
            },
          },
        },
      },
    });
    //console.log("user util", user);
    if (!user) {
      return false;
    }
    return user;
  } catch (error) {
    console.log("error", error);
    if (error.message) {
      return { error: error.message };
    }
    const { response } = error;
    const { request, ...errorObject } = response; // take everything but 'request'
    return { error: errorObject.data };
  }
};
const updateUser = async (ctx) => {
  const data = ctx.request.body;
  const id = ctx.params.id;
  try {
    const user = await strapi.query("plugin::users-permissions.user").update({
      where: { id: id },
      data: data,
    });
    return user;
  } catch (error) {
    console.log("error", error);
  }
};
module.exports = { register, getUser, updateUser };
