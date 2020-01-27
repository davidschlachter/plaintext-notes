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
		thisNote = "<div class=note id='"+notes[i].noteID+"'><div class=edit id='edit-"+notes[i].noteID+"'>Edit</div><h2>"+notes[i].noteTitle+"</h2><p>"+notes[i].noteText.replace(/\n/g, "<br>")+"</p></div>"
		$("#notesBox").append(thisNote)
	}
	// event listeners can be added after notes are loaded
	$('div.edit').click(editNote)
}

function editNote(event) {
	noteID = event.target.id.replace("edit-", "")
	noteTitle = $("#"+noteID+" > h2").text()
	noteText  = unsanitize($("#"+noteID+" > p").text())
	$("#noteText").val(noteText)
	$("#noteTitle").val(noteTitle)
	$("#noteID").val(noteID)
	$("#"+noteID).remove()
	window.scrollTo(0, 0)
}

function unsanitize(s) {
    return s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&#x2F;/g, "/")
}
