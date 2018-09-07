function Force(a1, a2) {
	this.x = 0;
	this.y = 0;

	this.add = function(force) {
		this.x -= force.x;
		this.y -= force.y;
	};

	if (arguments.length == 2) {
		var dx = a2.x - a1.x;
		var dy = a2.y - a1.y;
		var d = Math.sqrt(dx*dx + dy*dy);

		var sin_a = dx/d;
		var sin_b = 1 - sin_a;

// 		console.log(sin_a, sin_b);

		var f = d == 0 ? 0 : 1/d - 1/(d*d);
		var fy = f * sin_a;
		var fx = f * sin_b;

		function sign(v) {
			return v == 0 ? 1 : -(v/-v);
		}

		this.x = sign(dx) * Math.abs(fx);
		this.y = sign(dy) * Math.abs(fy);
// 		console.log(dx, dy, d, f, this);
	}
}

function Athom(x, y) {
	this.id = ++Athom.id;
	var _d = Athom.R * 2;
	var _force = new Force();

	this.x = x;
	this.y = y

	this.next_point = function() {
		return {
			x: this.x + _force.x,
			y: this.y + _force.y
		}
	};

	this.move = function() {
		var p = this.next_point();
		this.x = p.x;
		this.y = p.y;
	};

	this.draw = function() {
		stroke(255);
		ellipse(this.x, this.y, _d, _d);
		stroke(0, 255, 0);
		line(this.x, this.y, this.x + _force.x * 1000, this.y + _force.y * 1000);
		stroke(0, 255, 255);
		text(this.id, this.x + 3, this.y - 3);
	};

	this.push = function(force) {
		_force.add(force);
	};

	this.affect = function(athom) {
		if (this.id == athom.id) {
			return;
		}

		var force = new Force(this, athom);
		_force.add(force);
	};

	this.reset = function() {
		_force = new Force();
	};

	this.will_collide = function(other) {
		var next_point = this.next_point();
		return dist(next_point.x, next_point.y, other.x, other.y) <= _d
	};
}

Athom.R = 10;
Athom.id = 0;

function View() {
	var _resolution = [];

	this.setup = function(width, height) {
		_resolution = [width, height];
		createCanvas(width, height);
	}

	this.is_visible = function(located) {
		return located.x <= _resolution[0] && located.y <= _resolution[1];
	}
}

var athoms = [];
var view = new View();
var WIGHT = 800;
var HEIGHT = 600;

function setup() {
// 	frameRate(10);
	view.setup(WIGHT, HEIGHT);

	for (var i = 0; i < 2; ++i) {
		athoms.push(new Athom(random(WIGHT - Athom.R), random(WIGHT - Athom.R)));
	}
}

function mousePressed() {
	var athom = new Athom(mouseX, mouseY);
	athoms.push(athom);
}

function full_pass(callback) {
	athoms.forEach(function(first) {
		athoms.forEach(function(second) {
			if (first.id != second.id) {
				callback(first, second);
			}
		});
	});
}

function draw() {
	athoms.forEach(function(first) {
		first.reset();
		athoms.forEach(function(second) {
			first.affect(second);
		});
	});

	athoms.forEach(function(first) {
		athoms.forEach(function(second) {
			if (!first.will_collide(second)) {
				first.move();
			}
		});
	});

	background(0, 0, 0);
	athoms.forEach(function(athom) {
		if (view.is_visible(athom)) {
			athom.draw();
		}
	});
}
