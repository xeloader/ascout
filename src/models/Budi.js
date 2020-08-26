import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.budi.se'
class Budi {
  async getData () {
    const response = await axios.post(`${BASE_URL}/`, { page: 1, filter: 0 })
    const $ = cheerio.load(response.data)
    const items = $('#items-wrapper .yeyetest')
    const formatted = items.map((i) => {
      const item = $(items[i])
      const link = item.find('a').attr('href')
      const image = item.find('img').attr('src')
      const title = item.find('.ad-title').text().trim()
      return { link, image, title }
    })
    return formatted.toArray()
  }
}

export default Budi
