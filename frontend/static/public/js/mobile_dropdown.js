

//if mobile
if (window.innerWidth < 750) {


let dropdown = document.getElementById("mobile_navigation").getElementsByClassName("dropdown")[0];
let navigation_inner = document.getElementById("navigation").getElementsByClassName("navigation-inner")[0];
let mobile_elements = navigation_inner.getElementsByTagName("A");

dropdown.addEventListener("click", function() {
	if (navigation_inner.style.display == "flex") {
		navigation_inner.style.display = "none";
		this.setAttribute("style", "transform: rotate(0deg);")
	} else {
		navigation_inner.style.display = "flex";
		this.setAttribute("style", "transform: rotate(90deg);")
	}
	
});


for (let m of mobile_elements) {
	m.addEventListener("click", function() {
		console.log("mobile nav wierd");
		navigation_inner.style.display = "none";
		dropdown.setAttribute("style", "transform: rotate(0deg);")
	})
}


}