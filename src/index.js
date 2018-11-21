//Import Modules
var flipkart = require("flipkart-affiliate-client-v1");

//DOM Element References
const itemName = document.querySelector('#itemsearch')
const searchBtn = document.querySelector('#searchbtn')
const cardContainer = document.querySelector('#cardcontainer')
const apprevoedReports = document.querySelector('#apprevedreports')
const disApprevoedReports = document.querySelector('#disapprevedreports')
const totalIncomeDom = document.querySelector('#totalincome')
const orderSummery = document.querySelector('#ordersummery')
const searchContainer = document.querySelector('#searchcontainer')
const connectionError = document.querySelector('#connectionerror')
const imageSrc = document.querySelector('#dispimg');

let totalIncome = 0;
let domVisible = false;

function connectionTest() {
    if (window.navigator.onLine) {
        searchContainer.classList.remove('hide')
        connectionError.classList.add('hide')
    } else {
        searchContainer.classList.add('hide')
        connectionError.classList.remove('hide')
    }
}

setInterval(connectionTest, 1000)

document.addEventListener('keyup', (event) => {
    event.preventDefault()
    if (event.keyCode === 83 && event.shiftKey) {
        if (domVisible) {
            orderSummery.classList.add('hide')
            domVisible = false
        } else {
            orderSummery.classList.remove('hide')
            domVisible = true
        }
    }
})


//Set Up Flipkart Affiliate API
var flipkartClient = new flipkart.CreateAffiliateClient({
    trackingId: "prasanta13",
    token: "37aab18a3e8e48da95f50ee7e1a6d951",
    format: "json"
});

let orders = {
    startDate: '1900-03-01',
    endDate: '2099-11-01',
    offset: '0'
}

const approvedStatus = ['approved', 'disapproved'];

approvedStatus.forEach((Status) => {
    orders.status = Status
    flipkartClient.getOrdersReport(orders)
        .then(function (value) {
            value = JSON.parse(value.body).orderList
            value.forEach((doc) => {
                OderReports(doc, Status)
                if (Status == 'approved') {
                    totalIncome = totalIncome + doc.tentativeCommission.amount;
                }
            })
            getTotalIncome(totalIncome)
        })
        .catch(function (err) {
            console.log(err);
        });
})

function getTotalIncome(amount) {
    totalIncomeDom.innerHTML = `
    <div class="col-sm-12 bg-primary text-light rounded p-1">
    <h1 class="text-center">Total Income - ${amount}</h1>
    </div>
    `
}

function OderReports(doc, Selector) {
    soldItem = doc.title
    soldItemCategory = doc.category
    soldItemPrice = doc.sales.amount
    commission = doc.tentativeCommission.amount
    orderStatus = doc.status
    percentage = ((commission / soldItemPrice) * 100).toFixed(2) + '%'
    const div = document.createElement('div')
    div.className = 'col-sm-12'
    div.id = 'approvedlist'
    div.innerHTML = `
    <p class="w-100 text-center"><b>${soldItem}</b></p>
    <hr class="bg-light">
    <ul id="approvedItemElement">
        <li>Category : <b>${soldItemCategory}</b></li>
        <li>Selling Price : <b>${soldItemPrice}</b></li>
        <li>Commission : <b>${commission}</b></li>
        <li>Commission Percentage: <b>${percentage}</b></li>
        <li>Order Status : <b>${orderStatus}</b></li>
    </ul>
    `
    if (Selector == 'approved') {
        div.className = 'border rounded border-light bg-success text-light'
        div.style.padding = '5px 0px 0px 0px'
        apprevoedReports.appendChild(div)
    } else {
        div.className = 'border rounded border-light bg-danger text-light'
        div.style.padding = '5px 0px 0px 0px'
        disApprevoedReports.appendChild(div)
    }
}

//Search Event Listner
itemName.addEventListener('keyup', (e) => {
    e.preventDefault()
    if (e.keyCode === 13) {
        const query = itemName.value
        document.getElementById('itemsection').scrollIntoView()
        searchBtn.click()
    }
})

