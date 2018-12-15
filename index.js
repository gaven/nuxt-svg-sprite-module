const chalk = require('chalk')
const File = require('vinyl')
const inject = require('inject-snippet')
const SVGSpriter = require('svg-sprite')

const { join } = require('path')
const { readdirSync, readFileSync, writeFileSync, existsSync } = require('fs')

// SVG sprite options
let options = {
	shape: {
		id: {
			generator: 'icon-%s'
		},
		transform: ['svgo']
	},
	mode: {
		inline: true,
		symbol: true
	}
}

const injectSprite = (sprite, templatePath) => {
	// Create HTML string from svg sprite
	const spriteString = `
		<div id='svg-defs'>
			${sprite}
		</div>
	`
	// Get html contents of template file
	let injectedTemplate

	try {
		injectedTemplate = readFileSync(templatePath, 'utf8')
	} catch (err) {
		console.log(chalk.red(err))
		return
	}

	// Return template with injected sprite sheet
	return inject(injectedTemplate, spriteString, { tag: 'svg-sprite', action: 'replace' })
}

const createTemplateSprite = (sprite) => {
	return `
		<!DOCTYPE html>
		<html {{ HTML_ATTRS }}>
			<head>
				{{ HEAD }}
				<style>
					#svg-defs {
						width: 0;
						height: 0;
						overflow: hidden;
						position: absolute;
					}
				</style>
			</head>
			<body {{ BODY_ATTRS }}>
				<div id='svg-defs'>
					${sprite}
				</div>
				{{ APP }}
			</body>
		</html>
	`
}


module.exports = function (moduleOptions) {
	// Get directory from module options
	const { directory } = moduleOptions

	// Get svg options from module options
	const { options: svgSpriteOptions } = moduleOptions

	// Make sure there are svg options
	if (svgSpriteOptions && Object.keys(svgSpriteOptions).length) {
		options = Object.assign({}, options, svgSpriteOptions)
	}

	// Create new instance of SVGSpriter
	const sprite = new SVGSpriter(options)


	// Directory where svgs are stored
	const svgDirectory = join(process.cwd(), directory)

	// Loop over svgs in directory and add to sprite
	let svgs

	try {
		svgs = readdirSync(svgDirectory)
	} catch(err) {
		console.log(chalk.red(err))
		return
	}

	svgs.forEach((svg) => {
		const path = `/${svg}`
		sprite.add(new File({
			path: join(svgDirectory, path),
			base: svgDirectory,
			contents: readFileSync(join(svgDirectory, path))
		}))
	})

	sprite.compile((err, result) => {

		// Console.log and return if error
		if (err) {
			console.log(chalk.red(err))
			return
		}

		// Get sprite contents from vinyl file
		const { sprite } = result.symbol
		const data = sprite.contents.toString('utf8')

		let appHtml
		const templateDir = join(process.cwd(), 'app.html')

		// If template exists inject svg sprite
		if (existsSync(templateDir)) {
			appHtml = injectSprite(data, templateDir)
		// Else create template with svg sprite injected
		} else {
			appHtml = createTemplateSprite(data)
		}

		// Write created file to directory
		try {
			writeFileSync('app.html', appHtml)
			console.log(chalk.green('\u2714 success'), 'SVG sprite injected')
		} catch(err) {
			console.log(chalk.red('\u2718 error'), 'SVG sprite could not be generated')
		}
	})
}

module.exports.meta = require('./package.json')
