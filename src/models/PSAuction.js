import axios from 'axios'
import cheerio from 'cheerio'
import setCookie from 'set-cookie-parser'

const BASE_URL = 'https://www.psauction.se'

const getNumberOfPages = content => {
  return content.pagination.reduce((acc, cur) => Math.max(acc, cur.page), 0)
}
class PSAuction {
  async setupSession() {
    const url = BASE_URL
    const response = await axios.get(url)
    const cookies = response.headers['set-cookie']
    const parsedCookies = setCookie.parse(cookies)
    const sessionCookie = parsedCookies.find((cookie) => cookie.name === 'SFSESSID')
    this.sessionCookie = sessionCookie
  }
  async getPage (page = 1) {
    const url = `${BASE_URL}/search/antal=100&sida=${page}`
    const cookie = `${this.sessionCookie.name}=${this.sessionCookie.value}`
    const response = await axios.get(url, {
      withCredentials: true,
      headers: {
        Cookie: cookie,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'Accept-Encoding': 'gzip, deflate, br',
        'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Host': 'psauction.se',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'none',
        'Sec-Fetch-User': '?1',
        'Sec-GPC': '1',
        'Upgrade-Insecure-Requests': '1',
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      }
    })
    const $ = cheerio.load(response.data)
    const jsonStr = $('.auctions-list').attr('psitemsearchcontainer')
    const json = JSON.parse(jsonStr)
    const results = json.items.map((item) => {
      return {
        link: `${BASE_URL}/item/view/${item.id}/${item.slug}`,
        image: item.thumbnail,
        title: item.name
      }
    })
    return {
      results,
      content: json
    }
  }
  async getData(page = 1) {
    await this.setupSession()
    const { content } = await this.getPage()
    const nPages = getNumberOfPages(content)
    console.log('fetching n pages', nPages)
    const pages = Array(8).fill(0)
    const promises = pages.map((_,i) => this.getPage(i + 1))
    const results = await Promise.all(promises)
    const products = results.reduce((acc, cur) => [...acc, ...cur.results], [])
    console.log('psauction', products.length)
    return products
  }
}

export default PSAuction
