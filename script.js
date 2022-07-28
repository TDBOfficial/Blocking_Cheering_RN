// ==UserScript==
// @name         Rec.net Block Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Allows you to block people via rec.net!
// @author       VT
// @match        https://rec.net/user/*
// @match        http://rec.net/user/*
// @icon         https://i.imgur.com/6dUo3BK.png
// @grant        none
// ==/UserScript==

setTimeout(function(){

fetch("https://accounts.rec.net/account?username="+document.URL.split("/")[4]).then(d=>d.json()).then(j=>{CurrentPageUserId=j.accountId

// Player cheering blocking and reporting

var CheersString = ["General","Helpful","Sportmanship","GreatHost","Creative"]
var CheersVar = [0,10,20,30,40]
var ogbutton = document.getElementsByClassName("jss18 jss57")[13];
var bbutton = ogbutton.cloneNode(true)
var cbutton = ogbutton.cloneNode(true)
var blocked = false
fetch("https://api.rec.net/api/relationships/v1/relationshipwith/"+CurrentPageUserId, {
  "headers": {
    "authorization": "Bearer " + JSON.parse(localStorage.getItem("oidc.user:https://auth.rec.net:recnet")).access_token,
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  "method": "GET",
  "mode": "cors"
}).then(d=>d.json()).then(j=>{
    if ( j.Ignored==1 ) {
        blocked=true
        bbutton.firstChild.firstChild.firstChild.innerHTML = "Unblock"
    } else {
        bbutton.firstChild.firstChild.firstChild.innerHTML = "Block"
    }
})
cbutton.onclick = Cheer
cbutton.firstChild.firstChild.firstChild.innerHTML = "Cheer"
ogbutton.parentElement.appendChild(cbutton)
bbutton.onclick = Block
ogbutton.parentElement.appendChild(bbutton)

function Block() {
	if (CurrentPageUserId == 1) {
		console.log("Unable to block, Error Code: Coach")
		alert("You cant block coach!")
		return null;
	}
    if (localStorage.getItem("oidc.user:https://auth.rec.net:recnet") == null){
        console.warn("Unable to block, Error Code: NoAuth")
		alert("You need to be logged in to perform this action!")
		return null;
    }
	console.log("Attempting to unblock " + document.URL.split("/")[4])
    if (blocked) {
	fetch("https://api.rec.net/api/relationships/v1/unignore", {
		"headers": {
			"authorization": "Bearer " + JSON.parse(localStorage.getItem("oidc.user:https://auth.rec.net:recnet")).access_token,
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		"body": "PlayerId=" + CurrentPageUserId,
		"method": "POST",
		"mode": "cors"
	}).then(d => d.json()).then(j => console.log("Successfully Unblocked " + document.URL.split("/")[4]))
    alert ("Unblocked "+document.URL.split("/")[4])
    blocked = false;
    bbutton.firstChild.firstChild.firstChild.innerHTML = "Block"
    } else {
    fetch("https://api.rec.net/api/relationships/v1/ignore", {
		"headers": {
			"authorization": "Bearer " + JSON.parse(localStorage.getItem("oidc.user:https://auth.rec.net:recnet")).access_token,
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		"body": "PlayerId=" + CurrentPageUserId,
		"method": "POST",
		"mode": "cors"
	}).then(d => d.json()).then(j => console.log("Successfully Blocked " + document.URL.split("/")[4]))
    alert ("Blocked "+document.URL.split("/")[4])
    bbutton.firstChild.firstChild.firstChild.innerHTML = "Unblock"
    blocked = true;
    }
}
function Cheer(){
    if (localStorage.getItem("oidc.user:https://auth.rec.net:recnet") == null){
        console.warn("Unable to cheer, Error Code: NoAuth")
		alert("You need to be logged in to perform this action!")
		return null;
    }
	let CheerInput = prompt("Please Type a cheer you want to give.", "General,Helpful,Sportmanship,GreatHost,Creative");
	if (CheerInput != null) {
		for (var i = 0; i < CheersString.length; i++) {
			if (CheersString[i] == CheerInput) {
			var CheerCategory = CheersVar[i]
			}
		}
	}
    fetch("https://api.rec.net/api/PlayerCheer/v1/create", {
		"headers": {
			"authorization": "Bearer " + JSON.parse(localStorage.getItem("oidc.user:https://auth.rec.net:recnet")).access_token,
			"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
		},
		"body": "PlayerIdTo=" + CurrentPageUserId + "&CheerCategory="+CheerCategory+"&RoomId=1&Anonymous=False",
		"method": "POST",
		"mode": "cors"
	}).then(d => d.json()).then(j => console.log(j))
}

})

}, 3000);
