 var app = angular.module('main', ['ngRoute', 'ngStorage']);


/*-------------ng-routing----------------*/
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
/*----------------------end of ng-routing-------------------*/
app.controller('getdata',function($scope,$http,$location,$localStorage)
{
	$scope.initialize = function()
	{
		var data = {
			method : 'GET',
			url : '/api/getdata',
            headers:{
            	'Accept':'application/json',
            	'Content-type' : 'application/json;charset=utf-8'
            }
		}

		$http(data).then(function success(response)
{
$scope.events = response.data;
$localStorage.username = response.data.name;

//userService.setname(str);
},
function error(response)
{
	console.log("error");
});
	};


$scope.getimage = function(id)
	{
		console.log(id);
		$localStorage.img = id; //putting the clicked search in local storage. In case if user reload the browser, the clicked search would not get lost 


$location.path("/display"); //after clicking  on search, shift to do a display page
	};

	$scope.calculation = function(){
		var n = $localStorage.username;
		var p = $localStorage.img
	     if(p == undefined)
	    {
		var add = n+'_'+p+'_';
		var add_arr = [];
		if( p!= null)
		{
		for(var i=0;i<15;i++)
		{
			add_arr[i] = add+i+'.jpg';
		}
	}
}
		$scope.images = add_arr;
	}

});


	