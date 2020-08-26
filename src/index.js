import Budi from './models/Budi'
import NA from './models/NetAuktion'
import PT from './models/PNTrading'

// const budi = new Budi()
// const bData = budi.getData().then(console.log)
// const na = new NA()
// const nData = na.getData().then(console.log)

const pt = new PT()
pt.getData().then(console.log)
