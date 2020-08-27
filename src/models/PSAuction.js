import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.psauction.se'
class PSAuction {
  async getData (page = 1) {
    const url = `${BASE_URL}/search?antal=100&sida=${page}`
    console.log(url)
    const response = await axios.get(url)
    console.log(response.data)
    const $ = cheerio.load(response.data)

    const codedItems = $('.auctions-list')
    codedItems.each((item) => {
      console.log(item)
    })
    if (codedItems.length > 0) {
      const items = codedItems[0].attr()
    }
    console.log(codedItems)
    return
    const result = items.map((index) => {
      const item = $(items[index])
      const image = item.find('.image').attr('style')
      return {
        link: BASE_URL + item.find('a').attr('href'),
        title: item.find('.title').text().trim(),
        image: image && image.trim()
          .replace('background-image:url(\'', '')
          .replace('\');', '')
      }
    })
    return result.toArray()
  }
}

export default PSAuction
