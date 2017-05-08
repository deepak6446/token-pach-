var express      = require('express');
var app			 = express();
var bodyParser   = require('body-parser');
var morgan       = require('morgan');
var jwt          = require('jsonwebtoken');
var port  		 = 3000;
var user = [{"user":"deepak","pass":"deepakkk"}];

//use body-parser so that we can get information from post and/or url parameters
//when false the body object can contain only string or arrray 
//,when true it can contain any type
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// use morgan to log requests to the console
app.use(morgan('dev'));

app.get('/', function(req, res) {
    res.send('Hello! The API is at http://localhost:' + port + '/api');
});

//defining a middleware to Protrect our api

app.use('/api',function(req,res,next){
	 var token = req.body.token|| req.headers['x-access-token'];
	 console.log(token);
	 if(token){
		 jwt.verify(token,'myprivatekey',function(err,decoded){
		 	if(err){
		 		return res.json({success:false,msg:'failed to authenticate the token'});
		 	}
		 	else{
		 		// if everything is good, save to request for use in other routes
	        	req.decoded = decoded;    
	            next();
		 	}
		 });
	  }
	  else{
	  	 // if there is no token
	     // return an error
	     return res.status(403).send({ 
	         success: false, 
	        message: 'No token provided.' 
	    });
	  }	 
});
app.get('/api/',function(req,res){
	res.json({"msg":"wlcome user"});
});

app.get('/api/users',function(req,res){
	res.json(user);
});

//send token to user if user is authentic else send message that user not found
app.post('/api/auth',function(req,res){
	var flag=0;
	console.log(user);
    for(a in user){
    	if(user[a].user == req.body.name){
    		var token = jwt.sign(user[a],'myprivatekey', {
          expiresIn: 1440 // expires in 24 hours
        });
    		res.json({success:true,msg:"gotcha token",token:token});
    		flag=1;	
    	}

    }
    if(flag==0){
    	res.json({"msg":"name not present"});
    }
    
});

app.listen(port,function(){
	console.log("checkout : localhost:3000");
});