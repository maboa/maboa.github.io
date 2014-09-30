// Todo validate url input so that an invalid url does not cause JS errors.


// #/t:Test%20Max,1,1.2/0:2150,4210/r:1/t:And%20Now%20For%20Something...,0,2/1:23500,5310/f:1/2:3126,7334

var mixHTML = "";



console.log("ABOUT TO EXTRACT!");

var transcript = null;

// Viewer compatible
//var output = $('<article></article>');

// Pad compatible - actually may not require for pad (test!)
// Has effect of displaying transcript lower down and then scrolling up upon load

var output = $('<article style="transition-timing-function: cubic-bezier(0.1, 0.57, 0.1, 1); transition-duration: 0ms; transform: translate(0px, -349px) translateZ(0px);"></article>');



function isSameParent(p1,p2) {
	if (p1.html() == null || p2.html() == null) {
		return true;
	} else {
		//Todo - find a better way to compare!
		return (p1.html().substr(0,16) == p2.html().substr(0,16));
	}
}


//start creating the structure


function buildTranscriptSection(index, tid, stime, length, callback) {

	console.log("in buildTranscriptSection");
	//var element = $('<p dir="rtl"></p>');
	var element = $('<p dir="auto"></p>');
	var etime = parseInt(stime)+parseInt(length);

	console.log("in extractTranscript");
	tid = tid + ".html";
	console.log(element, tid, stime, etime);
	console.log("etime="+etime);


	console.log("================== host ==================");
	console.log(document.location.hostname);
	host = document.location.hostname;
	console.log(host.substr(0,1));
	
	// brittle test to see if running locally
	if ((host.indexOf('localhost') < 0) && (host.substr(0,1) != "1")) {
		console.log("adding http/");
		host = "http://";
	} else {
		host = "/";
	}

	console.log("host = "+host);


	$.get(host+"maboa.github.io/experiments/ha-url-mix/transcripts/"+tid, function( transcript ) {
		var firstWord = 'a[data-m="'+stime+'"]';
		var lastWord = 'a[data-m="'+etime+'"]';
		var firstWordInTrans = $(firstWord,transcript);
		var lastWordInTrans = $(lastWord,transcript);

  	element.append(firstWordInTrans.nextUntil(lastWord).andSelf());//.append(lastWordInTrans);

  	if (isSameParent($(firstWord,transcript).parent(),$(lastWord,transcript).parent()) == false) {
  		
  		var nextParent = $(firstWord,transcript).parent().next();
  		do {
  			element.append(nextParent[0].outerHTML);

  			nextParent = nextParent.next();

  		} 
  		while (isSameParent(nextParent,$(lastWord,transcript).parent()) == false) 
  	}

  	console.log(videoInfo);
  	console.log(tid);

  	console.log(videoInfo[parseInt(tid)]);

  	var ytid = videoInfo[parseInt(tid)].split(',')[0];
  	var mp4id = videoInfo[parseInt(tid)].split(',')[1];
  	console.log("mp4id = "+mp4id);
  	//mp4id = mp4id.replace("*",",");
  	//console.log("mp4id = "+mp4id);

  	// Viewer compatible

  	//$('section:nth-child('+index+')',output).append(element[0].outerHTML).attr('data-yt','http://www.youtube.com/watch?v='+ytid).addClass('item');

  	// Pad compatible

		//$('section:nth-child('+index+')',output).append(element[0].outerHTML).attr('data-unit','0.001').attr('data-yt','http://www.youtube.com/watch?v='+ytid).addClass('item');
		$('section:nth-child('+index+')',output).append(element[0].outerHTML).attr('data-unit','0.001').attr('data-mp4',mp4id).addClass('item');



		$('p',output).attr('dir','auto');

		callback(null, true);
	});
}

function buildTitle(index, title, fullscreen, duration) {

	var fullscreenCheck = "";

	if (fullscreen == '1') {
		fullscreenCheck = 'checked=""';
	}

	// Viewer compatible

	//var element = '<div class="effect-checkboxes"><input id="effect-fullscreen" '+fullscreenCheck+'></div><input id="effect-title" value="'+title+'"><input id="effect-duration" value="'+duration+'">';

	// Pad compatible

	var element = '<form onsubmit="return false"><label>Title: <span class="value">'+duration+'</span>s</label><div class="effect-checkboxes"><label for="effect-fullscreen">Full Screen:</label> <input id="effect-fullscreen" '+fullscreenCheck+' onchange="if(this.checked) { this.setAttribute(\'checked\', true); } else { this.removeAttribute(\'checked\'); }" type="checkbox"></div><input id="effect-title" value="'+title+'" onchange="this.setAttribute(\'value\', this.value);" onkeyup="this.setAttribute(\'value\', this.value);" type="text"><input id="effect-duration" value="'+duration+'" min="0.5" max="5" step="0.1" onchange="this.setAttribute(\'value\', this.value); this.parentNode.querySelector(\'span\').innerHTML = this.value;" type="range">';



	console.log("Title HTML:");
	console.log(element);

	$('section:nth-child('+index+')',output).append(element).attr('data-effect','title').addClass('item effect');
}

