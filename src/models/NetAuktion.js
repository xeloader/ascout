import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.netauktion.se'
class Budi {
  async getData (page = -1) {
    if (page === -1) {
      const first = await this.getPage(1)
      let lastLink
      let i = 2
      const results = []
      while (first[0].link !== lastLink) {
        console.log('getting page ' + i)
        const data = await this.getPage(i)
        results.push(data)
        lastLink = data[0].link
        i++
      }
      return [first, ...results]
    } else {
      return this.getPage(page)
    }
  }

  async getPage (page) {
    const response = await axios.post(`${BASE_URL}/kategori/alla?pagenumber=${page}`)
    const $ = cheerio.load(response.data)
    const items = $('.categori-grid > article')
    const result = items.map((index) => {
      const item = $(items[index])
      const link = BASE_URL + item.find('.link-div a').attr('href')
      const image = BASE_URL + item.find('.display-img img').attr('src')
      const title = (item.find('.object-card-title-text').text().trim())
      return { link, image, title }
    })
    return result.toArray()
  }
}

export default Budi
