
function PortContext(port) {
	this.port = port;
	this.ports.push(port);
}

PortContext.prototype.ports = [];

PortContext.prototype.broadcast = function(data) {
	this.ports.forEach(function(port) {
		port.postMessage(data);
	}, this);
};

PortContext.prototype.get_ports_count = function(data) {
	this.port.postMessage({
		type: "get_ports_count",
		value: this.ports.length
	});
};

PortContext.prototype.die = function() {
	this.port.close();
	this.ports.splice(this.ports.indexOf(this.port), 1);
};

function broadcast(data) {
	_ports.forEach(function(p) {
		p.postMessage(data);
	});
};

self.addEventListener("connect", function(connection) {
	var port = connection.ports[0];

	port.onmessage = function(context) {
		return function(e) {
			if (e.data) {
				context[e.data.type](e.data);
			}
		};
	}(new PortContext(port));

	port.start();
});
