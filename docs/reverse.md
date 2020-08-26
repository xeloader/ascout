## PN Trading

### Get auctions?
POST/GET https://www.pn-trading.se/auktionsja.aspx?randomkey=isf47
https://www.pn-trading.se/auktions1j.aspx?auktion=CrystalRetailSwedenAB4&randomkey=z14zj

### Get items from auction 
GET/POST https://www.pn-trading.se/paplatsja.aspx?id=CrystalRetailSwedenAB4&randomkey=rw4ey

## PS Auction

### Get all items in page view
https://psauction.se/search/antal=100&sida=1

## Auktionstorget

POST https://auktion.kronofogden.se/auk/w.objectlist?inC=KFM&inA=WEB
inPageNo=1

.col_obj_list
    bild: .obj_thumb_container:src
    titel: obj_txt_inner:text
    länk: obj_fav~div > a:href

## Tradera

Har bevakning redan, väntar.

## Blocket

Har bevakning redan, väntar.

## Budi

POST https://www.budi.se/
page=4&filter=

#items-wrapper .row
    länk: .card-image a
    bild: .card-image img
    text: .yeyetest .ad-title

## Units

### Alla pågående auktioner

HTML
GET https://www.units.se/auction/

.row:3rd > div:first-child .panel 
    länk: a

### Objekt på auktionssidan

#objectlist-leftcol~div > .panel (next to objectlist)
    länk: a
    bild: img
    titel: .title

## Netauktion

https://www.netauktion.se/kategori/alla?pagenumber=1

.categori-grid > article 
    bild: .display-img img
    titel: .object-card-title-text
    länk: .link-div a