import fs from 'fs'
import chokidar from 'chokidar'
import mdit from 'markdown-it'
import meta from 'markdown-it-meta'

const md = new mdit()
md.use(meta)

export const pages = []

const _urls = []

export function run () {
  fs.readdir('./pages', (err, files) => {
    files.forEach(file => {
      parse('./pages/' + file)
    });
  });

  const watcher = chokidar.watch('./pages', {
    persistent: true
  });

  watcher.on('add', path => parse(path))
  watcher.on('change', path => parse(path))
}

function parse (filename) {
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