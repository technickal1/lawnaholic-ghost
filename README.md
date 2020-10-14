# joben

A Ghost CMS theme.

## Requirements

Ghost 3.0 or higher

## Config

The package.json file contains the basic configuration like `posts_per_page` 
and responsive image sizes.

## Development

The development environment consists of several gulp tasks.
1. `gulp css`
Process the css files from 'assets/css' folder into a single file using PostCSS 
that will be used by the theme.

2. `gulp js`
Compile the js files from 'assets/js' folder into a single file that will 
be used by the theme.

3. `gulp zip`
This task compresses the theme files into theme_name.zip in the 'dist' folder.

4. The deafault task `gulp` or `gulp dev`.
Runs a series of tasks necessary for local development/customizing.

## Demo

[](https://bironthemes.com/)

## Documentation

[](https://bironthemes.com/)
