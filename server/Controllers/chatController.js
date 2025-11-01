const Chat = require('../Models/ChatModel');
const add = async (req, res) => {
  try {
    const { arr, projectId } = req.body;
    for (let i = 0; i < arr.length; i++) {
      const { message, sender } = arr[i];
      const chat = new Chat({
        projectId: projectId,
        message,
        sender,
      });
      await chat.save();
    }
    res.json({ message: 'Recent Chat Saved!!', ok: true });
  } catch (err) {
    console.log(err.message);
    res.json({ message: "Recent Chat couldn't Saved!!", ok: false });
  }
};
const fetch = async (req, res) => {
  const { projectId } = req.body;
  try {
    const arr = await Chat.find({ projectId }).sort({ createdAt: -1 });
    res.json({ data: arr, ok: true });
  } catch (err) {
    res.json({ message: 'Messages cant be retrieved!!', ok: false });
  }
};

module.exports = { add, fetch };
