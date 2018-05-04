const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose');
const user = require('./routes/user-route');
const record = require('./routes/record-route')

const app = express()

const PORT = 8081;

app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

mongoose.connect('mongodb://admin:admin@ds227199.mlab.com:27199/dashboard');

// further development
app.post('/verify', (req, res) => {
    res.send(
    [{
        token: "token"
    }]
)
})

app.use('/user', user);
app.use('/record', record);

app.listen(PORT, function(){
    console.log('Server is running on Port',PORT);
});