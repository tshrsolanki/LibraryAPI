const jwt = require("jsonwebtoken");
const redis = require("redis");
const redisClient = redis.createClient();
const redisStart = async () => {
  await redisClient
    .connect()
    .then(() => {
      console.log("redis ready", "||", "sessions.js", "line-", 8);
    })
    .catch(() => {
      console.log("Redis connection error");
    });
};

const getAuthTokenId = async (req, res, db) => {
  try {
    const { authorization } = req.headers;
    const id = await redisClient.get(authorization);
    if (id) {
      return await db
        .select("*")
        .from("users")
        .where({
          id,
        })
        .returning("*")
        .then((data) => {
          res.json(data[0]);
        });
    }
    return res.json("unauthorized");
  } catch (error) {
    console.log(error, "||", "sessions.js", "line-", 33);
    return res.json("unauthorized");
  }
};

const createSession = async (id) => {
  const token = jwt.sign({ id }, "JWT_SECRET", { expiresIn: "2 days" });

  await redisClient.set(token, id);
  return token;
};

const deleteSession = async (token) => {
  const res = await redisClient.del(token);
  if (res) {
    return {
      success: 1,
    };
  }
};

module.exports = {
  createSession,
  getAuthTokenId,
  deleteSession,
  redisStart,
};
