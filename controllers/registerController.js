const User = require("../model/User");
const bcrypt = require("bcrypt");

const handleNewUser = async (req, res) => {
  const { user, pwd, firstname, lastname } = req.body;
  if (!user || !pwd || !firstname || !lastname)
    return res
      .status(400)
      .json({ message: "Username and password are required" });
  const dublicate = await User.findOne({ username: user }).exec();
  if (dublicate) return res.sendStatus(409);

  try {
    const hashedPwd = await bcrypt.hash(pwd, 10);
    const newUser = {
      firstname: firstname,
      lastname: lastname,
      username: user,
      roles: { User: 1111 },
      password: hashedPwd,
    };

    const result = await User.create({
      username: user,
      password: hashedPwd,
      firstname: firstname,
      lastname: lastname,
    }).catch((error) => {
      console.error("Error creating user:", error);
    });

    console.log(result);

    res.status(201).json({ success: `New user ${user} created!` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
