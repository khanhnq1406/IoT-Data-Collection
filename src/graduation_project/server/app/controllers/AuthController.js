class AuthController {
  // [GET] /
  index(req, res, next) {
    res.send("Auth");
  }
}

module.exports = new AuthController();
