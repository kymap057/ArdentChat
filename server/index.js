let express = require('express');
let mongoose = require('mongoose');
let cors = require('cors');
let http = require('http');
let socketio = require('socket.io');
let router = require('./controller/users');
let config = require('./util/config');
let midware = require('./util/middleware');

mongoose.connect(config.URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log(`[${new Date().toString()}] Connected to MongoDB`))
    .catch((errorObject) => {
        console.error(`[${new Date().toString()}] ${errorObject.message}`);
        process.exit(1);
    });

let app = express();
app.use(cors());
app.use(express.json());
app.use('/api/users', router);
app.use(midware.invalidEndpointHandler);
app.use(midware.internalErrorHandler);

let server = http.createServer(app);
let io = socketio(server);
io.on('connection', socket => {
    socket.on('initializeSocket', ({ id }) => {
        console.log(id);
        socket.join(id);
    });
    socket.on('sendMessage', ({ ids, senderName, content, time }) => {
        socket.to(ids[0])
              .emit('receiveMessage', { ids, senderName, content, time });
        socket.to(ids[1])
              .emit('receiveMessage', { ids, senderName, content, time });
    });
    socket.on('error', error => console.log(error));
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => 
    console.log(`\n[${new Date().toString()}] Server listening on port ${PORT}`)
);