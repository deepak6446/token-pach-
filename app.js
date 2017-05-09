var app = angular.module('myApp',[]);

app.controller('myCntrl',function($scope,$http){

	$scope.getusers=function(){
		console.log("in getusers");
		$http
			.get("/api/users")
			.then(function(res){
				console.log(res.data);
			},function(err){
				console.log(err);
			});
	}

});