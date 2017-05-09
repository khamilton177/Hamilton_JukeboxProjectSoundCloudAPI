//  Add Sound Cloud api
SC.initialize({client_id:client_key});

//  Get elements for dynamic HTML build.
var box = document.querySelector("#juke");
var sclist = document.querySelector("ol");
var art = document.querySelector(".artHide");
var scDetails = document.getElementsByClassName(".details");
var playSC = document.querySelector("a");
var addFileField = document.querySelector("#addFile");
var addSCField = document.querySelector("#addSC");
var fileButton = document.querySelector("#file");
var scButton = document.querySelector("#sc");
var backButton = document.querySelector("#back");
var forthButton = document.querySelector("#forth");
var playButton = document.querySelector("#play");
var pauseButton = document.querySelector("#pause");
var stopButton = document.querySelector("#stop");

// defines the Jukebox object
function Jukebox(songs) {
  /*  Will be used to initiate audio file calls.
  Will also be used to identify element ID and Class */
  this.songs=songs;
  // All audio files and Sound Cloud tracks will be available via playlist
  this.playlist=[];
  // scPlayer will be used to initiate calls to the Sound Cloud API
  this.scPlayer;
  this.currentImg;
  this.currentEp;
    // Dynamically build html playlist
    for (var counter=0; counter<songs.length; counter++){
      var song="song"+counter;
      var e=document.createElement("audio");
      e.src=songs[counter];
      e.setAttribute("id", song);
      box.appendChild(e);
      e=document.querySelector("#"+song);
      console.log(e);
      this.playlist.push(e);
    }
  delete this.songs;
  console.log(this.playlist.length);
}

//  Create a new Jukebox object
var jukebox = new Jukebox([]);

