//  Add Sound Cloud api
SC.initialize({client_id:"fd4e76fc67798bfa742089ed619084a6"});

//  Get elements for dynamic HTML build.
var box=document.querySelector("#juke");
var sclist=document.querySelector("ol");
var art=document.querySelector(".art");
var scDetails=document.getElementsByClassName(".details");
var playSC=document.querySelector("a");
var addFileField=document.querySelector("#addFile");
var addSCField=document.querySelector("#addSC");
var fileButton=document.querySelector("#file");
var scButton=document.querySelector("#sc");
var backButton = document.querySelector("#back");
var forthButton = document.querySelector("#forth");
var playButton = document.querySelector("#play");
var pauseButton = document.querySelector("#pause");
var stopButton = document.querySelector("#stop");

// var scPlayer, result;

// defines the Jukebox object
function Jukebox(songs) {
  this.songs=songs;
  this.playlist=[];
  this.trackList=[];
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

var jukebox = new Jukebox([]);

Jukebox.prototype.Addsongs=function(songs){
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
      var eA=document.createElement(song);
      eA.setAttribute("class", song);
      eA.setAttribute("href", "#");
      eA.innerHTML=eTitle;
      e.appendChild(eA);
    }
  delete this.songs;
  console.log(this.playlist.length);
}

jukebox.Addsongs(["./audio/Always\ In\ My\ Head.m4a",
"./audio/Doubt.m4a","./audio/You\ and\ Me.m4a"]);

Jukebox.prototype.addSC=function(scurl){
	this.scurl=scurl;
  var playlist=this.playlist
	var scID;
	var scTitle;
  var scRelMo;
  var scRelDay;
  var scRelYr;
  var scDesc;
  var scGenre;
  var scArt;
	SC.resolve(this.scurl).then(function(response){
		scID="/tracks/"+response.id;
		scTitle=response.title;
		scUser=response.username;
		scArt=response.artwork_url;
    scRelMo=response.release_month
    scRelDay=response.release_day
    scRelYr=response.release_year
    scDesc=response.description;
    scGenre=response.genre;
    scArt=response.artwork_url;
	})
	setTimeout(function(){
  	this.scID=[scID];
  	this.scTitle=[scTitle];
    this.scRelease=scRelMo +"/"+
      scRelDay +"/"+
      scRelYr;
    this.scDesc=scDesc;
    this.scGenre=scGenre;
    this.scArt=scArt;
  	console.log("Art- "+ this.scArt);
    var e=document.createElement("li");
    sclist.appendChild(e);
    var eA=document.createElement("a");
    var scClass="song"+Number(playlist.length);
    eA.setAttribute("id", this.scID);
    eA.setAttribute("class", scClass);
    eA.setAttribute("href", "#");
    eA.innerHTML=this.scTitle;
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
      "<BR>";
    e.appendChild(eP);
	},3000);
}

//  Function to attach to dynamically created Event Listner for class- details <p>
var showScDetails=function(event){
  event.preventDefault();
	console.log(event);
  jukebox.DisplayDetails(event.target.id+"P", event.target.id);
}

Jukebox.prototype.DisplayDetails=function(paraID, scID){
  eP=document.getElementById(paraID);
  console.log("This is eP- "+eP);
  this.scID=scID;
  console.log(this.scID);
  var scArt;
  SC.get(scID).then(function(response){
    scID="/tracks/"+response.id;
    scArt=response.artwork_url;
  })
  setTimeout(function(){
    this.scID=scID;
    console.log("This is eP- "+eP);
    eP.setAttribute("class", "p.detailsShow");
    art.setAttribute("src", this.scArt);
  },1000);
}

//  Load a Sound Cloud song into Jukebox.
jukebox.addSC("https://soundcloud.com/kjun/keisha-cole-heaven-sent-k-jun-remix");

Jukebox.prototype.onLoad=function(){
  this.song=this.playlist[0];
  this.song.play();
}

// Create reusable function to determine if song is using Audio or Soundcloud
function choosePlayer(song, action){
  var currentPlayer, audio;
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

//defines the Jukebox prototype object
Jukebox.prototype.play = function(){
  if (this.song!="undefined"){
    var currentID=(this.song.className.replace(/song/,""));
    var songID=this.playlist[currentID].id;
    choosePlayer(this.song, "play");
  }
  else{
    var counter=0;
    this.song=this.playlist[counter];
    this.song.play();
  }
}

Jukebox.prototype.pause = function () {
  choosePlayer(this.song, "pause");
}

Jukebox.prototype.stop= function () {
  choosePlayer(this.song, "stop");
}

Jukebox.prototype.back=function(){
  var scPlayer;
  var currentID=(this.song.className.replace(/song/,""));
  var newID=Number(currentID)-1;
  console.log("song- "+ this.song.id +"\ncurrentID- "+ currentID +"\nnewID- "+ newID +"\nclassID- "+ this.song.className);
  //test that new counter not  negative (before first song).
  if (newID>=0){
    choosePlayer(this.song, "back");
    var songID=this.playlist[newID].id;
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
          this.player=scPlayer;
      },1000);
    }
  }
}

Jukebox.prototype.forth=function(){
  var scPlayer;
  var currentID=(this.song.className.replace(/song/,""));
  var newID=Number(currentID)+1;
  var end=this.playlist.length;
  console.log("song- "+ this.song.id +"\nend- "+ end +"\ncurrentID- "+ currentID +"\nnewID- "+ newID +"\nclassID- "+ this.song.className);
  //test that new counter not past last playlst item.
  if (newID<end){
    choosePlayer(this.song, "forth");
    var songID=this.playlist[newID].id;
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

fileButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
	console.log(event.target);
	this.songs=[addFileField.value];
	jukebox.Addsongs(this.songs);
	addFileField.value="";
})

scButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
	console.log(event.target);
	this.scurl=addSCField.value;
  console.log("scurl- "+ addSCField.value)
	jukebox.addSC(this.scurl);
	addSCField.value="";
})

// playSC.addEventListener("click", function(event){
//   // prevents link from going to the next page
//   event.preventDefault();
// 	console.log(event.target);
// 	console.log(event.target.innerHTML);
// })

jukebox.onLoad();
