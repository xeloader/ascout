import axios from 'axios'
import cheerio from 'cheerio'

const BASE_URL = 'https://www.pn-trading.se'
class PNTrading {
  async getData () {
    const response = await axios.post(`${BASE_URL}/auktionsja.aspx`)
    const auctionIds = response.data.map(({ paplatsnamn }) => paplatsnamn)
    const items = await this.getItems(auctionIds[1])
    return items
  }

  async getItems (auctionId) {
    const url = `${BASE_URL}/paplatsja.aspx?id=${auctionId}`
    const response = await axios.get(url)
    return response.data.map((item) => ({
      link: `${BASE_URL}/tabid/98/id/${item.id}/default.aspx`,
      image: item.bild,
      title: item.beskrivning
    }))
  }
}

export default PNTrading
