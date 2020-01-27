module.exports = {
	apps: [{
		name: 'plaintext-notes',
		script: 'bin/www',
		watch: ['app.js', 'routes/index.js', 'public/index.html', 'public/javascripts/notes.js', 'public/stylesheets/style.css'],
		env: {
			NODE_ENV: 'development'
		},
		env_production: {
			NODE_ENV: 'production'
		}
	}]
};
