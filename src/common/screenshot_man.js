import fs from './filesystem'
import FileMan from './file_man'
import Ext from './web_extension'

export class ScreenshotMan extends FileMan {
  constructor (opts = {}) {
    super({ ...opts, baseDir: 'screenshots' })
  }

  write (fileName, blob) {
    return fs.writeFile(this.__filePath(fileName, true), blob)
  }

  read (fileName) {
    return fs.readFile(this.__filePath(fileName), 'ArrayBuffer')
  }

  readAsDataURL (fileName) {
    return fs.readFile(this.__filePath(fileName), 'DataURL')
  }

  getLink (fileName) {
    if (!Ext.isFirefox()) return Promise.resolve(super.getLink(fileName) + '?' + new Date().getTime())

    // Note: Except for Chrome, the filesystem API we use is a polyfill from idb.filesystem.js
    // idb.filesystem.js works great but the only problem is that you can't use 'filesystem:' schema to retrieve that file
    // so here, we have to convert the file to data url
    return fs.readFile(this.__filePath(fileName), 'DataURL')
  }
}

let man

export function getScreenshotMan (opts = {}) {
  if (opts) {
    man = new ScreenshotMan(opts)
  }

  if (!man) {
    throw new Error('screenshot manager not initialized')
  }

  return man
}
