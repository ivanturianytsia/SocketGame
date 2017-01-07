"use strict";

let users = {}

let getRandomNumber = (min, max) => {
	min = min || 0;
	max = max || 0;
	return min + Math.floor(Math.random() * 100000 % (max - min));
}

let getRandomColor = () => {
	let red = getRandomNumber(40, 220);
	let green = getRandomNumber(40, 220);
	let blue = getRandomNumber(40, 220);

	return `rgb(${red},${green},${blue})`;
}

module.exports = server => {
	const io = require('socket.io')(server);

	io.on('connection', function(socket) {
		let user = socket.id;

		users[user] = {
			x: 0,
			y: 0,
			color: getRandomColor()
		};

		io.emit('state', {
			users
		});


		socket.on("state", function(data) {
			users[user].x = data.x;
			users[user].y = data.y;

			io.emit('state', users);
		})
		socket.on('disconnect', function() {
			delete users[user];
		});
	});
}
