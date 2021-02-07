
const express=require('express');
const app=express();
const mongoose=require('mongoose');
const methodOverride=require('method-override');
const AppError=require('./AppError');
// const morgan=require('morgan');

//importing files from product.js in models directry
const Product=require('./models/product');

mongoose.connect('mongodb://localhost:27017/farmApp', {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log('MONGO CONNECTED');
})
.catch((e)=>{
    console.log('MONGO Error!!');
    console.log(e);
})

// app.set('views',path.join(_dirname,'views'));
app.set('views','views');
app.set('view engine','ejs');
//requiring method override


app.use(express.urlencoded({extended:true}))
//using method override middleware
app.use(methodOverride('_method'));

const categories=['fruits','vegetables','dairy']

app.get('/products',wrapAsync(async (req,res,next)=>{
    const products=await Product.find({});
    // console.log(products);
    // res.send('ok!');
    const {category}=req.query;
    if(category){
        //check whether req.body works fine
        const products=await Product.find({category})
        // console.log(products);
        res.render('products/index.ejs',{products,category});
    }
    else{
        const products=await Product.find({})
        // console.log(products);
        res.render('products/index.ejs',{products,category:'All'});
    }
    // console.log('This line also executes!!');
    // res.send('All products r here!!');
}))

//this one takes you to the forms
app.get('/products/new',wrapAsync((req,res)=>{
    // throw new AppError(401,'Not allowed');
    res.render('products/new',{categories});
}))

app.post('/products',wrapAsync(async (req,res)=>{
    const newPrd=new Product(req.body);
    await newPrd.save();  //This line takes time  so
    //await it
    res.redirect(`/products/${newPrd._id}`);
}))

//using below function to catch errors(if any) 
//and pass it to next function
function wrapAsync(fn){
    return function(req,res,next){
        fn(req,res,next).catch(e=> next(e));
    }
}

//to look for unique products
app.get('/products/:id',wrapAsync(async(req,res,next)=>{
    const {id}=req.params;
//req.body also works fine
const fnd=await Product.findById(id);
if(!fnd){
    throw new AppError(404,'Product not found');
    // return next(new AppError(404,'Product not found'));
    //if we give error code 101 the above line doesn't work
    // above line doesn't work in asynchronous functions
    // so use next
    // return next(new AppError(101,'Product not found'));
}
res.render('products/show',{fnd});
// res.send('details page');
}))



//first,we have to extract the product
app.get('/products/:id/edit',wrapAsync(async (req,res,next)=>{
        const {id}=req.params;
    const product=await Product.findById(id);
    if(!product){
        return next(new AppError(404,'Product not found'));
        //if we give error code 101 the above line doesn't work
        // above line doesn't work in asynchronous functions
        // so use next
        // return next(new AppError(101,'Product not found'));
    }
    res.render('products/edit',{product,categories});

}))
//updating product
//in form,we can't directly make a put request
//so, we have to use method override
app.put('/products/:id',wrapAsync(async(req,res,next)=>{
    const {id}=req.params; //shorter way of telling 
    //Below line includes old info also
    //so, we set new:true
    // const changedProd=Product.findByIdAndUpdate(id,req.body,{runValidators:true});
    const changedProd=await Product.findByIdAndUpdate(id,req.body,{runValidators:true,new: true});
    //findByIdAndUpdate doesn't run validation by default
    //so,we set it to true
    res.redirect(`/products/${changedProd._id}`)
    res.send('Put!!');
}))

//deleting products
app.delete('/products/:id',wrapAsync(async (req,res)=>{
    // res.send('you made it!');
    const {id}=req.params;
    const deletedProd= await Product.findByIdAndDelete(id);
    res.redirect('/products');
}))

////////////////////////////////////////////////////////////////////
//adding our customised error handling middleware
app.use((err,req,res,next)=>{
    const {status=500,message='Something wrong'}=err;
    res.status(status).send(message);
})
app.listen(3000,function(){
    console.log('App is listening on 3000');
})

