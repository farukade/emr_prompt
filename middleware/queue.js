const Queue = require("bull");
const say = require("say");

exports.queueMiddleware = {
	queue: (req, res, next) => {
		const speechQueue = new Queue("speechQueue"); // Create a queue object.
		req.queue = speechQueue; // add this queue to req object so its accessible in the request handler.

		next(); // important!
	},
	say: (text) => {
		try {
			say.speak(text, null, 1.0, (err) => {
				if (err) {
					return console.error(err);
				}
				console.log("Text has been spoken.");
			});
			return;
		} catch (error) {
			console.log(error);
			return;
		}
	},
};
