const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const { MONGOURI } = require('./keys');
mongoose.connect(MONGOURI, {useNewUrlParser: true,  useCreateIndex: true, useUnifiedTopology: true});
mongoose.connection.on('connected',() =>{
    console.log("Connected to MongoDB!!!")
})

mongoose.connection.on('error',(err) =>{
    console.log("Error Connecting!!!",err)
})


const usersRouter = require('./routes/users');
app.use('/users', usersRouter);

const productRouter = require('./routes/products');
app.use('/products', productRouter);


app.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
})