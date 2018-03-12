var map = []
var lastPickedIndividual;
var lastPickedSequence = [];

var theseParts = parts;
var mainContext = new window.AudioContext();
// Create a AudioGainNode to control the main volume.
var mainVolume = mainContext.createGain();
// Connect the main volume node to the context destination.
mainVolume.connect(mainContext.destination);
mainVolume.gain.value = 0.8;


function preLoadAudio(){
	for (var i=0;i<theseParts.length;i++){
		var files = theseParts[i].files;
		for (var x = 0; x < files.length; x++) {
			var audio = new Audio();
			audio.addEventListener('canplaythrough', onAudioLoad, false);
			audio.src =  '/loops/' + files[x].file;
		}
	}
}
var loaded = 0;
function onAudioLoad(){
	loaded++;
	if(loaded == 4 ){ //because we know. Figure better way
		playing = true;
		playAudio(theseParts[0]);
	}
}

//Idea here is that patterns of MaxPatternInBar has an effect 
//of those patterns reappearing. 
//Possibly- increasing the weight of 'a after b' becuase it happens in currentPattern.
//until all that is left is 'a always follows b'
var MaxPatternInBar = 4;

var audioSample = new Sound();
var audioElement = new Audio();
var currentPart;
var currentIndex =  0;

var colorElm = document.getElementById("color");
function pckLoop(){
	var part = getRandomItem(currentPart.nextWeight);	
	return part;
}
var playing = false;
function playAudio(part){
	console.log(part.name);
	currentPart = part;
	// audioElement.src = '/loops/'+ part.files[0].file; //0 will change when more files added
	// audioElement.addEventListener('loadedmetadata', function() {	
	// 	audioElement.play();
	// 	startPlayTimer(audioElement.duration);
	//});
	audioSample.loadFile("loops/" +part.files[0].file, function(sample){
		console.log(part.files[0].file);
		sample.connect(mainVolume);
		colorElm.style['backgroundColor'] = part.color;
		sample.start(0);

		currentIndex ++;
		
		startPlayTimer(sample.buffer.duration);
	});

}

function makeItSo(){
	if(playing === true){
		return;
	}
	playing = true;
	playAudio(theseParts[0]);
}
function startPlayTimer(duration){

		if(currentIndex<24){
			console.log("currentDuration " + duration);
			//Pick it
			var newPart = pckLoop();
			//Wait to Play the next as long as the one that we just loaded
			var timer = setTimeout(function(){
				clearTimeout(timer);
				playAudio(newPart);
			},duration.toFixed(4)*1000);
		}
		else{
			playing= false;
			currentIndex = 0;
			console.log("END");
		}
		
}

var rand = function(min, max) {
    return Math.random() * (max - min) + min;
};
 
var getRandomItem = function(weightArray) {
	
	//check the highest first
	weightArray.sort(function(a,b){ return b.weight-a.weight })

	//seems uneeded
    var total_weight = weightArray.reduce(function (prev, cur, i, arr) {
        return {weight:(prev.weight + cur.weight)};
    });
    
    //could be just 0-1 
    var weight = (total_weight.weight>1)?1:total_weight.weight;
    var random_num = rand(0, total_weight.weight);
    var weight_sum = 0;
    console.log(random_num);
     
    for (var i = 0; i < parts.length; i++) {
        weight_sum += weightArray[i].weight;
        weight_sum =+ weight_sum.toFixed(2);
        if(weight_sum > 1){
        	weight_sum = 1;
        }
        if (random_num <= weight_sum) {
            return parts[weightArray[i].index];
        }
    }
    return parts[0];
};

preLoadAudio();