/*eslint-env jquery */  
function toggleNavbar() {
    $(".smallnav").toggle();
}

window.onresize = document.onload = function () {
    const wWidth = window.innerWidth;
    const widthString = `${wWidth}px`;

    const setBgImageStyle = (elementId, imgUrl, ratio) => {
        const element = document.getElementById(elementId);
        const heightString = `${Math.round(ratio * wWidth)}px`;
        const bgSize = `${widthString} ${heightString}`;

        element.style.backgroundRepeat = "no-repeat";
        element.style.backgroundImage = `url(${imgUrl})`;
        element.style.backgroundSize = bgSize;
        element.style.paddingTop = heightString;
        element.style.position = "relative";
    };

    setBgImageStyle("firstFullBackgroundRow", "img/fotos/001.jpg", 0.404);
    setBgImageStyle("secondFullBackgroundContainer", "img/fotos/002grey.jpg", 0.268);

    const heightStringGeschenkPic = `${Math.round(0.24 * wWidth)}px`;
    document.getElementById("geschenkGutschein").style.height = heightStringGeschenkPic;
    document.getElementById("geschenkGutscheinBackground").style.height = heightStringGeschenkPic;

    if (wWidth < 700 && ($("#smallDiv").length === 0)) {
        const containerDiv = document.createElement("div");
        containerDiv.class = "container-fluid fullGrey";
        containerDiv.id = "smallDiv";

        const rowDiv = document.createElement("div");
        rowDiv.class = "row col-lg-10 col-md-10 col-sm-10 col-xs-12 col-lg-offset-1 col-md-offset-1 col-sm-offset-1 textNatur";

        const textDiv = document.createElement("div");
        const newContent = document.createTextNode("Verschenke ein Erlebnis! Gönnen Sie sich etwas ganz Besonderes mit Ihren Liebsten.");

        textDiv.appendChild(newContent);
        rowDiv.appendChild(textDiv);
        containerDiv.appendChild(rowDiv);

        $("#testid").after(containerDiv);

        $("#geschenkGutscheinBackground").hide();
    }

    $("#smallNav").toggle(false);

    if (wWidth < 1000) {
        $("#eLeistungKlein").toggle(true);
        $("#eLeistung").toggle(false);
        $("#eContact").toggle(false);
        $("#containerEContactSmall").toggle(true);
        $("#topnav").toggle(false);
        $("#hamburger").toggle(true);
    }

    if (wWidth >= 700) {
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
