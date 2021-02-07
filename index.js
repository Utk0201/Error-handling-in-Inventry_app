const { query } = require('express');
const express=require('express');
const app=express();
const morgan=require('morgan');
const AppError=require('./AppError');

// app.use(morgan('tiny'))    //telling express to use "morgan" middleware on every request

//we can also use different property other than "tiny"
// app.use(morgan('common'));

// app.use((req,res,next)=>{
//     // res.send('Morgan ka kata!!');
//     console.log('Morgan bach gya!!!');
//     next();
// })

// app.use((req,res,next)=>{
//     req.requestTimee=Date.now();    //defined a new property in request
//     console.log(req.method.toUpperCase(),req.path);
//     next();
// })

//below middleware runs only on path /dogs
// app.use('/dog',(req,res,next)=>{
//     console.log('I hate dogs');
//     next();
// })

//Below middleware applies to every route
//However,if we want middleware for specific routes,a better
//option is indicated below this middleware
// app.use((req,res,next)=>{
//     // console.log(req.query);
//     const {passwd}=req.query;
//     if(passwd==='Utkarsh'){
//         next();
//     }
//     res.send('Please enter correct password!!');
// })

//better option
const verify=(req,res,next)=>{
    const {paswd}=req.query;
    if(paswd==='Utkarsh'){
        next(); //command executes below lines and 
        //takes us back to app.get('/')
    }
    // res.status(401);    //sends status code of error
    // res.send('Please enter the correct password!');
    // throw new Error('Correct Password required');
    throw new AppError(401,'Password required');
}

//This callback function runs only if "verify" allows it to do so 
app.get('/secret',verify,(req,res)=>{
    res.send('Working fine');
})

app.get('/',(req,res)=>{
    console.log(`Request time: ${req.requestTime}`);
    res.send('Home page');
})

app.get('/dog',(req,res)=>{
    // console.log(req.requestTimee);  //used the property that I defined earlier
    res.send('Bhow Bhow!!');
})

app.get('/error',(req,res)=>{
    chicken.fly();
})

//below app.use is used after all other app.use functions
//also,it should contain 4 arguments
// app.use((err,req,res,next)=>{
//     console.log("**********************");
//     console.log("*********ERROR********");
//     console.log("**********************");
//     // res.status(500).send("We got an error!!");//if we don't write this line, server keeps on loading
//     next(err); //if nothing is passed as argument in next
//     //it calls next middleware automatically
//     console.log(err);
// })

app.get('/admin',(req,res)=>{
    //this throws an error with a message and a value 
    //to the AppError
    throw new AppError(403,'you r not the admin!!');
})

app.use((err,req,res,next)=>{
    // const {status=500}=err; //adding default value so that
    //chicken undefined error passes some value
    //normal error doesn't have status but since we're
    //defining here, our error gets a value
    // res.status(status).send("Shit!! error!!");
    const {status=501,message='Got error!!'}=err;
    res.status(status).send(message);
    // throw new AppError(status,message);
})

// app.use((req,res)=>{
//     res.status(404).send("Content not found"); //set status to 404 and then send
// })

app.listen(3000,()=>{
    console.log('Listening @ 3k');
})