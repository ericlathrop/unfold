unfold
======

A data-driven static site generator.

 * Supports handlebars templates.
 * Supports custom partials and helpers for handlebars.
 * Supports SASS.

Usage: `unfold site.json`

The site.json file should look like:

```
{
	"sourceDirectory": "src",
	"destinationDirectory": "dest",
	"dataDirectory": "data",
	"partialsDirectory": "partials",
	"helpersDirectory": "helpers",
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

Site Specification
------------------
`sourceDirectory`: The directory storing the original version of the site. Handlebars templates and SASS files in this directory will be processed and output to `destinationDirectory`. All other files will be copied to `destinationDirectory` unmodified.

`destinationDirectory`: The "unfolded" output version of the site.

`dataDirectory`: All JSON files in this directory will be merged into the `data` field with a key of their filename without the `.json`.

`partialsDirectory`: A directory containing Handlebars partials. Example: a file named `_something.html.hbs` will be loaded as a partial named `something` and available for use in handlebars as `{{>something}}`.

`helpersDirectory`: A directory containing handlebars helpers. Example: a file named `something.js` will be loaded as a helper named `something` and available for use in handlebars as `{{something}}`. Helper files should export a single function.

`data`: Data available to the handlebars templates. `layout` is a special key that specifies a layout template to wrap around the current file. The handlebars file specified in `layout` should contain a reference to the `{{>body}}` partial where the current page will be loaded.

`pages`: Per-page data that overrides keys in `data` and is made available to handlebars templates.
