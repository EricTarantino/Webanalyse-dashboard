/*eslint-env jquery */

// Toggle side navigation
$("#menu-toggle").click(function (e) {
    if (window.innerWidth > 1200) {
        e.preventDefault();

        $("#wrapper").toggleClass("toggled");
        this.value = this.value === "Menu ausblenden" ? "Menu einblenden" : "Menu ausblenden";

        let src = $(this).attr('src') === "/icon/right_circle.png" ? "/icon/left_circle.png" : "/icon/right_circle.png";
        $(this).attr('src', src);
    }
});

// Close CSS side bar
function closeCSSSideBar() {
    $("#wrapper").toggleClass("toggled", true);
    let src = "/icon/right_circle.png";
    $("#menu-toggle").attr('src', src);
}

// Handle window resize events
$(window).resize(function () {
    if (window.innerWidth <= 1200) {
        $("#wrapper").toggleClass("toggled", true);
        let src = "/icon/right_circle.png";
        $("#menu-toggle").attr('src', src);
    }

    if (window.innerWidth > 1100) {
        $("#smallNavBlendInAtLogin").css("display", "none");
    } else {
        $("#smallNavBlendInAtLogin").css("display", "block");
    }
});
