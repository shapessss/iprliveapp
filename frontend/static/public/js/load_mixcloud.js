



$('body').on('click', '.show', function() {
	console.log("show clicked")
	show_mixcloud(this);
});

function show_mixcloud(e) {
	console.log(e);
	$('#mixcloud').show();
	$('#mixcloud').append('<iframe width="100%" height="60" src="" frameborder="0" ></iframe>');
	$('#mixcloud IFRAME')[0].src = "https://www.mixcloud.com/widget/iframe/?hide_cover=1&mini=1&autoplay=1&feed=%2Finternetpublicradio%2Fafrobot-14th-may-2018%2F";
}

$('#hide_mixcloud').on('click', function() {
	$('#mixcloud').hide();
	let mf = $('#mixcloud IFRAME')[0];
	let m = $('#mixcloud')[0];
	console.log(m);
	console.log(mf);
	m.removeChild(mf);
	//$('#mixcloud IFRAME')[0].src = '';
})

