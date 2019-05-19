import fs from 'fs'
import chokidar from 'chokidar'
import mdit from 'markdown-it'
import meta from 'markdown-it-meta'

import handlebars from 'handlebars'

const md = new mdit()
md.use(meta)

export const templates = []
export const pages = []

const _urls = []

export function run () {
  // fs.readdir('./pages', (err, files) => {
  //   files.forEach(file => {
  //     parsePage('./pages/' + file)
  //   });
  // });

  fs.readdir('./layouts', (err, files) => {
    files.forEach(file => {
      parseLayout('./layouts/' + file)
    });
  });

  const watcher = chokidar.watch('./pages', {
    persistent: true
  });

  watcher.on('add', path => parsePage(path))
  watcher.on('change', path => parsePage(path))
}

export function getPage (name) {
  let meta = pages[name]
  layouts[meta.layout]({
    ...meta,
    _HTML_: pages[name].html
  })
}

function parsePage (filename) {
  fs.readFile(filename, (err, data) => {
    const html = md.render(data.toString())
    if (_urls[filename]) {
      pages[_urls[filename]] = undefined
    }
    _urls[filename] = md.meta.url
    pages[_urls[filename]] = {
      meta: md.meta,
      html
    }
  })
}

function parseLayout (filename) {
  s.readFile(filename, (err, data) => {
    layouts[filename.split('.')[0]] = handlebars.compile(data.toString())
  })
}