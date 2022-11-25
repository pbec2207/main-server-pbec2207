const mongoose = require('mongoose')

//connect mongoose
mongoose.connect(
  //process.env.MONGO_URI,
  `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.9acpmc3.mongodb.net/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
  { 
    useNewUrlParser: true, 
    autoIndex: true
 }).then( _ => console.log('Connected mongoose success!...'))
.catch( err => console.error(`Error: connect:::`, err))

// all executed methods log output to console
mongoose.set('debug', true)
    
// disable colors in debug mode
mongoose.set('debug', { color: false })

// get mongodb-shell friendly output (ISODate)
mongoose.set('debug', { shell: true })


module.exports = mongoose;