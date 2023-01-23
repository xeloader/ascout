import axios from 'axios'

const API_URL = 'https://se01.riksauktioner.se'
const FRONTEND_URL = 'https://riksauktioner.se'

class Riksauktioner {
  async getData() {
    const api = axios.create({ baseUrl: API_URL })
    const response = await api.get(`${API_URL}/objects`, {
      params: {
        page: 0,
        limit: 9999, // fetch all
        orderBy: 'position',
        order: 'asc',
        embed: true
      }
    })
    console.log('riks', response.data.total_items)
    return response.data.data.map((item) => ({
      link: `${FRONTEND_URL}/objekt/${item.id}`,
      image: item.embed.thumbnail.sizes['500x500'],
      title: item.title
    }))
  }
}

export default Riksauktioner
