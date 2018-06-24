
let radio = "https://c2.radioboss.fm/w/nowplayinginfo?u=71";
let repeat = 1000 * 60 * 0.5;
 //30 seconds

let radioTimer = setInterval(function() {
	callApi();
}, repeat)


function callApi() {
	let extra = '&' + new Date().getTime();
	fetch(radio+extra).then(function(data){return data.json()}).then(function(data){
		$('#media').html('Now live: ' + data.nowplaying)
	})
}

callApi();