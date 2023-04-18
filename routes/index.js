var express = require("express");
var router = express.Router();
const { queueMiddleware } = require("../middleware/queue");
require("dotenv").config();
let isActive = false;
let tasks = [];

const secretKey = process.env.SECRET_KEY;

/* GET home page. */
router.get("/", function (req, res) {
	tasks.push({ secret: req.query.secret, text: req.query.text });
	function callPatient() {
		try {
			if (!isActive) {
				try {
					isActive = true;
					const { text, secret } = tasks[0];
					if (!text || text == "" || !secret || secret == "") {
						return false;
					}

					if (secretKey != secret) {
						return false;
					}

					queueMiddleware.say(text);
				} catch (error) {
					console.log(error);
					return false;
				}

				console.log("Text has been spoken.");
				setTimeout(() => {
					console.log(tasks.length);
					tasks.shift();
					isActive = false;
					if (tasks.length) {
						callPatient();
					} else {
						return res.json({success: true});
					}
				}, 6000);
				return true;
			}
		} catch (error) {
			console.log(error);
			return res.json({success: false});
		}
	}
	callPatient();
	return false;
});

module.exports = router;