//  Used to add audio files to playlist
Jukebox.prototype.Addsongs = function(songs){
  this.songs=songs;
  var current=this.playlist.length;
    for (counter=0; counter<songs.length; counter++){
      var song="song"+Number(current+counter);
      var e=document.createElement("audio");
      e.src=songs[counter];
      e.setAttribute("id", song);
      e.setAttribute("class", song);
      box.appendChild(e);
      e=document.querySelector("#"+song);
      console.log(e);
      var eTitle=songs[counter].replace(/\.\/audio\//,"");
      this.playlist.push(e);
      var e=document.createElement("li");
      sclist.appendChild(e);
      var eA=document.createElement("a");
      eA.setAttribute("id", song +"A");
      eA.setAttribute("class", song);
      eA.setAttribute("href", "#");
      eA.addEventListener('click', playFromList);
      eA.innerHTML=eTitle;
      e.appendChild(eA);
    }
  delete this.songs;
  console.log(this.playlist.length);
}

//  Load three sample audio files to newly created Jukebox object
jukebox.Addsongs(["./audio/Always\ In\ My\ Head.m4a",
"./audio/Doubt.m4a","./audio/You\ and\ Me.m4a"]);

//  Used to add Sound Cloud tracks to playlist
Jukebox.prototype.addSC = function(scurl){
	this.scurl=scurl;
  // Define variables that will be used in Resolve and Get request
  var playlist=this.playlist
	var scID;
	var scTitle;
  var scPerm;
  var scRelMo;
  var scRelDay;
  var scRelYr;
  var scDesc;
  var scGenre;
  var scArt;
  //  Resolve the Sound Cloud url that was passed as parameter
	SC.resolve(this.scurl).then(function(response){
		scID="/tracks/"+response.id;
		scTitle=response.title;
		scUser=response.username;
		scPerm=response.permalink_url;
    scRelMo=response.release_month
    scRelDay=response.release_day
    scRelYr=response.release_year
    scDesc=response.description;
    scGenre=response.genre;
    scArt=response.artwork_url;
	})
  /*  Timeout needed to allow then() to finish returning attributes.
  Set local vars to be used globally in Jukebox instance.
  Dynamically create html elements for playlist*/
	setTimeout(function(){
  	this.scID=[scID];
  	this.scTitle=[scTitle];
    this.scPerm=[scPerm];
    this.scRelease=scRelMo +"/"+
      scRelDay +"/"+
      scRelYr;
    this.scDesc=scDesc;
    this.scGenre=scGenre;
    this.scArt=scArt;
  	console.log("Art- "+ this.scArt);
    var eImg=document.createElement("img");
    box.appendChild(eImg);
    eImg.setAttribute("id", this.scID +"Img");
    eImg.setAttribute("class", "artHide");
    eImg.setAttribute("src", this.scArt);
    var e=document.createElement("li");
    sclist.appendChild(e);
    var eA=document.createElement("a");
    var scClass="song"+Number(playlist.length);
    eA.setAttribute("id", this.scID +"A");
    eA.setAttribute("class", scClass);
    eA.setAttribute("href", "#");
    eA.innerHTML=this.scTitle;
    eA.addEventListener('click', playFromList);
    e.appendChild(eA);
    playlist.push(eA);
    var eBtn=document.createElement("Button")
    eBtn.setAttribute("id", this.scID);
    eBtn.setAttribute("class", "details");
    eBtn.innerHTML="Details";
    eBtn.addEventListener('click', showScDetails);
    e.appendChild(eBtn);
    var eP=document.createElement("p")
    eP.setAttribute("id", this.scID+"P");
    eP.setAttribute("class", this.scID);
    eP.setAttribute("class", "detailsHide");
    eP.innerHTML=
      "Details:<BR>Title- "+ this.scTitle +
      "<BR>Release Date- "+ this.scRelease  +
      "<BR>Description- "+ this.scDesc +
      "<BR>Genre- "+ this.scGenre +
      "<BR>Visit Page- "+ "<a href='"+ this.scPerm +
      "' target='_blank'>"+ this.scPerm +
      "</a>"
      "<BR>";
    box.appendChild(eP);
	},3000);
}

//  Function to attach to dynamically created Event Listener for class- details <p>
function showScDetails(){
  event.preventDefault();
	console.log(event);
  //  Hide the last displayed details paragraph
  if (jukebox.currentImg != undefined){
    jukebox.currentImg.setAttribute("class", "artHide");
  }
  if (jukebox.currentEp != undefined){
    jukebox.currentEp.setAttribute("class", "detailsHide");
  }
  jukebox.DisplayDetails(event.target.id+"P", event.target.id);
}

//  Function to attach to dynamically created Event Listener for playlist <a>
function playFromList(){
  event.preventDefault();
  console.log("This is <A> Id- "+ event.target.id + "\nThis <A> class- "+ event.target.className);
  jukebox.playList(event.target.className);
}

//  Play song by title from playlist.
Jukebox.prototype.playList = function(classID){
  this.classID=classID;
  var currentID=this.classID.replace(/song/,"");
  console.log("currentID- "+ currentID);
  var songID=jukebox.playlist[currentID].id.slice(0,-1);
  console.log("after slice- "+ songID);
  if (this.song != undefined){
    if(this.song.id.includes("song")){
      this.song.pause();
      this.song.currentTime=0;
    }
  }
  if(this.scPlayer != undefined){
    if(this.song.id.includes("song")){
      this.scPlayer.pause();
      this.scPlyer.seek(0);
    }
  }
  this.song=jukebox.playlist[currentID];
  if(songID.includes("song")){
    this.song.play();
  }
  else{
    var scPlayer;
    SC.stream(songID).then(function(player){
      scPlayer=player;
      scPlayer.play();
    });
    setTimeout(function(){
      this.scPlayer=scPlayer;
    },1000);
  }
  this.song=jukebox.playlist[currentID];
}

//  Display Sound Cloud details.
Jukebox.prototype.DisplayDetails = function(paraID, scID){
  eImg=document.getElementById(scID + "Img");
  eP=document.getElementById(paraID);
  this.currentImg=eImg;
  this.currentEp=eP;
  console.log("This is eP- "+eP);
  this.scID=scID;
  console.log(this.scID);
  // var scArt;
  SC.get(scID).then(function(response){
    scID="/tracks/"+response.id;
    scPerm=response.permalink_url;
    scArt=response.artwork_url;
    eImg.setAttribute("class", "artShow");
  })
  setTimeout(function(){
    this.scID=scID;
    console.log("This is eP- "+eP);
    eP.setAttribute("class", "detailsShow");
  },1000);
}

//  Load a Sound Cloud sample song into created Jukebox instance.
jukebox.addSC("https://soundcloud.com/kjun/keisha-cole-heaven-sent-k-jun-remix");

//  Load the created sample playlist on page load and play first song.
Jukebox.prototype.onLoad = function(){
  this.song=this.playlist[0];
  this.song.play();
}

// Create reusable function to determine if song is using Audio or Soundcloud
function choosePlayer(song, action){
  this.song=song;
  if(this.song.id.includes("song")){
    console.log("Im at Jukebox player commands");
    switch(eval(action)) {
      case play:
        console.log("At Play");
        this.song.play();
        break;
      case pause:
        console.log("At Pause");
        this.song.pause();
        break;
      default:
        console.log("At Default");
        this.song.pause();
        this.song.currentTime=0;
    }
  }
  else{
    console.log("Im at SCplayer commands");
      switch(eval(action)) {
        case play:
          console.log("At Play");
          this.scPlayer.play();
          break;
        case pause:
          console.log("At Pause");
          this.scPlayer.pause();
          break;
        default:
          console.log("At Default");
          this.scPlayer.pause();
          this.scPlayer.seek(0);
      }
  }
}

Jukebox.prototype.play = function(){
  if (this.song!="undefined"){
    var currentID=(this.song.className.replace(/song/,""));
    var songID=this.playlist[currentID].id.slice(0,-1);
    choosePlayer(this.song, "play");
  }
  else{
    var counter=0;
    this.song=this.playlist[counter];
    this.song.play();
  }
}

Jukebox.prototype.pause = function(){
  choosePlayer(this.song, "pause");
}

Jukebox.prototype.stop = function(){
  choosePlayer(this.song, "stop");
}

Jukebox.prototype.back = function(){
  var scPlayer;
  var currentID=(this.song.className.replace(/song/,""));
  var newID=Number(currentID)-1;
  console.log("song- "+ this.song.id +"\ncurrentID- "+ currentID +"\nnewID- "+ newID +"\nclassID- "+ this.song.className);
  //  test that new counter not  negative (before first song).
  if (newID>=0){
    choosePlayer(this.song, "back");
    var songID=this.playlist[newID].id.slice(0,-1);
    this.song=this.playlist[newID];
    if(songID.includes("song")){
      this.song.play();
    }
    else{
      console.log("songID- "+ songID);
        SC.stream(songID).then(function(player){
          scPlayer=player;
          scPlayer.play();
        });
        setTimeout(function(){
          this.scPlayer=scPlayer;
      },1000);
    }
  }
}

Jukebox.prototype.forth = function(){
  var scPlayer;
  var currentID=(this.song.className.replace(/song/,""));
  var newID=Number(currentID)+1;
  var end=this.playlist.length;
  console.log("song- "+ this.song.id +"\nend- "+ end +"\ncurrentID- "+ currentID +"\nnewID- "+ newID +"\nclassID- "+ this.song.className);
  //  test that new counter not past last playlst item.
  if (newID<end){
    choosePlayer(this.song, "forth");
    var songID=this.playlist[newID].id.slice(0,-1);
    this.song=this.playlist[newID];
    if(songID.includes("song")){
      this.song.play();
    }
    else{
        SC.stream(songID).then(function(player){
          scPlayer=player;
          scPlayer.play();
        });
        setTimeout(function(){
          this.scPlayer=scPlayer;
        },1000);
    }
  }
}

playButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
  console.log(event.target);
  jukebox.play();
})

pauseButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
  console.log(event.target);
  jukebox.pause();
})

stopButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
  console.log(event.target);
  jukebox.stop();
})

backButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
  console.log(event.target);
  jukebox.back();
})

forthButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
  console.log(event.target);
  jukebox.forth();
})

//  Button used by end user to add audio files to playlist
fileButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
	console.log(event.target);
  /*  Field used by end user to designate audio files to add to playlist.
  Files MUST be located in '/audio' folder. */
	this.songs=[addFileField.value];
	jukebox.Addsongs(this.songs);
	addFileField.value="";
})

//  Button used by end user to add Sound Cloud tracks to playlist
scButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
	console.log(event.target);
  /*  Field used by end user to designate Sound Cloud tracks to add to playlist.*/
	this.scurl=addSCField.value;
  console.log("scurl- "+ addSCField.value)
	jukebox.addSC(this.scurl);
	addSCField.value="";
})

//  Load and start the new Jukebox instance.
jukebox.onLoad();
