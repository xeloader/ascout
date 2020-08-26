import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.psauction.se'
class PNTrading {
  async getData (page = 1) {
    const url = `${BASE_URL}/search/antal=100&sida=${page}`
    console.log(url)
    const response = await axios.get(url)
    const $ = cheerio.load(response.data)
    const items = $('.content li')
    console.log(response.data)
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

export default PNTrading
