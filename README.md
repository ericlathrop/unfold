unfold
======

A data-driven static site generator.

 * Supports handlebars templates.
 * Supports SASS.

Usage: `unfold site.json`

The site.json file should look like:

```
{
	"sourceDirectory": "src",
	"destinationDirectory": "dest",
	"dataDirectory": "data",
	"partialsDirectory": "partials",
	"data": {
		"layout": "layout.html.hbs"
	}
	"pages": {
		"src/specialPage.html.hbs": {
			"layout": "specialLayout.html.hbs"
		}
	}
}
```
