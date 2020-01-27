var express = require('express')
var router = express.Router()
const fs = require("fs")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Plaintext notes' })
})

router.post('/updateNote', function(req, res, next) {
	let noteText  = req.body.noteText
	let noteTitle = removeSpecials(req.body.noteTitle).replace(" ", "-")
	let oldNoteID = req.body.noteID
	let newNoteID = newID()

	console.log("noteTitle: "+noteTitle)
	console.log("noteText: "+noteText)
	console.log("oldNoteID: "+oldNoteID)

	let currentNotes = fs.readdirSync('notes/')
	if (oldNoteID) {
		for (let i = 0; i < currentNotes.length; i++) {
			if (currentNotes[i].includes(oldNoteID)) {
				// TODO: if note name contains "../", path traversal may be possible
				console.log("Removing stale note: notes/"+currentNotes[i])
				fs.unlinkSync("notes/"+currentNotes[i])
			}
		}
	}

	fs.writeFileSync("notes/"+noteTitle+"-"+newNoteID, noteText)

	res.redirect('index.html')
})

router.post('/deleteNote', function(req, res, next) {
})

router.get('/getNotes', function(req,res,next) {
	let currentNotes = fs.readdirSync('notes/')

	let notes = []
	let noteTitle = ""
	let noteText  = ""
	let noteID    = ""

	// need to return the notes in reverse chronological order
	currentNotes.sort(dateSort)

	for (let i = 0; i < currentNotes.length; i++) {
		if (currentNotes[i].includes("README")) continue
		noteText = fs.readFileSync("notes/"+currentNotes[i],'utf8')
		noteTitle= currentNotes[i].split("-").slice(0, currentNotes[i].split("-").length - 1).join("-")
		noteID   = currentNotes[i].split("-").pop()
		notes.push({"noteID":noteID, "noteTitle":noteTitle, "noteText":sanitize(noteText)})
	}
	console.log(" Sending notes:"); for (let i = 0; i < notes.length; i++) {console.log(notes[i].noteID+" "+notes[i].noteTitle)}
	
	res.send(notes)
})

function newID() {
	let rightNow = new Date()
	return rightNow.toISOString().replace(/\.[0-9][0-9]*Z/, "").replace(/[^0-9]/g, "")
}

function dateSort(a,b) {
	aVal = parseInt(a.split("-").pop())
	bVal = parseInt(b.split("-").pop())
	if (bVal - aVal > 0) {
		return 1
	} else if (bVal - aVal < 0) {
		return -1
	} else {
		return 0
	}
}

// https://stackoverflow.com/a/26482552
function removeSpecials(str) {
	var lower = str.toLowerCase()
	var upper = str.toUpperCase()

	var res = ""
	for(var i=0; i<lower.length; ++i) {
		if(lower[i] != upper[i] || lower[i].trim() === '')
			res += str[i]
		}
	return res.replace(/ /g,"-").toLowerCase()
}

function sanitize(string) {
	const map = {
		'&': '&amp;',
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		"/": '&#x2F;',
	};
	const reg = /[&<>"'/]/ig;
	return string.replace(reg, (match)=>(map[match]));
}

module.exports = router
