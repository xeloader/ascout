import fs from 'fs'

import Budi from './models/Budi'
import NA from './models/NetAuktion'
import PT from './models/PNTrading'
import Units from './models/Units'
import PSA from './models/PSAuction'
import Riksauktioner from './models/Riksauktioner'

import { ArgumentParser } from 'argparse'
import { version } from '../package.json'

function flatten (arr) {
  return arr.reduce(function (flat, toFlatten) {
    return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten)
  }, [])
}

const Auctions = {
  pnt: new PT(),
  psa: new PSA(),
  na: new NA(),
  budi: new Budi(),
  units: new Units(),
  riks: new Riksauktioner()
}

const parser = new ArgumentParser({
  description: 'Search for konkursauktioner'
})

parser.add_argument('-v', '--version', { action: 'version', version })
parser.add_argument('-f', '--force', { action: 'store_true', help: 'Do not use cache' })
parser.add_argument('-p', '--page', { type: 'int', help: 'Page to fetch, not set will get all.' })
parser.add_argument('-s', '--service', { help: 'Service to check, not set will get from all.' })
parser.add_argument('-o', '--output', { help: 'Write output to file, default stdout' })
parser.add_argument('SEARCH', { nargs: '*', help: 'The keyword to search for' })

const args = parser.parse_args()

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

if (!cached || args.force) {
  console.log({ services })
  const promises = services.map((service) => Auctions[service].getData(args.page))
  Promise.allSettled(promises)
    .then((settled) => {
      const failed = settled.filter(({ status }) => status === 'rejected')
      console.log('failed promises', failed)
      const data = settled
        .filter(({status}) => status !== 'rejected')
        .map(({ value }) => value)
      console.log('caching ' + id)
      const flattened = flatten(data)
      const formatted = {
        updatedAt: new Date().toISOString(),
        items: flattened
      }
      const jsonContent = JSON.stringify(formatted)
      fs.writeFileSync(cacheName, jsonContent)
      if (args.output) {
        fs.writeFileSync(args.output, jsonContent)
      }
      console.log(jsonContent)
    })
} else {
  const jsonContent = cached.toString()
  if (args.output) {
    fs.writeFileSync(args.output, jsonContent)
  }
  console.log(jsonContent)
}
