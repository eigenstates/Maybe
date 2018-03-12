var Sound = function(){
  
  var sample;

  function loadFile(file, cb){

    var request = new XMLHttpRequest();

    request.addEventListener( 'load', function( e ){
      loadBuffer(request.response, cb);
    }, false );

    request.open( 'GET', encodeURI(file), true );
    request.responseType = "arraybuffer";
    request.send();
  }

  // function getStream(cb){
  //   if(!source){
  //       source = mainContext.createMediaStreamSource(stream);
  //       cb && cb(source);
  //   }
  //   else{
  //     cb && cb(source)
  //   }
  // }
  // function loadRecording(buffers, cb){
  //   var buffer = mainContext.createBuffer( 2, buffers[0].length, mainContext.sampleRate );
  //   buffer.getChannelData(0).set(buffers[0]);
  //   buffer.getChannelData(1).set(buffers[1]);
  //   source = mainContext.createBufferSource();

  //   // Store the decoded buffer data in the source object
  //   source.buffer = buffer;
  //   source.loop = true;

  //   cb && cb(source)
  // }

  function loadBuffer(buffer, cb){
    mainContext.decodeAudioData( buffer, 
      function( decoded_data ){
        if (!decoded_data) {
          alert('error decoding file data: ' + url);
          return;
        }
        //console.log("load buff data", decoded_data)
        // Store the decoded buffer data in the source object
        sample = mainContext.createBufferSource();
        sample.buffer = decoded_data;
        //source.loop = true;

        cb && cb(sample);

      }, 
      function( e ){ console.log( "Load file Failed ", e ); }
    );

  }

  return{
    loadFile:loadFile,
    //getStream: getStream,
    loadBuffer: loadBuffer,
    //loadRecording:loadRecording,
    play: function(){
      // Play back the sound immediately
      //console.log("play", source)
      source.start( );

    },
    stop: function(){
      source.stop( );
    },
    loop: function(){
        // Loop the playback of the source
        if(source.loop == true){
          source.loop = false;
        }else{
          source.loop = true;
        }
    },
  };
}; //end Sound