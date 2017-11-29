var localstrategy = require('passport-local').Strategy;
var User = require('../app/authentication/model/passport');

module.exports = function(passport)
{
   //console.log(password);
	passport.serializeUser(function(user,done)
	{
		done(null,user.id);
	});

	passport.deserializeUser(function(id,done)
	{
		User.findById(id,function(err,user)
		{
			done(err,user);
		});
	});

	passport.use('local-signup',new localstrategy({
   usernameField: 'email',
		passReqToCallback: true 

	},
	function(req,email,password,done){
                  
         process.nextTick(function(){ 
         	User.findOne({'local.email': email}, function(err,user)
         	{
         		if(err)
         			return done(err);
         		if(user){
         			return done(null,false,req.flash('signupMessage', 'That email is already taken'));
         		}   
         		else{
                     
         			var newUser = new User();
         			newUser.local.email = email;
         			newUser.local.password = newUser.generateHash(password);
                  //newUser.local.password = password;




         			newUser.save(function(err)
         			{
         				if(err)
         					throw err;

         				return done(null,newUser,req.flash('loginMessage','Successfully Signed up'));
         			})
         		}
         	})
         })
	}
	));

   passport.use('local-login', new localstrategy({

 usernameField: 'email',
 passwordField: 'password',
      passReqToCallback: true 
   },
        function(req,email,password,done)
        {
         process.nextTick(function()
         {
            User.findOne({'local.email' : email}, function(err,user){
                         
                      if(err){
                          return done(err);
                           }
                          if(!user)
                          {    
                           return done(null,false,req.flash('loginMessage','No User found'));
                              }
                         if(!user.validPassword(password)){
                           return done(null,false,req.flash('loginMessage','invalid password'));
                         }
                         return done(null,user);
            })

         })

        }

   ))
};