function buildTimedEffect(index, duration, type, label, min) {

	// Viewer compatible

	//var element = '<input id="effect-duration" value="'+duration+'">';

	// Pad compatible

	var element = '<form onsubmit="return false"><label>'+label+'<span class="value">1</span>s</label><input id="effect-duration" value="'+duration+'" min="'+min+'" max="5" step="0.1" onchange="this.setAttribute(\'value\', this.value); this.previousSibling.querySelector(\'span\').innerHTML = this.value;" type="range">';

	$('section:nth-child('+index+')',output).append(element).attr('data-effect',type).addClass('item effect');
}

//console.log("output:");
//console.dir(output[0].outerHTML);


var videoInfo = ['http://www.youtube.com/watch?v=mnY0rynBSTM,http://player.vimeo.com/external/107384621.mobile.mp4?s=80297e241df84e5eb0385c87304fb3c8','http://www.youtube.com/watch?v=sI8R9B_caDY,http://player.vimeo.com/external/107385223.mobile.mp4?s=8083e99329c10022f3c0f9ab4fdb065a','http://www.youtube.com/watch?v=fJISrenMzws,http://player.vimeo.com/external/107445262.mobile.mp4?s=2ada419278dc8fe349d47fbcbd2047f6','http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v,http://www.jplayer.org/video/m4v/Big_Buck_Bunny_Trailer.m4v'];

//var videoInfo = ['mnY0rynBSTM,107384621.m3u8?p=standard*mobile&s=e4570b1860ec64fc4f1226e6612c1098','sI8R9B_caDY,107385223.mobile.mp4?s=8083e99329c10022f3c0f9ab4fdb065a','fJISrenMzws,107445262.mobile.mp4?s=2ada419278dc8fe349d47fbcbd2047f6'];

var state = document.location.hash;
console.log(state);
var params = state.split('/');
console.dir(params);

// first pass - create the sections

for (var i=1; i < params.length; i++) {
	output.append("<section></section>");
}

console.log(output[0].outerHTML);

var q = queue(1);

for (var i=0; i < params.length; i++) {
	var cmd = params[i].split(':');
	console.log("cmd =");
	console.log(cmd);
	console.log(isNaN(cmd[0]));
	console.log(cmd[0].length);

	if (cmd[0].length > 0) {

  	if (isNaN(cmd[0])) {

  		console.log("============");
  		console.log(cmd[0]);

  		switch (cmd[0]) {
  			case "t":
			    console.log("Title.");
			    var details = cmd[1].split(',');
			    buildTitle(i,unescape(details[0]),details[1],details[2]);
			    break;
			  case "r":
			    console.log("Trim.");
			    //buildTrim(i,cmd[1]);
			    buildTimedEffect(i,cmd[1],"trim", "Trim: ", "0");
			    break;
			  case "f":
			    console.log("Fade.");
			    //buildFade(i,cmd[1]);
			    buildTimedEffect(i,cmd[1],"fade", "Fade Effect:", "0.5");
			    break;
			}

  	} else {
  		// It's a transcript
  		console.log("It's a transcript");

  		if (cmd[1]) {
	  		var times = cmd[1].split(',');
	  		// buildTranscriptSection(i,cmd[0],times[0],times[1]);
	  		q.defer(buildTranscriptSection,i,cmd[0],times[0],times[1]);
  		}
  	}
	}
}//loop

console.log("document ready");

q.awaitAll(function() {

	console.log("fragments loaded");
	mixHTML = output[0].outerHTML;

	// Alpha style cleanup of spurious empty paras

	/*mixHTML = output[0].outerHTML.replace("/<p><\/p>/g","");

	console.log("++++++++++++++++++++++++++++++++++++++++++");
	console.log(mixHTML);
	console.log("++++++++++++++++++++++++++++++++++++++++++");*/

	console.log("viewer wrapper");

	console.log($('#viewer-wrapper').length);

	if ($('#viewer-wrapper').length) {
	  HAP.init({
			viewer: true,
			origin: 'Viewer',
			editBtn: '#edit',
			shareBtn: '#share'
		});
	} else {
		HAP.init();
	}
});