var fs = require('fs');
var fname = process.argv[2];

var array = fs.readFileSync(fname).toString().split("\n");
var roads = [];
var cars = [];

var firstLineData = array[0].split(" ");

var rows = Number(firstLineData[0]),
    columns = Number(firstLineData[1]),
    vehicles = Number(firstLineData[2]),
    rides = Number(firstLineData[3]),
    bonus = Number(firstLineData[4]),
    steps = Number(firstLineData[5]);

for (var i = 0; i <= vehicles - 1;  i++) {
  cars[i] = {
    order_id: null,
    free_time: 0,
    orders: []
  }
}

for (var i = 1; i < array.length - 1; i++) {
  roads[i-1] = {
    start_x: array[i].split(" ")[0],
    start_y: array[i].split(" ")[1],
    finish_x: array[i].split(" ")[2],
    finish_y: array[i].split(" ")[3],
    start: array[i].split(" ")[4],
    end: array[i].split(" ")[5],
    len: Math.abs(array[i].split(" ")[0] - array[i].split(" ")[2]) + Math.abs(array[i].split(" ")[1] - array[i].split(" ")[3]),
    finished: false
  };
}

var orderCalculation = (car, step) => {
  console.log('INNNNN')
  var newOrders = roads.map((order) => {
    if (order.finished) {
      return -9999999999;
    }
    var carCoords = car.order_id == null ? [0,0] : [roads[car.order_id].finish_x, roads[car.order_id].finish_y];
    var dist = Math.abs(order.start_x - carCoords[0]) + Math.abs(order.start_y - carCoords[1]);
    var temp_points = step + dist <= order.start ? 2 : 0;
    var points = temp_points + order.len;
    var wait = order.start - (step + dist) < 0 ? 0 : order.start - step + dist;
    var endTime = step + dist + wait + order.len;
    points = endTime > order.end ? 0 : points;
    var indicator = points - wait - dist;
    // console.log(result);
    return indicator;
  });
  var best_order_id = newOrders.indexOf(Math.max(...newOrders));

  console.log(best_order_id);
  return best_order_id;
}

for (var step = 0; step <= steps; step++) {
  for (var i = 0; i <= cars.length - 1; i++) {
    if (cars[i].free_time == step) {
      var bestId = orderCalculation(cars[i], step);
      cars[i].order_id = bestId;
      cars[i].orders.push(bestId);
      roads[bestId].finished = true;
    };
  }
}

var fname = 'out.out';
var ress = cars.map((i)=>i);
cars.join("\n");
fs.open(fname, "w+", 0644, function(err, file_handle) {
	if (!err) {
	    fs.write(file_handle, ress, null, 'ascii', function(err, written) {
	        if (!err) {
	            console.log("Text write succesfully");
	        } else {
	            console.log("Write error!");
	        }
	    });
	} else {
		console.log("Open file error!");
	}
});

console.log(cars)

