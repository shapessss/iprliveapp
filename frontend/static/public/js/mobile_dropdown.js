


let dropdown = document.getElementById("mobile_navigation").getElementsByClassName("dropdown")[0];
let navigation_inner = document.getElementById("navigation").getElementsByClassName("navigation-inner")[0];


dropdown.addEventListener("click", function() {
	if (navigation_inner.style.display == "flex") {
		navigation_inner.style.display = "none";
		this.setAttribute("style", "transform: rotate(0deg);")
	} else {
		navigation_inner.style.display = "flex";
		this.setAttribute("style", "transform: rotate(90deg);")
	}


	
});