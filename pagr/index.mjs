import fs from 'fs'
import path from 'path'
import chokidar from 'chokidar'
import mdit from 'markdown-it'
import meta from 'markdown-it-meta'

import handlebars from 'handlebars'

const md = new mdit()
md.use(meta)

export const layouts = []
export const pages = []
export let edit = null;

const _urls = []

export function run () {
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
    edit = handlebars.compile(data.toString())
  })
}

export function getPageFile (filename) {
  return pages[_urls['pages/' + filename + '.md']].raw
}

export function getPageUrl (filename) {
  return _urls['pages/' + filename + '.md']
}

export function getPage (name) {
  if (!pages[name]) throw new Error ('Page not found')
  let meta = pages[name].meta
  return layouts[meta.layout]({
    ...meta,
    _FILENAME_: pages[name].filename,
    _HTML_: pages[name].html
  })
}

function parsePage (filename) {
  fs.readFile('./' + filename, (err, data) => {
    const html = md.render(data.toString())
    if (_urls[filename]) {
      pages[_urls[filename]] = undefined
    }
    _urls[filename] = md.meta.url
    pages[_urls[filename]] = {
      meta: md.meta,
      filename: filename.split('/')[1].split('.')[0],
      raw: data.toString(),
      html
    }
    // BUG: when removing a property from the yaml metadata and the watcher is triggered, the markdown does not get rendered
  })
}

function parseLayout (filename) {
  fs.readFile(filename, (err, data) => {
    layouts[filename.split('/')[2].split('.')[0]] = handlebars.compile(data.toString())
  })
}