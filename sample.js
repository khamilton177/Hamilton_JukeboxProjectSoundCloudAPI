//  Add Sound Cloud api
var SC;
SC.initialize({client_id:"fd4e76fc67798bfa742089ed619084a6"});

//  Get elements for dynamic HTML build.
var box=document.querySelector("#juke");
var sclist=document.querySelector("ol");
var art=document.querySelector(".art");
var scDetails=document.getElementsByClassName("details");
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

// defines the Jukebox object
function Jukebox(songs) {
  this.songs=songs;
  this.playlist=[];
	this.trackList=["Flikermood"];
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

//  Create instance of Jukebox with 2 preset audio files.
var jukebox = new Jukebox(["./audio/Always\ In\ My\ Head.m4a",
"./audio/Doubt.m4a"]);

// Jukebox.prototype.SClist=function(){
//     var current=this.playlist.length;
//       for (counter=0; counter<this.songs.length; counter++){
//         var song="song"+Number(current+counter);
//         var e=document.createElement("li");
//         var eA=document.createElement("a");
//         eA.href=this.songs[counter];
//         eA.innerHTML=this.songs[counter];
//         scList.appendChild(e);
//         e.appendChild(eA);
//         e.setAttribute("id", song);
//         e=document.querySelector("#"+song);
//         console.log(e);
//         this.playlist.push(e);
//       }
//     delete this.songs;
//     console.log(this.playlist.length);
// }

//  Function to attach to dynamically created Event Listner for class- details <p>
var scDetails=function(event){
  event.preventDefault();
	console.log(event);
  console.log(event.target.id)
  jukebox.DisplayDetails(event.target, event.target.id);
}
//  Add Event Listerner to static sample link
// sample=document.getElementsByName("/tracks/293")
// sample.addEventListener('click', scDetails)

Jukebox.prototype.addSC=function(scurl){
	this.scurl=scurl;
//  this.scList=scList;
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
    eA.setAttribute("id", this.scID);
    eA.setAttribute("href", "#");
    eA.innerHTML=this.scTitle;
    e.appendChild(eA);
    var eBtn=document.createElement("Button")
    eBtn.setAttribute("name", this.scID);
    eBtn.setAttribute("class", "details");
    eBtn.innerHTML="Details";
    eBtn.addEventListener('click', scDetails);
    e.appendChild(eBtn);
    var eP=document.createElement("p")
    eP.setAttribute("class", this.scID);
    eP.setAttribute("class", "details");
//    eP.setAttribute("class", "detailsHide");
    eP.innerHTML=
      "Details:<BR>Title- "+ this.scTitle +
      "<BR>Release Date- "+ this.scRelease  +
      "<BR>Description- "+ this.scDesc +
      "<BR>Genre- "+ this.scGenre +
      "<BR>";
    e.appendChild(eP);
	},10000);
}

Jukebox.prototype.DisplayDetails=function(para, scID){
  var eP=para;
  this.scID=scID;
  console.log(this.scID);
  var scArt;
  SC.get(scID).then(function(response){
    scID="/tracks/"+response.id;
    scArt=response.artwork_url;
  })
  setTimeout(function(){
    this.scID=scID;
    eP.setAttribute("class", "p.detailsShow");
    //art.style.backgroundImage="url('"+this.scArt+"')";
    //art.style.backgroundSize="cover";
    art.setAttribute("src", this.scArt);
  },5000);
}

Jukebox.prototype.back= function () {
    console.log("Index- "+this.song.id);
    var currentID=(this.song.id.replace(/song/,""));
    var newID=Number(currentID)-1;
    console.log("Current "+ newID);
    if (currentID!=0){//test that new counter not past first playlst item.
      this.song.pause();
      this.song.currentTime=0;
      this.song=this.playlist[newID];
      console.log("New song- "+ this.song);
      this.song.play();
    }
}

scButton.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
	console.log(event.target);
	this.scurl=addSCField.value;
	jukebox.addSC(this.scurl);
	addSCField.value="";
})

playSC.addEventListener("click", function(event){
  // prevents link from going to the next page
  event.preventDefault();
	console.log(event.target.id);
	console.log(event.target.innerHTML);
  SC.stream(event.target.id).then(function(response){
	player.play();
  })
})

jukebox.addSC("https://soundcloud.com/kjun/keisha-cole-heaven-sent-k-jun-remix");
