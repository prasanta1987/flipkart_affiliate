let request = require('request')

const itemName = document.querySelector('#itemsearch')
const searchBtn = document.querySelector('#searchbtn')
const cardContainer = document.querySelector('#cardcontainer')


searchBtn.addEventListener('click', () => {

    const itemToSearch = itemName.value
    var options = {
        method: 'GET',
        url: 'https://affiliate-api.flipkart.net/affiliate/1.0/search.json',
        // qs: { query: itemToSearch, resultCount: '10' },
        qs: { query: itemToSearch },
        headers:
        { 
            'Postman-Token': '8c04b704-23a4-4cc7-af5e-fd7f0c46743f',
            'cache-control': 'no-cache',
            'Fk-Affiliate-Token': '37aab18a3e8e48da95f50ee7e1a6d951',
            'Fk-Affiliate-Id': 'prasanta13'
        }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);

        const data = JSON.parse(body)
        console.log(data)
        cardContainer.innerHTML = ''

        fetchData(data)
    });
})



function fetchData(data) {
    
    for (i = 0; i < data.products.length; i++) {
        
        offers = data.products[i].productBaseInfoV1.offers
        itemTitle = data.products[i].productBaseInfoV1.title
        itemImage = data.products[i].productBaseInfoV1.imageUrls["400x400"]
        itemdescription = data.products[i].productBaseInfoV1.productDescription
        mrp = data.products[i].productBaseInfoV1.maximumRetailPrice.amount
        flSellPrice = data.products[i].productBaseInfoV1.flipkartSellingPrice.amount
        flSpecialPrice = data.products[i].productBaseInfoV1.flipkartSpecialPrice.amount
        currencyFormat = data.products[i].productBaseInfoV1.flipkartSpecialPrice.currency
        productUrl = data.products[i].productBaseInfoV1.productUrl
        // cardContainer.innerHTML = ''
        let cardbody = document.createElement('div')
        cardbody.className = 'row border rounded'
        cardbody.style.padding = '10px'
        cardbody.style.marginBottom = '10px'
        cardbody.innerHTML = `
        <div class="col-sm-2 text-center">
            <img class="img-fluid" src="${itemImage}" alt="Card image">
            <hr>
            <a class="btn btn-success" href="${productUrl}" target="_blank">Buy Now</a>
        </div>
        <div class="col-sm-10">
            <h5><b>${itemTitle}</b></h5></br>
            <small>${itemdescription}</small><hr>
            <div class="row" id="pricecontainer${i}">
                <div class="col-sm">
                    <small>Maximum Retail Price: ${mrp} ${currencyFormat}</small></br>
                    <small>Selling Price: ${flSellPrice} ${currencyFormat}</small></br>
                    <small>Flipkart Special Price: ${flSpecialPrice} ${currencyFormat}</small>
                </div>
            </div>
        </div>
        `
        cardContainer.appendChild(cardbody)
        const priceContainer = document.getElementById(`pricecontainer${i}`)
        const offerContainer = document.createElement('div')
        offerContainer.className = 'col-sm'
        for (k = 0; k < offers.length; k++) {
            const offerItem = document.createElement('small')
            offerItem.style.display = 'block'
            offerItem.innerHTML += `${k+1}: ${offers[k]}`
            offerContainer.appendChild(offerItem)
        }
        priceContainer.appendChild(offerContainer)
    }
}
