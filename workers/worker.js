var _x = 0;

self.onmessage = function(e) {
  console.log('Message received from main script');
  _x += e.data[0] * e.data[1];
  var workerResult = 'Result: ' + _x;
  console.log('Posting message back to main script');
  postMessage(workerResult);
}
