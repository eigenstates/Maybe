var Sound = function(){
  
  var source;
  var self = this

  function loadFile(file, cb){

    var request = new XMLHttpRequest()

    request.addEventListener( 'load', function( e ){
      loadBuffer(request.response, cb)
    }, false );

    request.open( 'GET', file, true );
    request.responseType = "arraybuffer";
    request.send();
  }

  function getStream(cb){
    if(!self.source){
        self.source = mainContext.createMediaStreamSource(stream);
        cb && cb(self.source)
    }
    else{
      cb && cb(self.source)
    }
  }
  function loadRecording(buffers, cb){
    var buffer = mainContext.createBuffer( 2, buffers[0].length, mainContext.sampleRate );
    buffer.getChannelData(0).set(buffers[0]);
    buffer.getChannelData(1).set(buffers[1]);
    source = mainContext.createBufferSource();

    // Store the decoded buffer data in the source object
    source.buffer = buffer;
    source.loop = true;

    cb && cb(source)
  }

  function loadBuffer(buffer, cb){
    mainContext.decodeAudioData( buffer, 
      function( decoded_data ){
        //console.log("load buff data", decoded_data)
        // Store the decoded buffer data in the source object
        source = mainContext.createBufferSource();
        source.buffer = decoded_data;
        //source.loop = true;

        cb && cb(source, decoded_data.duration)

      }, 
      function( e ){ console.log( "Load file Failed ", e ); }
    );

  }

  return{
    loadFile:loadFile,
    getStream: getStream,
    loadBuffer: loadBuffer,
    loadRecording:loadRecording,
    play: function(){
      // Play back the sound immediately
      //console.log("play", source)
      source.noteOn( 0 );

    },
    stop: function(){
      source.noteOff( 0 );
    },
    loop: function(){
        // Loop the playback of the source
        if(source.loop == true){
          source.loop = false;
        }else{
          source.loop = true;
        }
    },
  }
} //end Sound