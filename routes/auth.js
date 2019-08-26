const router = require("express").Router();
const AuthController = require("../controller/AuthController");

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/login", (req, res, next) => {
  res.render("login");
});
module.exports = router;
