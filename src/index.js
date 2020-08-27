import fs from 'fs'
import Fuse from 'fuse.js'

import Budi from './models/Budi'
import NA from './models/NetAuktion'
import PT from './models/PNTrading'
import Units from './models/Units'
import PSA from './models/PSAuction'

import { ArgumentParser } from 'argparse'
import { version } from '../package.json'
import { exit } from 'process'

function flatten (arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

const Auctions = {
  pnt: new PT(),
  na: new NA(),
  budi: new Budi(),
  units: new Units()
}
const parser = new ArgumentParser({
  description: 'Search for konkursauktioner'
})

const searchFor = (keyword, data) => {
  const fuse = new Fuse(data, {
    keys: ['title']
  })
  return keyword.map((kw) => fuse.search(kw))
}

parser.addArgument('-v', '--version', { action: 'version', version })
parser.addArgument('-f', '--force', { help: 'Do not use cache' })
parser.addArgument('-p', '--page', { type: 'int', help: 'Page to fetch, not set will get all.' })
parser.addArgument('-s', '--service', { help: 'Service to check, not set will get from all.' })
parser.addArgument('SEARCH', { nargs: '*', help: 'The keyword to search for' })

const args = parser.parse_args()
console.log(args)

const today = new Date()
const services = args.service
  ? args.service.split(',')
  : Object.keys(Auctions)
const id = '' + today.getFullYear() + today.getMonth() + today.getDate() + args.service + args.page
const cacheName = `./cache/${id}.json`
let cached
try {
  cached = fs.readFileSync(cacheName)
} catch (e) {
  console.log('no cache found')
}

if (!cached) {
  const promises = services.map((service) => Auctions[service].getData(args.page))
  Promise.all(promises)
    .then((data) => {
      console.log('caching ' + id)
      const flattened = flatten(data)
      fs.writeFileSync(cacheName, JSON.stringify(flattened))
      console.log(searchFor(args.SEARCH, flattened))
    })
} else {
  const parsed = JSON.parse(cached)
  console.log(searchFor(args.SEARCH, parsed))
}
