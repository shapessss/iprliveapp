




function show_banner(forwards) {
	/* 
	find element on screen
	find element offscreen
	add new image to offscreen
	add scrolling_from_offscreen to offscreen
	add scrolling_to_offscreen to onscreen
	add current_banner to offscreen (now onscreen)


	IF NO CLASSES HAVE CURRENT BANNER (INITIAL RUN) THEN ADD TO FIRST
	*/


	//get current
	let current = null;
	try {
		current = document.getElementById("banner").getElementsByClassName("banner_scroll")[0].getElementsByClassName("current")[0];
	} catch(err) {
		clearInterval(bannerTimer)
		return;
	}
	
	

	for (let x=0;x<document.getElementById("banner").getElementsByClassName("banner_scroll")[0].getElementsByClassName("banner_image").length;x++) {
		let banner_image = document.getElementById("banner").getElementsByClassName("banner_scroll")[0].getElementsByClassName("banner_image")[x];
		banner_image.classList.remove("current_scroll_next"); //in case old class is there from clicking
		banner_image.classList.remove("next_scroll_next"); //in case old class is there from clicking
		banner_image.classList.remove("prev_scroll_prev"); //in case old class is there from clicking
		banner_image.classList.remove("current_scroll_prev"); //in case old class is there from clicking
	}
	

	if (forwards) {
		
		//apply animation to current and next
		//remove current class
		//apply current class to next
		
		current.classList.add("current_scroll_next");
		if (current.nextElementSibling) {
			current.nextElementSibling.classList.add("next_scroll_next");
			current.nextElementSibling.classList.add("current");
		} else {

			let first_image = document.getElementById("banner").getElementsByClassName("banner_scroll")[0].getElementsByClassName("banner_image")[0];
			first_image.classList.add("next_scroll_next");
			first_image.classList.add("current");
		}
		
		
	} else {

		current.classList.add("current_scroll_prev");

		if (current.previousElementSibling) {
			current.previousElementSibling.classList.add("prev_scroll_prev");
			current.previousElementSibling.classList.add("current");
			
		
		} else {
			let bs = document.getElementById("banner").getElementsByClassName("banner_scroll")[0]
			let first_image = bs.getElementsByClassName("banner_image")[bs.getElementsByClassName("banner_image").length - 1];
			first_image.classList.add("prev_scroll_prev");
			first_image.classList.add("current");
		}

	}

	current.classList.remove("current");




}

let bannerTimer;
function add_banner(banners) {

	if (banners.length == 1) return;
	

	
	let x = 0;
	bannerTimer = start_banner_timer(x, banners);

	let left_arrow = document.getElementById("banner_navigation").getElementsByClassName("arrow")[0];
	let right_arrow = document.getElementById("banner_navigation").getElementsByClassName("arrow")[1];

	left_arrow.addEventListener("click", function() {
		//go to previous
		x -= 1;
		if (x < 0) x = banners.length - 1;
		clearInterval(bannerTimer);
		show_banner(false);
		bannerTimer = start_banner_timer(x, banners);
	});

	right_arrow.addEventListener("click", function() {
		//go to previous
		x += 1;
		if (x >= banners.length) x = 0;
		clearInterval(bannerTimer);
		show_banner(true);
		bannerTimer = start_banner_timer(x, banners);
	});

}


function start_banner_timer(x, banners) {
	return setInterval(function() {
		x += 1;
		if (x >= banners.length) {
			x = 0;
		}
		show_banner(true);
	}, 8000);
} 








/* CURRENT PLAYING SCROLL ACROSS TOP */
function show_current_playing(song) {
	let element = document.getElementById("current").getElementsByClassName("scroll_text")[0];
	element.innerHTML = song;

	let playing = false;
	document.getElementById("pause_play").addEventListener("click", function() {

		if (playing) {
			playing = false;
			element.setAttribute("style", "left:"+element.getBoundingClientRect().left+"px;")
			element.classList.remove("scrolling");
			this.innerHTML = ">";
		} else {
			playing = true;
			element.classList.add("scrolling");
			this.innerHTML = "||";
		}
	})
}







