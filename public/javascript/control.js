var app = angular.module('main',['ngRoute']);

/*app.service('userService', function(){
	this.name = "";
	this.img = "";
});*/

app.service('userService', function() {

    // variables
    var name = null;
    var img = null
                    
    return {
        // get compnay
        getname: function() {
            return name;
        },
        getimg: function(){
        	return img;
        },
        setname: function(val)
        {
        	name = val
        },
        // set company
        setimg: function(value) {
            img = value;
        }
    }
});
app.config(function($routeProvider)
{
	$routeProvider
	   .when('/',
	   {
	   	 templateUrl : '/view/search.html',
	   	 controller : 'getdata'
	   })
	   .when('/display',
	   {
	   	templateUrl : '/view/display.html',
	   	controller : 'getdata'
	   })

	   .when('/Previous',{
	   	 templateUrl : '/view/Previous_search.html',
	   	 controller : 'getdata'
	   })

	   .when('/contact',{
           templateUrl : '/view/contact.html'
	   })
	   .when('/confirm',{
          templateUrl : '/view/confirm.html'
	   })
	   .otherwise({
	   redirectTo: '/'
	   });
});

app.controller('getdata',function($scope,$http,userService,$location)
{
	$scope.initialize = function()
	{
		var data = {
			method : 'GET',
			url : 'http://localhost:8080/api/getdata',
            headers:{
            	'Accept':'application/json',
            	'Content-type' : 'application/json;charset=utf-8'
            }
		}

		$http(data).then(function success(response)
{
$scope.events = response.data;
var str = response.data.name;
var newstr = str.substring(0, str.indexOf("@"));
//console.log(newstr);
//userService.name = response.data.name;

userService.setname(str);

console.log(userService.getname());
},
function error(response)
{
	console.log("error");
});
	};


$scope.getimage = function(id)
	{
		userService.setimg(id);

$location.path("/display");
	};

	$scope.calculation = function(){
		var n = userService.getname();
		var p = userService.getimg();
		//console.log(n+" "+p);
		var add = n+'_'+p+'_';
		//console.log(add);
		var add_arr = [];
		if( p!= null)
		{
		for(var i=0;i<15;i++)
		{
			add_arr[i] = add+i+'.jpg';
		//	console.log(add_arr[i]);
		}
	}
		$scope.images = add_arr;
		//console.log($scope.images);
	}

});


	