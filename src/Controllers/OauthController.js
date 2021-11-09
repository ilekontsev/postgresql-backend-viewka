const { CallbackService } = require("vk-io");
const {
  DirectAuthorization,
  officialAppCredentials,
} = require("@vk-io/authorization");

const db = require("../DB/db");

const callbackService = new CallbackService();

const authorization = async (req, res) => {
  try {
    const { login, password } = req.body;
    if (!login || !password) {
      res.status(400).send("login or password was not send");
    }

    const direct = new DirectAuthorization({
      callbackService,
      scope: "all",
      ...officialAppCredentials.windows,
      login,
      password,
    });
    callbackService.onCaptcha((data) => {
      console.log(data);
      res.send(data);
      direct.run();
    });
    // auth in VK
    const mes = await direct.run();

    const { user, token } = mes;
    const users = await getUsers(user);
    if (users.rows.length) {
      await refreshToken(user, token);
    } else {
      await db.query(
        "INSERT INTO person (vk_id, token, login_user, password_user) values ($1, $2, $3, $4) RETURNING *",
        [user, token, login, password]
      );
    }
    res.status(200).send(mes);
  } catch (err) {
    console.log(err);
    res.status(400).send({ msg: "go back", error: err.message });
  }
};

const getUsers = async (id) => {
  return db.query("SELECT * FROM person where vk_id = $1", [id]);
};

const refreshToken = async (id, token) => {
  return db.query("update person set token = $2 where vk_id = $1 returning *", [
    id,
    token,
  ]);
};

module.exports = {
  authorization,
};
