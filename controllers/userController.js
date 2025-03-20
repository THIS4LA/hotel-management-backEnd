import User from "../models/user.js";
export function getUsers(req, res) {
  User.find().then((users) => {
    res.status(200).json({
      userList: users,
    });
  });
}

export function postUsers(req, res) {
  const user = req.body;
  const newUser = new User(user);
  newUser
    .save()
    .then(() => {
      res.status(201).json({ message: "User created successfully" });
    })
    .catch(() => {
      res.status(400).json({ message: "Failed to create user" });
    });
}

export function putUsers(req, res) {
  res.json({
    message: "put request",
  });
}

export function deleteUsers(req, res) {
  const userEmail = req.body.email;
  User.deleteOne({ email: userEmail })
    .then(() => {
      res.status(200).json({ message: "User deleted successfully" });
    })
    .catch(() => {
      res.status(404).json({ message: "User not found" });
    });
}

export function loginUser(req, res) {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({
    email: email,
    password: password,
  }).then((user) => {
    if (!user) {
      return res.status(404).json({ message: "Invalid email or password" });
    }
    res
      .status(200)
      .json({ message: "User authenticated successfully", userId: user._id });
  });
}

// export function deleteUsers(req, res) {
//   const userEmail = req.body.email;
//   User.findOneAndDelete({ email: userEmail })
//     .then((deletedUser) => {
//       if (!deletedUser) {
//         return res.status(404).json({ message: "User not found" });
//       }
//       res.status(200).json({ message: "User deleted successfully" });
//     })
//     .catch(() => {
//       res.status(404).json({ message: "User not found" });
//     });
// }
