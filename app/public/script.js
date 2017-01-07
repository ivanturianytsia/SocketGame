window.onload = function() {
	var socket = io.connect();
	var player = {
		id: null,
		x: 0,
		y: 0,
		speed: 0.1,
		targetx: 0,
		targety: 0,
		update: function() {
			this.x += this.speed * (this.targetx - this.x);
			this.y += this.speed * (this.targety - this.y);
		}
	}
	boxes = [];

	var world = {
		canvas: document.getElementById("canvas"),
		start: function() {
			this.canvas.width = 1000;
			this.canvas.height = 500;

			this.context = this.canvas.getContext("2d");

			var that = this;
			this.interval = window.setInterval(function() {
				that.update();
			}, 20);


			this.canvas.onmousemove = function(event) {
				player.targetx = event.layerX;
				player.targety = event.layerY;
			}

			socket.on("state", function(users) {
				boxes = Object.keys(users)
					.map(function(id) {
						return new Component({
							id: id,
							width: 10,
							height: 10,
							x: users[id].x,
							y: users[id].y,
							color: users[id].color,
							context: that.context
						});
					})
			})
		},
		update: function() {
			this.clear();

			player.update();
			boxes.forEach(function(item) {
				item.update();
			});

			socket.emit("state", {
				x: player.x,
				y: player.y
			})
		},
		clear: function() {
			this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		}
	}

	world.start();

	function Component(options) {
		var that = this;
		that.id = options.id;
		this.width = options.width;
		this.height = options.height;
		this.x = options.x;
		this.y = options.y;
		that.color = options.color;
		that.context = options.context;

		this.update = function() {
			that.context.fillStyle = that.color || "black";
			that.context.fillRect(that.x, that.y, that.width, that.height);
		}

		return this;
	}
}
