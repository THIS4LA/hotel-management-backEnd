export function isLogged(req) {
  return !!req.user;
}


export function isAdmin(req, res) {
  const user = req.user;
  if (!user) {
    return res.status(401).json({ message: "Please Login" });
  }
  if (user.type != "Admin") {
    return res
      .status(403)
      .json({ message: "Only Admin Can Use this function" });
  }
  return true;
}
