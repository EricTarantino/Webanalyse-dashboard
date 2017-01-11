(function(){

angular.module("router", ["ct.ui.router.extras"]);
	
angular.module("router").config(function($stateProvider, $stickyStateProvider, $urlMatcherFactoryProvider, $urlRouterProvider, $locationProvider) {

  $urlRouterProvider.otherwise("/login");
  $urlMatcherFactoryProvider.caseInsensitive(true);
  
  /*
  var homeState = {
    name: 'home',
    url: '/home',
    views: {
        'index-center': {
            templateUrl: '/templates/login.ejs',
            controller: 'materialHilfeController',
        }
    } 
  } 
  */
  
  var loginState = {
    name: "login",
    url: "/login",
    views: {
    	"index-center": {
    		templateUrl: "/templates/login.ejs",
    		/*controller: 'RegisterCtrl',*/
    	}
    }
  }  
      
  var registerState = {
    name: "register",
    url: "/register",
    views: {
        "index-center": {
    		templateUrl: "/templates/register.ejs",
    		controller: "RegisterCtrl",
        }
    } 
  }
  
  var signoutState = {
    name: "signout",
    url: "/signout",
    views: {
        "index-center": {
            templateUrl: "/templates/signout.ejs",            
        }
    } 
  }
      
  var managementState = {
    name: "management",
    url: "/management",
    views: {
       "index-center": {
            templateUrl: "/templates/management.ejs",
        },
        "index-analytics": {
            templateUrl: "/templates/analytics.ejs",
        }, 
        
        "index-northeast": {
            templateUrl: "/templates/datepicker.ejs",
            controller: "DatepickerCtrl",
        },
        "index-southeast": {
            templateUrl: "/templates/graphpicker.ejs",
            controller: "GraphpickerCtrl",
        }
    } 
  }
   
  var managementState3dBar = {
    name: "management.3dBar",
    url: "/3dBar",
    deepStateRedirect: true,
    sticky: true,
    views: {
        "management-graph": {
            templateUrl: "/templates/graphs/3dGraph.ejs",
            controller: "GraphCtrl",
        }
    }
  }
    
  var analyticsState = {
    name: "analytics",
    url: "/analytics",
    views: {
        "index-center": {
            templateUrl: "/templates/management.ejs",
        },
        "index-analytics": {
            templateUrl: "/templates/analytics.ejs",
        }, 
        "index-northeast": {
            templateUrl: "/templates/datepicker.ejs",
            controller: "DatepickerCtrl",
        },        
        "analytics-graph1": {
            templateUrl: "/templates/graphs/analyticsGraph1.ejs",
            controller: "analyticsGraphCtrl",
        }
    } 
  }
  
    var analyticsStateAnalyticsGraph1 = {
    name: "analytics.Graph1",
    url: "/Graph1",
    deepStateRedirect: true,
    sticky: true,
    views: {
        "analytics-graph1": {
            templateUrl: "/templates/graphs/analyticsGraph1.ejs",
            controller: "analyticsGraphCtrl",
        },
        "analytics-graph2": {
            templateUrl: "/templates/graphs/analyticsGraph2.ejs",
            controller: "analyticsGraphCtrl",
        },
        "analytics-graph3": {
            templateUrl: "/templates/graphs/analyticsGraph3.ejs",
            controller: "analyticsGraphCtrl",
        },
        "analytics-graph4": {
            templateUrl: "/templates/graphs/analyticsGraph4.ejs",
            controller: "analyticsGraphCtrl",
        }
    }
  }
  
  //TODO use graph router for analytics
  /*
  var analyticsGraph1 = {
    name: 'analytics.analyticsGraph1',
    url: '/analyticsGraph1',
    deepStateRedirect: true,
    sticky: true,    
    views: {
        'analyticsGraph1': {
            templateUrl: '/templates/graphs/analyticsGraph1.ejs',
            controller: 'analyticsGraphCtrl',
        }
    } 
  }
  
  var analyticsGraph2 = {
    name: 'analytics.analyticsGraph2',
    url: '/analyticsGraph2',
    deepStateRedirect: true,
    sticky: true,    
    views: {
        'analyticsGraph2': {
            templateUrl: '/templates/graphs/analyticsGraph2.ejs',
            controller: 'analyticsGraphCtrl',
        }
    } 
  }
  */
  var socialState = {
    name: "social",
    url: "/social",
    views: {
        "index-center": {
            templateUrl: "/templates/social.ejs",
        }
    }
  }
  
    var postState = {
    name: "hilfe",
    url: "/hilfe",
    views: {
        "index-center": {
            templateUrl: "/templates/hilfe.ejs",
        }
    }
  }
  
  var kontoState = {
    name: "konto",
    url: "/konto",
    views: {
        "index-center": {
            templateUrl: "/templates/konto.ejs",
        }
    }
  }
  
  var parentState = {
    name: "foo",
    url: "/foo",
    views: {
        "index-center": {
            template: "<a ui-sref=\".bar\" ui-sref-active=\"active\">bar</a> <a ui-sref=\"foo\" ui-sref-active=\"active\">foo</a> <div ui-view=\"bar\" ng-show=\"$state.includes(\"foo.bar\") />",
        }
    } 
  }

  var myStickyState = {
    name: "foo.bar",
    url: "/bar",
    deepStateRedirect: true,
    sticky: true,
    views: {
        "bar": {
            template: "<div>Foo Bar Stuff! </div> <div ui-view> <!-- foo.bar.* goes here --> </div>",
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
  	//this is a child state
  	$stateProvider.state(myStickyState);
  
  var options = {enabled: true, requireBase: true,  rewriteLinks: true};
  
  $locationProvider.html5Mode(options);
  
  $stickyStateProvider.enableDebug(true);
  
});

})();