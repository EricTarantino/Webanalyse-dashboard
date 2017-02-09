(function(){

angular.module("router", ["ct.ui.router.extras"]);
	
angular.module("router").config(function($stateProvider, $stickyStateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {

	$urlRouterProvider.otherwise("/login");
	$urlMatcherFactoryProvider.caseInsensitive(true);
	
	var analyticsState;
	var analyticsStateAnalyticsGraph1;
	var kontoState;
	var loginState;
	var managementState;
	var managementState3dBar;
	var parentState;
	var postState;
	var registerState;
	var signoutState;
    var socialState;
    
    analyticsState = {
	    name: "analytics",
	    url: "/analytics",
	    views: {
	        "index-center": {
	            templateUrl: "/templates/management.ejs",
	        },
	        "index-analytics": {
	            templateUrl: "/templates/analytics.ejs",
	        }
	    } 
  	} 
  	loginState = {
	    name: "login",
	    url: "/login",
	    views: {
	    	"index-center": {
	    		templateUrl: "/templates/login.ejs"
	    	}
	    }
  	}        
  	managementState = {
	    name: "management",
	    url: "/management",
	    views: {
	       "index-center": {
	            templateUrl: "/templates/management.ejs",
	        },
	        "index-analytics": {
	            templateUrl: "/templates/analytics.ejs",
	        }
	    } 
  	}   
  	registerState = {
	    name: "register",
	    url: "/register",
	    views: {
	        "index-center": {
	    		templateUrl: "/templates/register.ejs",
	    		controller: "RegisterCtrl",
	        }
	    } 
  	}
  	signoutState = {
	    name: "signout",
	    url: "/signout",
	    views: {
	        "index-center": {
	            templateUrl: "/templates/signout.ejs",            
	        }
	    } 
  	}
  	socialState = {
	    name: "social",
	    url: "/social",
	    views: {
	        "index-center": {
	            templateUrl: "/templates/social.ejs",
	        }
	    }
  	}

	$stateProvider.state(socialState);
	$stateProvider.state(loginState);
	$stateProvider.state(registerState);
	$stateProvider.state(signoutState);
	$stateProvider.state(managementState);
	  	//this is a child state
	  	$stateProvider.state(managementState3dBar);
	$stateProvider.state(analyticsState);
	  	$stateProvider.state(analyticsStateAnalyticsGraph1);
	  	//$stateProvider.state(analyticsGraph1);
	  	//$stateProvider.state(analyticsGraph2);
	$stateProvider.state(postState);
	$stateProvider.state(kontoState);
	$stateProvider.state(parentState);
  
	var options = {enabled: true, requireBase: true,  rewriteLinks: true};
	  
	$locationProvider.html5Mode(options);
	  
	$stickyStateProvider.enableDebug(true);
  
});

})();