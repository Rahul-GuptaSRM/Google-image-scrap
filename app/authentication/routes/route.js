var User = require("../model/passport");
var Scraper = require ('images-scraper');
var Jimp = require("jimp");
module.exports=function(app,passport)
{

   
/*----------------login-----------------------*/
	app.get('/ejs/login.ejs',function(req,res)
	{
    res.render('../ejs/login.ejs',{message:req.flash('loginMessage')});
           
	});
 
	app.post('/ejs/login.ejs',passport.authenticate('local-login',{
     successRedirect: '/main.html',
         failureRedirect: '/ejs/login.ejs',
         failureflash: true 
  }))
/*------------end of login-------------*/
/*--------------- signup----------------*/ 
  app.get('/ejs/signup.ejs',function(req,res)
{
  res.render('../ejs/signup.ejs',{message:req.flash('signupMessage')});
});

app.post('/ejs/signup.ejs', passport.authenticate('local-signup', {
      
         successRedirect:'/ejs/login.ejs',
         failureRedirect: '/ejs/signup.ejs',
         failureflash: true 
     }));
/*-----------------end of sign up -------------*/

 app.get('/main.html',isLoggedIn,function(req,res)
   {
res.render('../public/view/main.html',{user: req.user});
   });


app.get('/hello',isLoggedIn,function(req,res)
{
var p = req.param('email');

var name = req.user.local.email
var str = name;
var check =1;
User.findOne({'local.email': name}, function(err,user)
          {
            if(err)
              return done(err);
              
            else{
              var len = user.search.length;
/*----checking if user search the same thing that he has previously searched...then no need to store the name of search.But the images will be saved on the basis of new search.----*/
              for(var i=0;i<len;i++)
              {
                if(p == user.search[i])
                {
                  check = 0;
                  break;
                }
              }
              /*-----------------------------------------------------*/
              if(check == 1)
              {
                 user.search.push(p);
                  user.save(function(err)
              {
                if(err)
                  throw err;
               console.log(user);
              })
                }
               
               }     
             
          })

 var google = new Scraper.Google();

 google.list({
    keyword: p,
    num: 20,
    timeout: 10000,
    detail: true,
    nightmare: {
        show: false
    }
})
.then(function (res) {
  for(var i=0;i<20;i++)
  {

  var j =0;
Jimp.read(res[i].url, function (err, lenna) {

    if(lenna != undefined && j<15)
    {
    lenna.resize(256, 256)            // resize 
        .quality(60)                 // set JPEG quality 
         .greyscale()                 // set greyscale 
  /*--------to make the uniqe name for very image. I have combined username + search_item + number(like 0,1,2)--*/
         .write('container/'+name+"_"+p+"_"+j+'.jpg');
         j++; // save 
       }
});

 
}
}).catch(function(err) {
    console.log('err', err);
});


res.redirect('main.html#!/confirm');/*-------redirecting for the confirmation -----------*/
});
/*---------------api to put the username and searched name on url endpoint ------------*/
app.get('/api/getdata',isLoggedIn,function(req,res)
{
  var name = req.user.local.email;
User.findOne({'local.email': name}, function(err,user)
          {
            if(err)
              res.send(err);
              
            else{
              var _data = {
                search : user["search"],
                name : user.local.email
              }
         res.send(_data);
               
               }     
          //  }
             
          })


})


app.get('/logout',function(req,res)
{
  res.clearCookie("username");
  res.clearCookie("img");
req.logout();
res.redirect('/');

})
};
 function isLoggedIn(req,res,next)
 {
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/ejs/login.ejs');
 }