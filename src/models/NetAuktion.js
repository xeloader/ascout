import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.netauktion.se'
class Budi {
  async getData (page = 1) {
    const response = await axios.post(`${BASE_URL}/kategori/alla?pagenumber=${page}`)
    const $ = cheerio.load(response.data)
    const items = $('.categori-grid > article')
    const result = items.map((index) => {
      const item = $(items[index])
      const link = item.find('.link-div a').attr('href')
      const image = item.find('.display-img img').attr('src')
      const title = item.find('.object-card-title-text').text().trim()
      return { link, image, title }
    })
    return result.toArray()
  }
}

export default Budi
