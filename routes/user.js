const router = require("express").Router();
const UserController = require("../controller/UserController");


router.get('/getuser', UserController.getUsers);
router.get('/getuserid', UserController.getUserid)
module.exports = router;