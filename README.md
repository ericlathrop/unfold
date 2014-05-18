unfold
======

A static site generator.

 * Supports handlebars templates.

Usage: `unfold site.json`

The site.json file should look like:

```
{
	"sourceDirectory": "src",
	"destinationDirectory": "dest",
	"dataDirectory": "data",
	"data": {
		"layout": "layout.html.hbs"
	}
}
```
