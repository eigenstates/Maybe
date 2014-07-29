var map = []
var lastPickedIndividual;
var lastPickedSequence = []
var mainContext = new webkitAudioContext();
// Create a AudioGainNode to control the main volume.
var mainVolume = mainContext.createGain();
// Connect the main volume node to the context destination.
mainVolume.connect(mainContext.destination);
mainVolume.gain.value = .8;
var parts = [
	{
		name:'PartA',
		nextWeight:[
					{index:0, weight:.30},
					{index:1, weight:.60},
					{index:2, weight:.05},
					{index:3, weight:.05}],
		
		files:[	{file:"111BSSimrock.wav", weight:.99},
				{file:"hh0a.mp3", weight:.01}],
		color:"red"
	},
	{
		name:'PartB',
		nextWeight:[{index:0, weight:.45},
					{index:1, weight:.35},
					{index:2, weight:.15},
					{index:3, weight:.05}],

		files:[	{file:"111BSSimrockNK.wav", weight:.99},
				{file:"hh1a.mp3", weight:.01}],
		color:"orange"
	},
	{
		name:'PartC',
		nextWeight:[
					{index:0, weight:.30},
					{index:1, weight:.25},
					{index:2, weight:.05},
					{index:3, weight:.45},],

		files:[	{file:"111BSSimrockRd.wav", weight:.99},
				{file:"hh2a.mp3", weight:.01}],
		color:"blue"
	},
	{
		name:'PartD',
		nextWeight:[{index:0, weight:.70},
					{index:1, weight:.05},
					{index:2, weight:.24},
					{index:3, weight:.01}],

		files:[	{file:"111BSSimrockRdFill1.wav", weight:.99},
				{file:"hh3a.mp3", weight:.01}],
		color:"green"
	}
]

//Idea here is that patterns of MaxPatternInBar has an effect 
//of those patterns reappearing. 
//Possibly- increasing the weight of 'a after b' becuase it happens in currentPattern.
//until all that is left is 'a always follows b'
var MaxPatternInBar = 4 

var audio = new Sound();

var currentIndex =  0

var colorElm = document.getElementById("color");
function pckLoop(){
	part = getRandomItem(part.nextWeight);	
	//playAudio();
}
var playing = false
var part = parts[0];
function playAudio(){
	console.log(part.name)
	//loadSound(part.files[0].file)
	audio.loadFile("loops/" +part.files[0].file, function(source, duration){
		console.log(part.files[0].file)
		source.connect(mainVolume)
		colorElm.style['backgroundColor'] = part.color
		audio.play()

		currentIndex ++;
		
		startPlayTimer(duration)

		//requestAnimationFrame(colorChanger)
	})

}

function makeItSo(){
	if(playing === true){
		return
	}
	playing = true
	playAudio()
}
function startPlayTimer(duration){

		if(currentIndex<24){
			console.log("currentDuration " + duration)
			//Pick it
			pckLoop()
			//Wait to Play the next as long as the one that we just loaded
			var timer = setTimeout(function(){
				clearTimeout(timer)
				playAudio()
			},duration.toFixed(4)*1000);
		}
		else{
			playing= false
			currentIndex = 0
			console.log("END")
		}
		
}

function colorChanger(){

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
    console.log(random_num)
     
    for (var i = 0; i < parts.length; i++) {
        weight_sum += weightArray[i].weight;
        weight_sum =+ weight_sum.toFixed(2);
        if(weight_sum > 1){
        	weight_sum = 1;
        }
        if (random_num <= weight_sum) {
            return parts[weightArray[i].index]
        }
    }
    return parts[0]
};