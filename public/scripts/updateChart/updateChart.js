//this script must be loaded before angular, since it is jquery.
//This uploads the graph and expects a data array as a parameter



//TODO choose graph to update here and get graph name from server as well

function getScope(ctrlName) {
    	var sel = 'div[ng-controller="' + ctrlName + '"]';
    	return angular.element(sel).scope();
}

function loadChart1(){
		var chart=$("#containerChAnalyticsGraph1").highcharts();
		chart.showLoading();
}

function setUpChart(containerID, type) { //, startDate, endDate, source
	
		var chart = null;
		//var titleText = ""+startDate+" bis "+endDate;
		//var subtitleText = "Quelle: "+source;
		//alert("type is:"+type)
		if(type === "3D Bar"){
			//alert("Set up 3D Bar")
		    // Set up the chart depending on chart type
		    chart = new Highcharts.Chart({
		        chart: {
		        	renderTo: containerID,
		            type: 'column',
		            options3d: {
		                enabled:true,
		                alpha: 15,
		                beta: 15,
		                depth: 50,
		                viewDistance: 25
		            }
		        }/*,
		        title: {
		            text: titleText
		        },
		        subtitle: {
		            text: subtitleText
		        }*/,
		        plotOptions: {
		            column: {
		                depth: 25
		            }
		        }/*,
		        xAxis: {
		            min: 1
		         }*/,
		        series: [{
		            data: [],
		            name: "Views"
		        }]
		    });
		}
		
		else if(type==="Linie mit Labeln"){
			//alert("Linie mit Labeln")
			chart = new Highcharts.Chart({
		        chart: {
		        	renderTo: containerID,
		            type: 'line'/*,
		            options3d: {
		                enabled:false,
		                alpha: 15,
		                beta: 15,
		                depth: 50,
		                viewDistance: 25
		            }*/
		        },/*
		        title: {
		            text: titleText
		        },
		        subtitle: {
		            text: subtitleText
		        },
		        plotOptions: {
		            column: {
		                depth: 25
		            }
		        },
		        xAxis: {
		            min: 1
		         },*/
		        series: [{
		            data: [],
		            //name: "Views"
		        }]
		    });		
		}
		
		else if(type==="Buntes Säulendiagramm"){
			//alert("Buntes Säulendiagramm")
			chart = new Highcharts.Chart({
		        chart: {
		        	renderTo: containerID,
		            /*,type: 'bar'
		            options3d: {
		                enabled:false,
		                alpha: 15,
		                beta: 15,
		                depth: 50,
		                viewDistance: 25
		            }*/
		        },/*
		        title: {
		            text: titleText
		        },
		        subtitle: {
		            text: subtitleText
		        },
		        plotOptions: {
		            column: {
		                depth: 25
		            }
		        },
		        xAxis: {
		            min: 1
		         },*/
		        series: [{
		            data: []
		        }]
		    });
		}		
		return chart;		
}


//takes data array plot information and chart ID as parameters
function updateChart(_graph) {

		//get the name and dashboard and plot data, 
		//the chart id matches the dashboard_graphname key
		//as it is created in this way in the template
		//for now, just alert the data
		//alert("you updated the graph, it is: "+ JSON.stringify(graph));
		var graph = JSON.parse(_graph)
		var containerID = ""+graph.dashboard +"_"+graph.name;

		//var test = false; 
		//alert("xplot: "+graph.xplot)	
		///alert("yplot: "+graph.yplot)
		//create the chart
		
		//alert("updateChart container id for set up: " + containerID)
		//alert(graph.graph)
		//containerID, type, xTitle, yTitle, startDate, endDate, source
		//var chart = setUpChart(containerID, graph.graph.toString(), graph.startDate, graph.endDate, "Webtrends")
		var chart = setUpChart(containerID, graph.graph.toString())

	
		//Fill in the data into the chart
		
		/*
		
		//update management Chart
		//if(!test){
	    var jqueryAdress = "#"+containerID;
		
		//var chart=$(containerID).highcharts();
		
		//var chart=$(jqueryAdress).highcharts();
		
		
		//} else {	
			//update chart 1
		//var chart=$("#containerChAnalyticsGraph1").highcharts();
		//}
		//alert("id 1: "+containerID)
		//alert("data in update chart "+JSON.stringify(graph))
		//var gr = JSON.stringify(graph)
		//var _containerID = "#"+gr.dashboard+"_"+gr.selectedName;
		//alert("chart "+chart.type)
		//alert("chart type "+chart.type)
		//var integerArray = [ JSON.parse(data).yAxis ];*/
		try{
			var str = graph.yplot.toString();
			//alert("y in update "+str)
			var _res = str.split(",");
			var res = [];
			//alert("res1: "+res)
			//alert("str.split 1 "+str);	
			//alert("iArray1: "+integerArray);			
			for( var i = 0; i < _res.length; i++ ) {
				res.push(parseInt( _res[i], 10 ));
			}
			//alert("after split: "+res);			
			//http://jsfiddle.net/4tuvC/
			//chart.xAxis[0].setCategories(data[0]);
			//chart[0].xAxis[0].update(data["xAxis"], true);
			
			//chart.series[0].setData( res ,true);
					
			chart.addSeries({
	                data: res
	        })
			
			/*
			////////////////////////////////////////////////////////
			//plot labels
			////////////////////////////////////////////////////////
			//var stringArray = [ JSON.parse(data).xAxis ];
			str = graph.xplot.toString()
			//str = JSON.parse(graph).xplot.toString();
			//alert("xplot in try: " + str)
			var _res = str.split(",");
			//alert("str.split: 2" + _res)
			/*alert("res1: "+res)*/		
			//http://jsfiddle.net/4tuvC/
			
			
			
			
			//chart.xAxis[0].setCategories(_res);
			//chart[0].xAxis[0].update(res, true);
			
			
			
			
		} catch (e){
			//alert("made a mistake")
		}
}	
	
	
/*
function updateChart1(data) {	
	
		var chart=$("#containerChAnalyticsGraph1").highcharts();
				
		var integerArray = [ JSON.parse(data).yAxis ];
		
		var str = JSON.parse(data).yAxis.toString();
		var res = str.split(",");
		//alert("res1: "+res)
		
		//alert("iArray1: "+integerArray);
		
		for( var i = 0; i < res.length; i++ ) {
			res[i] = parseInt( res[i], 10 );
		}
						
		//alert(res);
		//http://jsfiddle.net/4tuvC/
		//chart.xAxis[0].setCategories(data[0]);
		//chart[0].xAxis[0].update(data["xAxis"], true);
		
		chart.series[0].setData( res ,true);
		
		////////////////////////////////////////////////////////
		//plot labels
		////////////////////////////////////////////////////////
		var stringArray = [ JSON.parse(data).xAxis ];
		
		str = JSON.parse(data).xAxis.toString();
		res = str.split(",");
		
		var str1 = JSON.parse(data).yAxis.toString();
		var res1 = str.split(",");
		
		/*
		alert("res1: "+res)
		
		
		//http://jsfiddle.net/4tuvC//*
		//chart.xAxis[0].setCategories(res1);
		//chart[0].xAxis[0].update(res, true);

//}*/	