//Import Modules
var flipkart = require("flipkart-affiliate-client-v1");

//DOM Element References
const itemName = document.querySelector('#itemsearch')
const searchBtn = document.querySelector('#searchbtn')
const cardContainer = document.querySelector('#cardcontainer')

//Set Up Flipkart Affiliate API
var flipkartClient = new flipkart.CreateAffiliateClient({
    trackingId: "prasanta13",
    token: "37aab18a3e8e48da95f50ee7e1a6d951",
    format: "json"
});

//Search Event Listner
searchBtn.addEventListener('click', () => {
    const query = itemName.value

    flipkartClient.doKeywordSearch(query, 10)
        .then(function (value) {
            cardContainer.innerHTML = ''
            flData = JSON.parse(value.body)
            flipkartFetchData(flData)
        })
        .catch(function (err) {
            console.log(err);
        });
})

//Search Event Listner callback function
function flipkartFetchData(data) {
    for (i = 0; i < data.products.length; i++) {

        //Storing Variable for Products
        offers = data.products[i].productBaseInfoV1.offers
        itemTitle = data.products[i].productBaseInfoV1.title
        itemImage = data.products[i].productBaseInfoV1.imageUrls["400x400"]
        itemdescription = data.products[i].productBaseInfoV1.productDescription
        mrp = data.products[i].productBaseInfoV1.maximumRetailPrice.amount
        flSellPrice = data.products[i].productBaseInfoV1.flipkartSellingPrice.amount
        flSpecialPrice = data.products[i].productBaseInfoV1.flipkartSpecialPrice.amount
        currencyFormat = data.products[i].productBaseInfoV1.flipkartSpecialPrice.currency
        productUrl = data.products[i].productBaseInfoV1.productUrl

        //Creating New DOM Elements
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
            offerItem.innerHTML += `${k + 1}: ${offers[k]}`
            offerContainer.appendChild(offerItem)
        }
        priceContainer.appendChild(offerContainer)
    }
}