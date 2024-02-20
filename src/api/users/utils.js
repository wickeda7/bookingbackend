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

  console.log("ctx.request.body", ctx.request.body);

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
        phoneNumber,
        username,
        role,
        firebase,
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

  const newUser = {
    ...params,
    //role: role.id,
    email: email.toLowerCase(),
    confirmed: !settings.email_confirmation,
  };
  const user = await getService("user").add(newUser);
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
  const { email } = ctx.params;
  try {
    // const user = await strapi.entityService.findMany(
    //   "plugin::users-permissions.user",
    //   {
    //     fields: ["firstName", "lastName", "email", "phoneNumber"],
    //     filters: {
    //       email: {
    //         $eq: email,
    //       },
    //     },
    //     populate: {
    //       role: {
    //         fields: ["name", "id"],
    //       },
    //       userInfo: {
    //         fields: [],
    //         populate: {
    //           profileImg: {
    //             fields: ["url"],
    //           },
    //         },
    //       },
    //     },
    //   }
    // );
    const user = await strapi.query("plugin::users-permissions.user").findOne({
      where: { email },
      select: ["firstName", "lastName", "email", "phoneNumber"],
      populate: {
        role: {
          select: ["name", "id"],
        },
        userInfo: {
          select: [],
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
