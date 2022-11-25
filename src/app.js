const express = require('express');
const app = express();
const helmet = require('helmet')
const morgan = require('morgan')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const cors = require('cors')

//init dbs 
require('./v1/databases/init.mongodb')
require('./v1/databases/init.redis')

//user middleware
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:['http://localhost:3000','https://admin-page-6vbf.vercel.app'],
    credentials: true
}))
app.set("trust-proxy",1)
app.use(helmet())
app.use(morgan('combined'))
// compress responses
app.use(compression({
    level:6,
    threshold:100 * 1024,
    filter: (req, res) => {
        if(req.headers['x-no-compress']){
            return false
        }
        return compression.filter(req, res)
    }
}))



//router
app.use('/v1',require('./v1/routes/index.router'))

// Error Handling Middleware called

app.use((req, res, next) => {
    const error = new Error("Not found");
    error.status = 404;
    next(error);
});


// error handler middleware
app.use((error, req, res, next) => {
    res.status(error.status || 500).send({
        error: {
            status: error.status || 500,
            message: error.message || 'Internal Server Error',
        },
    });
});

module.exports = app;