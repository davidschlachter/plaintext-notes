$(document).ready(function() {
	getNotes()
})

function getNotes() {
	$.ajax({
		method: "GET",
		url: "getNotes",
		success: showNotes,
		dataType: "json"
	})
}

function showNotes(notes) {
	console.log(notes)
	let thisNote = ""
	for (let i=0; i < notes.length; i++) {
		thisNote = "<div class=note id='"+notes[i].noteID+"'><h2>"+notes[i].noteTitle+"</h2><p>"+notes[i].noteText.replace(/\n/g, "<br>")+"</p></div>"
		$("#notesBox").append(thisNote)
	}
}
