//Import Modules
var flipkart = require("flipkart-affiliate-client-v1");

//DOM Element References
const itemName = document.querySelector('#itemsearch')
const searchBtn = document.querySelector('#searchbtn')
const cardContainer = document.querySelector('#cardcontainer')
const reportContainer = document.querySelector('#reports')

//Set Up Flipkart Affiliate API
var flipkartClient = new flipkart.CreateAffiliateClient({
    trackingId: "prasanta13",
    token: "37aab18a3e8e48da95f50ee7e1a6d951",
    format: "json"
});

let approvedOrders = {
    startDate: '1900-03-01',
    endDate: '2018-11-01',
    status: 'approved',
    offset: '0'
}

flipkartClient.getOrdersReport(approvedOrders)
    .then(function (value) {
        value = JSON.parse(value.body).orderList
        fetchOrders(value)
    })
    .catch(function (err) {
        console.log(err);
    });

function fetchOrders(data) {
    data.forEach((doc) => {

        approvedOderData(doc)

    })
}

function approvedOderData(doc) {
    console.log(doc)
    soldItem = doc.title
    soldItemCategory = doc.category
    soldItemPrice = doc.sales.amount
    commission = doc.tentativeCommission.amount

    const div = document.createElement('div')
    div.className = 'row'
    div.innerHTML = `
    <div class="col-sm-12 border rounded" id="approvedlist">
    <h5>${soldItem}</h5>
    </div>
    `
    reportContainer.appendChild(div)
}

// flipkartClient.doKeywordSearch('deal of the day', 10)
//     .then(function (value) {
//         cardContainer.innerHTML = ''
//         flData = JSON.parse(value.body)
//         flipkartFetchData(flData)
//     })
//     .catch(function (err) {
//         console.log(err);
//     });

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
            </div>
            <div class="col-sm-10">
                <h5><b>${itemTitle}</b></h5>
                <small>${itemdescription}</small>
                <div class="input-group">
                <input type="text" id="affUrl${i}" diasabled="diasabled" class="form-control" value="${productUrl}">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="button" onclick="clipboard(${i})">Copy</button>
                </div>
            </div>
                <hr>
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

function clipboard(point) {
    var copyText = document.getElementById("affUrl" + point);
    copyText.select();
    document.execCommand("copy");
}

