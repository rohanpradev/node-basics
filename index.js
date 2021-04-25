//#region Node Event Loop

/**
 * Event Loop
 *
 *      timers: this phase executes callbacks scheduled by setTimeout() and setInterval().
 *      pending callbacks: executes I/O callbacks deferred to the next loop iteration.
 *      idle, prepare: only used internally.
 *      poll: retrieve new I/O events; execute I/O related callbacks (almost all with the exception of close
 *            callbacks, the ones scheduled by timers, and setImmediate());
 *            node will block here when appropriate.
 *      check: setImmediate() callbacks are invoked here.
 *      close callbacks: some close callbacks, e.g. socket.on('close', ...).
 *
 */

// const util = require('util');
// const fs = require('fs');
// const crypto = require('crypto');

// const readFile = util.promisify(fs.readFile);
// const start = Date.now();
// setTimeout(() => console.log('Timer 1 finished'), 0);
// setImmediate(() => console.log('Immediate finished'));

// const path = `${__dirname}/test.txt`;

// readFile(path, 'utf-8')
//   .then(() => {
//     console.log('I/O finished');
//     console.log('--------------------');
//     setTimeout(() => console.log('Timer 2 finished'), 0);
//     setTimeout(() => console.log('Timer 3 finished'), 3000);
//     setImmediate(() => console.log('Immediate 2 finished'));
//     process.nextTick(() => console.log('Process.nextTick'));

//     crypto.pbkdf2('password', 'salt', 10000, 1024, 'sha512', (err, res) =>
//       console.log(Date.now() - start, ' Password encryrpted', res.toString())
//     );
//   })
//   .catch((err) => console.warn(err));

// console.log('Hello from the top level code!');

//#endregion

//#region Event Driven Architecture

/** CUSTOM EVENTS */

// const EventEmitter = require('events');

// class Sales extends EventEmitter {
//   constructor() {
//     super();
//   }
// }

// const myEmitter = new Sales();

// myEmitter.on('sale', () => console.log('There was a new sale!!'));
// myEmitter.on('sale', () => console.log('customer: Rohan'));
// myEmitter.on('billing', (amt) => console.log('Billed for : ', amt));

// myEmitter.emit('sale');
// myEmitter.emit('billing', '$2500');

/** HTTP EVENTS */

// const http = require('http');

// const server = http.createServer();

// server.on('request', (req, res) => {
//   console.log('Request received'); // Appears twice
//   console.log(req.url); // because browser sends 2 requests ('/' and '/favicon.ico')
//   res.end('Request received');
// });

// server.on('close', (req, res) => {
//   console.log('Closing');
// });

// server.listen(8000, '127.0.0.1', () => console.log('Waiting for requests...'));

//#endregion

//#region STREAMS

// const http = require('http');
// const fs = require('fs');

// const server = http.createServer((req, res) => {
//   const stream = fs.createReadStream(`${__dirname}/test.txt`);
//   stream.pipe(res);
// });

// server.listen(8000);

// const fs = require('fs');
// const server = require('http').createServer();

// server.on('request', (req, res) => {
//   // Solution 1: load entire data into memory and then return complete result
//   // fs.readFile(__dirname + '/test.txt', (err, data) => {
//   //   if (err) console.log(err);
//   //   res.end(data);
//   // });

//   // Solution 2  Streams: handles data chunk by chunk rather than entire data

//   // const readable = fs.createReadStream(__dirname + '/test.txt');

//   // readable.on('data', (chunk) => {
//   //   res.write(chunk);
//   // });

//   // readable.on('error', (err) => {
//   //   console.log(err);
//   //   res.statusCode = 500;
//   //   res.end('File not found');
//   // });

//   // readable.on('end', () => {
//   //   res.end();
//   // });

//   // Solution 3

//   const readable = fs.createReadStream(__dirname + '/test.txt');
//   readable.pipe(res);
// });

// server.listen(8000);

//#endregion

//#region STREAM YOUR OWN VIDEO

const express = require('express');
const app = express();
const fs = require('fs');

app.get('/video', (req, res) => {
  const range = req.headers.range;
  if (!range) res.status(400).send('Requires range header');

  const videoPath = 'bigbuck.mp4';
  const videoSize = fs.statSync(__dirname + `/${videoPath}`).size;

  const CHUNK_SIZE = 10 ** 6;
  const start = Number(range.replace(/\D/g, ''));
  const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

  const contentLength = end - start + 1;
  const headers = {
    'Content-Range': `bytes ${start}-${end}/${videoSize}`,
    'Accept-Ranges': 'bytes',
    'Content-Length': contentLength,
    'Content-Type': 'video/mp4',
  };

  res.writeHead(206, headers);
  const videoStream = fs.createReadStream(__dirname + `/${videoPath}`, { start, end });

  videoStream.pipe(res);
});

app.listen(3000, () => console.log('Server running on port 3000...'));

//#endregion
