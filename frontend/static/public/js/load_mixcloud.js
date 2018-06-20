



$('body').on('click', '.show', function() {
	show_mixcloud(this);
});

function show_mixcloud(e) {
	let url = e.getElementsByTagName("INPUT")[0].value;

	url = url.split('mixcloud.com')[1];
	url = url.replace(/\//g,'%2F')
	$('#mixcloud').show();
	$('#mixcloud').append('<iframe width="100%" height="60" src="" frameborder="0" ></iframe>');
	$('#mixcloud IFRAME')[0].src = "https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=1&feed=" + url;
}

$('#hide_mixcloud').on('click', function() {
	$('#mixcloud').hide();
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


