const { API } = require("vk-io");
const db = require("../DB/db");

const api = (token) => {
  return new API({
    token: process.env.TOKEN || token,
  });
};

const getListDialogues = async (req, res) => {
  const params = req.headers.token;
  if (!params.trim().length) {
    return res.status(400).send("no token");
  }
  try {
    const apiVk = await api(params);

    const listDialogues = await apiVk.messages.getConversations({ count: 200 });

    let fields = "";
    listDialogues.items.forEach((item) => {
      const id = item.conversation.peer.id;
      if (id > 0) {
        fields += `${id},`;
      }
    });

    const user = await apiVk.users.get({
      user_ids: fields,
      fields: "online,photo_50,last_seen,is_no_index",
    });

    res.status(200).send(user);
  } catch (err) {
    console.log(err);
    res
      .status(500)
      .send({ msg: "failed to get the dialog sheet", error: err.message });
  }
};

const getMessageUser = async (req, res) => {
  try {
    const apiVk = await api(req.headers.token);
    const getMessage = await apiVk.messages.getHistory({
      user_id: req.headers.id,
      count: 10,
      start_message_id: -1,
      extended: 1,
    });

    const messageArray = [];
    getMessage.items.forEach((item) => {
      const { date, from_id, text, fwd_messages, attachments } = item;
      const list = checkId(from_id, getMessage);
      const message = {
        date,
        list,
        text,
        fwd_messages,
        attachments,
      };
      messageArray.push(message);
    });
    messageArray.reverse();
    res.status(200).send(messageArray);
  } catch (err) {
    console.log(err);
    res
      .status(400)
      .send({ msg: "failed to get message user", error: err.message });
  }
};

const checkId = (id, getMessage) => {
  return getMessage.profiles.filter((item) => {
    if (item.id === id) {
      return item;
    }
    return id;
  });
};

module.exports = { getListDialogues, getMessageUser };
