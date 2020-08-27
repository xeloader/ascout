import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.units.se'
class Units {
  async getData (index = -1) {
    const response = await axios.post(`${BASE_URL}/auction/`)
    const $ = cheerio.load(response.data)
    const auctionList = $('body > .row').eq(2)
    const panel = auctionList.find('.panel')
    const aelems = panel.find('a')
    const links = aelems.map((i) => $(aelems[i]).attr('href')).toArray()
    const auctionLinks = links.map((path) => `${BASE_URL}${path}`)
    let promises
    if (index === -1) {
      promises = auctionLinks.map((url) => this.getItems(url))
    } else {
      promises = [this.getItems(auctionLinks[index])]
    }
    const result = await Promise.all(promises)
    return result
  }

  async getItems (url) {
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const itemList = $('#objectlist-leftcol').next('div').find('.panel')
    const items = itemList.map((i) => {
      const element = $(itemList[i])
      return {
        link: BASE_URL + element.find('a').attr('href').trim(),
        image: element.find('img').attr('src'),
        title: element.find('.title').text().trim()
      }
    })
    return items.toArray()
  }
}

export default Units
