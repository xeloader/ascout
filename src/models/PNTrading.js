import axios from 'axios'

const BASE_URL = 'https://www.pn-trading.se'
class PNTrading {
  async getData (index = -1) {
    const response = await axios.post(`${BASE_URL}/auktionsja.aspx`)
    const auctionIds = response.data.map(({ paplatsnamn }) => paplatsnamn)
    const promises = index === -1
      ? auctionIds.map((id) => this.getItems(id))
      : [this.getItems(auctionIds[index])]
    const data = await Promise.all(promises)
    return data
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
