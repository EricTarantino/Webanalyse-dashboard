/*eslint-env jquery */    	
$("#menu-toggle").click(function(e) {
	//in the case of sufficient window size, toggle the sidenav. Else, the angular sidenav will be used
	if( window.innerWidth > 1200){
   		e.preventDefault();        	    
   		//toggles the class attribute toggle by adding or removing it
   		$("#wrapper").toggleClass("toggled");        	
   		if (this.value=="Menu ausblenden") this.value="Menu einblenden";
		else this.value="Menu ausblenden";    		  
		var src = ($(this).attr('src') === "/icon/right_circle.png") ? "/icon/left_circle.png" : "/icon/right_circle.png";
   		$(this).attr('src', src);  
   	}
});

function closeCSSSideBar() {
	//removes the class attribute toggled from the wrapper. The sidebar is then closed.
	$("#wrapper").toggleClass("toggled", true); 
	var src = "/icon/right_circle.png";
   	$("#menu-toggle").attr('src', src); 
}

//blend out menu if the user changes the browser size
$( window ).resize(function() {
	//in the case of sufficient window size, toggle the sidenav
	if( window.innerWidth <= 1200){
		//removes the class attribute toggled from the wrapper. The sidebar is then closed.
		$("#wrapper").toggleClass("toggled", true); 
		var src = "/icon/right_circle.png";
   		$("#menu-toggle").attr('src', src);  
   	//if the window size is too small, use the angular sidenav
   	}  
   	//if( window.innerWidth <= 1100){
   	// 	$("#smallNavBlendInAtLogin").css( "display", "block");
   	//}
   	if( window.innerWidth > 1100){
   	 	$("#smallNavBlendInAtLogin").css( "display", "none");
   	}
});