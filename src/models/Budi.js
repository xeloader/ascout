import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.budi.se'
class Budi {
  async getData (page = -1) {
    if (page === -1) {
      let i = 1
      const results = []
      let lastNResult = 1
      while (lastNResult > 0) {
        console.log('getting page ' + i)
        const data = await this.getPage(i)
        lastNResult = data.length
        if (lastNResult > 0) results.push(data)
        i++
      }
      return results
    } else {
      return this.getPage(page)
    }
  }

  async getPage (page) {
    const response = await axios.post(`${BASE_URL}/`, `page=${page}&filter=`, { headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } })
    const $ = cheerio.load(response.data)
    const items = $('#items-wrapper .yeyetest')
    const formatted = items.map((i) => {
      const item = $(items[i])
      const link = BASE_URL + item.find('a').attr('href')
      const image = BASE_URL + item.find('img').attr('src')
      const title = item.find('.ad-title').text().trim()
      return { link, image, title }
    })
    return formatted.toArray()
  }
}

export default Budi
