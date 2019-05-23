const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const mdit = require('markdown-it')
const meta = require('markdown-it-meta')
const normalizePath = require('normalize-path')
const handlebars = require('handlebars')
const md = new mdit()
md.use(meta)

const layouts = []
const pages = []

module.exports.layouts = layouts
module.exports.pages = pages
module.exports.edit = null

const _urls = []

function run () {
  fs.readdir('./layouts', (err, files) => {
    files.forEach(file => {
      parseLayout('./layouts/' + file)
    })
  })
  
  const watcher = chokidar.watch('./pages', {
    persistent: true
  });
  
  watcher.on('add', path => parsePage(path))
  watcher.on('change', path => parsePage(path))
  
  fs.readFile(path.resolve() + '/pagr/web/edit.html', (err, data) => {
    module.exports.edit = handlebars.compile(data.toString())
  })
}

module.exports.run = run

function getPageFile (filename) {
  return pages[_urls[filename]].raw
}
module.exports.getPageFile = getPageFile

function getPageUrl (filename) {
  return _urls[filename]
}

module.exports.getPageUrl = getPageUrl

function getPage (name) {
  if (!pages[name]) throw new Error ('Page not found')
  let meta = pages[name].meta
  return layouts[meta.layout]({
    ...meta,
    _FILENAME_: pages[name].filename,
    _HTML_: pages[name].html
  })
}
module.exports.getPage = getPage

function parsePage (filename) {
  filename = normalizePath(filename)
  fs.readFile('./' + filename, (err, data) => {
    filename = filename.split('/')[1].split('.')[0]
    let html
    try {
      html = md.render(data.toString())
    } catch (e) {
      html = "Error while rendering page: " + e.message
    }
    if (_urls[filename]) {
      pages[_urls[filename]] = undefined
    }
    _urls[filename] = md.meta.url
    
    pages[_urls[filename]] = {
      meta: md.meta,
      filename,
      raw: data.toString(),
      html
    }
    // BUG: when removing a property from the yaml metadata and the watcher is triggered, the markdown does not get rendered
  })
}

function parseLayout (filename) {
  filename = normalizePath(filename)
  fs.readFile(filename, (err, data) => {
    layouts[filename.split('/')[2].split('.')[0]] = handlebars.compile(data.toString())
  })
}