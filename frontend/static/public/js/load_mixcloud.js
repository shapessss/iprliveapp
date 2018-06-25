



$('body').on('click', '.show', function() {
	get_input_value(this);
});


function get_input_value(e) {
	let url = e.getElementsByTagName("INPUT")[0].value;
	show_mixcloud(url);
}

function show_mixcloud(url) {
	//try remove any mixcloud that is already there
	let mf = $('#mixcloud IFRAME');
	if (mf.length > 0) {
		mf = mf[0];
		let m = $('#mixcloud')[0];
		m.removeChild(mf);
	}
	
	
	url = url.split('mixcloud.com');
	if (url.length < 2) return; 
	url = url[1];
	url = url.replace(/\//g,'%2F')
	$('#mixcloud').show();
	$('#mixcloud').append('<iframe width="100%" height="60" src="" frameborder="0" ></iframe>');
	$('#mixcloud IFRAME')[0].src = "https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=1&feed=" + url;

	$('#hide_mixcloud').show();
}

$('#hide_mixcloud').on('click', function() {
	$('#mixcloud').hide();
	$('#hide_mixcloud').hide();
	let mf = $('#mixcloud IFRAME')[0];
	let m = $('#mixcloud')[0];

	m.removeChild(mf);
	//$('#mixcloud IFRAME')[0].src = '';
})





//play/pause stream
$('body').on('click', '#media-play', function() {
	if (this.classList.contains('fa-play')) {
		//pause
		document.getElementById("media-player").play();
		
	} else {
		document.getElementById("media-player").pause();

	}

	this.classList.toggle('fa-play');
	this.classList.toggle('fa-pause');
});


