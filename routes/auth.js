const express = require("express");
const AuthController = require("../controllers/AuthController");

const router = express.Router(); //express.Router() => สร้าง router object

router.post("/register", AuthController.register);
router.post("/register2", AuthController.register2); // test
router.post("/register3", AuthController.register3); // test
router.post("/login", AuthController.login);
router.post("/verify-otp", AuthController.verifyConfirm);
router.post("/resend-verify-otp", AuthController.resendConfirmOtp);

module.exports = router;