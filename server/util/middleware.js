function invalidEndpointHandler(req, res) {
    res.sendStatus(404);
}

function internalErrorHandler(err, req, res, next) {
    console.error(`[${new Date().toString()}] ERROR (${err.message})`);
    if (err.message === 'No Content') {
        return res.sendStatus(204);
    } else if (err.message === 'Not Found') {
        return res.sendStatus(404);
    } else if (err.message === 'Bad Request') {
        return res.sendStatus(400);
    } else if (err.name === 'MongoError' && err.code === 11000) {
        return res.status(409).send('ID Already Taken');
    } else {
        next(err);
    }
}

module.exports = {
    invalidEndpointHandler,
    internalErrorHandler
};