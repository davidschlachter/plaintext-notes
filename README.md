Plain text file backed note-taking app with web interface. Self-hosted Google Keep alternative.

Idea: edit notes on phone via web-interface, edit on computer by editing plain-text files (I use Syncthing to share text files between server and various clients).

Not designed with security in mind -- best run behind HTTP authentication. Each instance has only one store of notes (not multi-user).

The node app must have write access to the 'notes' directory.
