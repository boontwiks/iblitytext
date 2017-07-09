/*
 * About this file:
 * This file hosts the server for the main web site.
 *
 */

// Quick constants:
const _port = 33333
const _globals = require('./globals.json')

// CODE

// Requires
const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()
const sass = require('node-sass')
const handlebars = require('handlebars')
const readline = require('readline');

// Load-Time Constants
var content_home;

// Handlebars helpers
handlebars.registerHelper('if_even', (conditional, options) => {
	if ((conditional % 2) == 0) return options.fn(this)
	else return options.inverse(this)
})
handlebars.registerHelper('if_odd', (conditional, options) => {
	if ((conditional % 2) != 0) return options.fn(this)
	else return options.inverse(this)
})

// Templates
var template_home;
function compile_handlebars() {
	content_home = eval('(' + fs.readFileSync(path.join(__dirname, 'dev/contents/home.json')).toString() + ')') // we can use eval because contents are server-side and should be safe.
	template_home = handlebars.compile(fs.readFileSync(path.join(__dirname, 'dev/html/home.html')).toString())
}

function compile_sass() {
	// TODO: Easily compule the entire directory
	sass.render({
		file: path.join(__dirname, 'dev/styles/home.sass'),
		outFile: path.join(__dirname, 'public/styles/home.css')
	}, (err, result) => {
		if (err)
			return console.error('Sass encountered an error:', err)
		fs.writeFile(path.join(__dirname, 'public/styles/home.css'), result.css, (err) => {
			if (err)
				return console.error('Error writing compiled css')
		})
	})
}

compile_handlebars()
compile_sass()

// Application
app.get('/', (req, res) => {
	var data = {'page': _globals.pages.general, 'content': content_home}
	res.send(template_home(data))
})

app.use(express.static(path.join(__dirname, 'public')))

app.listen(_port, (err) => {
	if (err)
		return console.error('Something bad happened with the server:', err)
	console.log('Express Server listening on Port ' + _port)
	console.log("Press 'r' to recompile html and css")
})

// Keyboard input
readline.emitKeypressEvents(process.stdin);
process.stdin.setRawMode(true)
process.stdin.on('keypress', (chunk, key) => {
	if(key.sequence === '\u0003') {
        process.exit();
    }
	if (key && key.name == 'r') {
		process.stdout.write('Recompiling templates and sass...')
		compile_handlebars()
		compile_sass()
		process.stdout.write('\r                                 \rDone.')
		setTimeout(() => {process.stdout.write('\r     \r')}, 500) //fancy! we don't want to clog the console.
	}
})