searchBtn.addEventListener('click', () => {
    const query = itemName.value
    document.getElementById('itemsection').scrollIntoView()
    filpkartSecarc(query)
})




filpkartSecarc()

function filpkartSecarc(querry = '') {
    flipkartClient.doKeywordSearch(querry, 10)
        .then(function (value) {
            cardContainer.innerHTML = ''
            flData = JSON.parse(value.body)
            flipkartFetchData(flData)
        })
        .catch(function (err) {
            console.log(err);
        });
}

//Search Event Listner callback function
function flipkartFetchData(data) {
    for (i = 0; i < data.products.length; i++) {

        //Storing Variable for Products
        specs = data.products[i].categorySpecificInfoV1.detailedSpecs
        itemTitle = data.products[i].productBaseInfoV1.title
        itemImage = data.products[i].productBaseInfoV1.imageUrls["400x400"]
        itemdescription = data.products[i].productBaseInfoV1.productDescription
        if (!itemdescription.length || itemdescription == 'NA') {
            itemdescription = '<i>No Description Provided</i>'
        }
        mrp = data.products[i].productBaseInfoV1.maximumRetailPrice.amount
        flSellPrice = data.products[i].productBaseInfoV1.flipkartSellingPrice.amount
        flSpecialPrice = data.products[i].productBaseInfoV1.flipkartSpecialPrice.amount
        currencyFormat = data.products[i].productBaseInfoV1.flipkartSpecialPrice.currency
        productUrl = data.products[i].productBaseInfoV1.productUrl
        discount = (((mrp - flSpecialPrice) / mrp) * 100).toFixed(0)

        //Creating New DOM Elements
        let cardbody = document.createElement('div')
        cardbody.className = 'col-sm-12 border rounded bg-light'
        // cardbody.style.padding = '10px 0px 10px 0px'
        cardbody.style.marginBottom = '10px'
        cardbody.innerHTML = `
            <div class="row p-1">
            <div class="col-sm-2 text-center">
                <img class="img-fluid rounded" onclick=dispImg("${itemImage}") src="${itemImage}" alt="Card image">
            </div>
            <div class="col-sm-10">
                <h5><b>${itemTitle}</b></h5>
                <small>${itemdescription}</small>
                <div class="input-group">
                <input type="text" id="affUrl${i}" readonly class="form-control" value="${productUrl}">
                <div class="input-group-append">
                    <button class="btn btn-primary" type="button" onclick="clipboard(${i})">Copy</button>
                </div>
            </div>
                <hr>
                <div class="row" id="specscontainer${i}">
                    <div class="col-sm border rounded">
                        <small>Maximum Retail Price : <b>${mrp} ${currencyFormat}</b></small></br>
                        <small>Selling Price : <b>${flSellPrice} ${currencyFormat}</b></small></br>
                        <small>Flipkart Special Price : <b>${flSpecialPrice} ${currencyFormat}</b></small><br>
                        <small>Discount : <b>${discount}%</b></small>
                    </div>
                </div>
            </div>
            </div>
            `
        cardContainer.appendChild(cardbody)
        const specsContainer = document.getElementById(`specscontainer${i}`)
        const specsBody = document.createElement('div')
        specsBody.className = 'col-sm border rounded'
        for (k = 0; k < specs.length; k++) {
            const specsItem = document.createElement('small')
            specsItem.style.display = 'block'
            specsItem.innerHTML += `${k + 1}: ${specs[k]}`
            specsBody.appendChild(specsItem)
        }
        specsContainer.appendChild(specsBody)
    }
}

function dispImg(imgSrc) {
    imageSrc.src = imgSrc
    document.querySelector('#imgcontainer').classList.remove('hide')
}

function clipboard(point) {
    var copyText = document.getElementById("affUrl" + point);
    copyText.select();
    document.execCommand("copy");
}

document.getElementById('closeimg').addEventListener('click', () => {
    document.querySelector('#imgcontainer').classList.add('hide')
})
