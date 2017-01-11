/*eslint-env jquery */  
/*
var geschenkGutscheinBackground;
            
var flip = 0;    
            
var hamburger;
            
var closeicon;
*/

            
function toggleNavbar(){
	$(".smallnav").toggle();
}

 
/*
window.onresize = document.onload = function ( ) {  
                
	//Woooooow this function can nicely be done with a for-loop, this //would shorten the code in one line
                
	//get size of the desktop
	var wWidth = window.innerWidth;
	var widthString = String(wWidth) + "px";
	var object; 
	var object1;
	var element;
	var node;
                
	object = document.getElementById("firstFullBackgroundRow");             
                
	//set ratio for the first picture
	var heightStringFirstPic = String(Math.round(0.404 * wWidth)) + "px";
	var bgSizeFirstPic = widthString + " " + heightStringFirstPic;
                
	//choose first picture 
	object.style.backgroundRepeat = "no-repeat";
	object.style.backgroundImage = "url(img/fotos/001.jpg)";
                
	//scale first picture 
	object.style.backgroundSize = bgSizeFirstPic;
	object.style.paddingTop = heightStringFirstPic;
                
	//set the position to relative, so that the child element can be //absolute and therefore inside the element
	object.style.position = "relative";              
                
	//set ratio for the second picture
	var heightStringSecondPic = String(Math.round(0.268 * wWidth)) + "px";
	var bgSizeSecondPic = widthString + " " + heightStringSecondPic;
	object = document.getElementById("secondFullBackgroundContainer");
	object = document.getElementById("secondFullBackgroundContainer");
                
	//choose second picture 
	object.style.backgroundRepeat = "no-repeat";
	object.style.backgroundImage = "url(img/fotos/002grey.jpg)";
                
	//scale first picture 
	object.style.backgroundSize = bgSizeSecondPic;
	object.style.paddingTop = heightStringSecondPic;
                
	//set the position to relative, so that the child element can be //absolute and therefore inside the element
	object.style.position = "relative";                
                
	//set ratio for the Geschenkgutschein picture
	var heightStringGeschenkPic = String(Math.round(0.24 * wWidth)) + "px";
	document.getElementById("geschenkGutschein").style.height = heightStringGeschenkPic;
	document.getElementById("geschenkGutscheinBackground").style.height = heightStringGeschenkPic; 

	//if window is smaller than 700px, apply a different a layout
	if ( wWidth < 700 && ($("#smallDiv").length == 0 )){
		//use layoutLess700 function here
		//Erstelle einen Container und gib definiere Klassen- und Styleattribute
		var containerDiv = document.createElement("div"); 
		containerDiv.class = "container-fluid fullGrey";
		containerDiv.id = "smallDiv"; 
            
		//Erstelle eine Row und definiere Klassen- und Styleattribute
		var rowDiv = document.createElement("div"); 
		rowDiv.class = "row col-lg-10 col-md-10 col-sm-10 col-xs-12 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 textNatur";
                                        
		//Füge einen Textknoten zu der Row hinzu
		var textDiv = document.createElement("div"); 
		var newContent = document.createTextNode("Verschenke ein Erlebnis! Gönnen Sie sich etwas ganz Besonderes mit Ihren Liebsten."); 
                    
		//create the element that should be added
		textDiv.appendChild(newContent);
		rowDiv.appendChild(textDiv);
		containerDiv.appendChild(rowDiv);
                    
		//Füge das neu erstellte Element und seinen Inhalt ins DOM ein
		$("#testid").after(containerDiv);
                    
		//save the object for later
		geschenkGutscheinBackground = $("#geschenkGutscheinBackground");
		$("#geschenkGutscheinBackground").hide();
	}                 
                
                
	$("#smallNav").toggle(false);
                
	if ( wWidth < 1000) {
		$("#eLeistungKlein").toggle(true);
		$("#eLeistung").toggle(false);
		$("#eContact").toggle(false);
		$("#containerEContactSmall").toggle(true);
		$("#topnav").toggle(false);
		$("#hamburger").toggle(true);
	}
                
	if ( wWidth >= 700 ) {
		$("#geschenkGutscheinBackground").show();
		$("#smallDiv").remove();
		$("#eLeistungKlein").toggle(false);
		$("#eLeistung").toggle(true);
		$("#eContact").toggle(true);
		$("#containerEContactSmall").toggle(false);
		$("#topnav").toggle(true);
		$("#hamburger").toggle(false);
	}
}
*/