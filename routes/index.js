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
	for (let i = 0; i < currentNotes.length; i++) {
		if (currentNotes[i].includes(oldNoteID)) {
			// TODO: if note name contains "../", path traversal may be possible
			console.log("Removing stale note: notes/"+currentNotes[i])
			fs.unlinkSync("notes/"+currentNotes[i])
		}
	}

	fs.writeFileSync("notes/"+noteTitle+"-"+newNoteID, noteText)

	res.sendStatus(200)
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
		notes.push({"noteText":noteText, "noteTitle":noteTitle, "noteID":noteID})
	}
	
	res.send(notes)
})

function newID() {
	return (new Date()).toISOString().replace(/[^0-9]/g, "")
}

function dateSort(a,b) {
	aVal = parseInt(a.split("-").pop())
	bVal = parseInt(b.split("-").pop())
	return aVal - bVal
}

// https://stackoverflow.com/a/26482552
function removeSpecials(str) {
	var lower = str.toLowerCase();
	var upper = str.toUpperCase();

	var res = "";
	for(var i=0; i<lower.length; ++i) {
		if(lower[i] != upper[i] || lower[i].trim() === '')
			res += str[i];
		}
	return res;
}

module.exports = router
