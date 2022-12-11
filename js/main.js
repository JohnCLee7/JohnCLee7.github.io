import { Model } from './model.js';

let temp;

window.addEventListener('stockData', function(e){
    let code = temp;
    temp = null;
    let target = document.getElementById("stockViewer");
    let data = Model.getStock(code);
    target.innerHTML = "<ul><li>Code: " + data.code + "</li><li>Name: " + data.name + 
                       "</li><li>Price Per Unit: $" + Number(data.price).toFixed(2) + "</li>" + 
                       "<li><form id='buy-" + data.code + "-form'><input type='submit' id='buyButton' value='Add to Portfolio: '></input><input type='number' id='quantity' value='1' min='1'></input></form></li>"
    let buttonid = "buy-" + data.code + "-form";
    let link = document.getElementById(buttonid);
    link.onsubmit = function(event) {
        event.preventDefault();
        const value = this.elements[1].value;
        let bal = Model.getBalance();
        let data = Model.getStock(code);
        let cost = data.price * value;
        if (cost > bal || value < 0) {
            if (cost > bal) alert("You do not possess enough to puchace these Stock(s).");
            if (value < 0) alert("You cannot purchase a negitive number of stocks.");
        } else {
            stockHandler(data, value);
            alert(value + " " + data.code + " Stock(s) has been purchased");
        }
    }    
});

function stockHandler(data, amount) {
    let cost = Number(data.price) * amount;
    let existing = Model.checkMyStock(data.code);
    if (existing == null) {
        Model.addToMyStock(data, amount);
        Model.adjustBalance(-(cost));
    } else {
        const nData = {
            'code': existing.code,
            'name': existing.name,
            'price': existing.price,
        }
        const nVal = Number(existing.amount) + Number(amount);
        Model.addToMyStock(nData, nVal);
        Model.adjustBalance(-(cost));
    }
    redraw();
}

window.addEventListener('searchData', function(e){
    let list = "<ul>"
    let test = (Object.keys(Model.searchResults.bestMatches).length == 0);
    if (test) list = list + "None"
    else {
        for (let i = 0; i < Object.keys(Model.searchResults.bestMatches).length; i++) {
            list = list + "<li><button id='details-" + Model.searchResults.bestMatches[i]["1. symbol"] + "'>" + Model.searchResults.bestMatches[i]["1. symbol"] + "<br/>" + Model.searchResults.bestMatches[i]["2. name"] + "</button></li>";
        }
    }
    list = list + "</ul>";
    document.getElementById("searchresults").innerHTML = list;
    if (!test) {
        bindSearchResults();
    }
});

function bindSearchResults() {
    for (let i = 0; i < Object.keys(Model.searchResults.bestMatches).length; i++) {
        let code = Model.searchResults.bestMatches[i]["1. symbol"];
        let buttonid = "details-" + code;
        let link = document.getElementById(buttonid);
        link.onclick = function() {
            temp = code;
            Model.fetchStockData(code, i);
        }
    }
}

function updateBalance() {
    document.getElementById("balanceammount").innerHTML = "<p>Cash Balance: $" + Number(Model.getBalance()).toFixed(2) + "</p>";
}

function balanceHandler(event) {
    event.preventDefault();
    const value = this.elements[0].value;
    Model.adjustBalance(value);
    if (Model.getBalance() < 0) {
        alert("Balance cannot go beneath 0.");
        Model.setBalance(0);
    }
    updateBalance();
    document.getElementById("doChange").value = null;
}

function searchHandler(event) {
    event.preventDefault();
    const searchValue = this.elements[0].value;
    Model.searchStocks(searchValue);
}

function drawMyStocks() {
    let target1 = document.getElementById("myStockList");
    let target2 = document.getElementById("totalVal");
    let tVal = 0;
    let list = "<ul>"
    let stocks = Model.getMyStocks();
    stocks.forEach(function(value, key) {
        if (value.amount > 0) {
            let form = "<form id='sell-" + value.code + "-form'><input type='submit' id='sellButton' value='Sell from Portfolio: '></input><input type='number' id='quantity' value='1' min='1' max='" + (Number(value.amount)).toFixed(2) + "'></input></form>"
            list = list + "<li>" +  "<ul><li>Code: " + value.code + "</li><li>Name: " + value.name +  "</li><li>Price Per Unit: $" + value.price + "</li><li>Quantity Owned: " + value.amount + "</li><li>Total Value Owned: $" + (Number(value.price)*Number(value.amount)).toFixed(2) + "</li><li>" + form + "</li></ul></li>";
            tVal = Number(tVal) + Number(value.price*value.amount);
        }
    });
    list = list + "</ul>"
    target1.innerHTML = list;
    target2.innerHTML = "Total Value of Stocks: $" + Number(tVal).toFixed(2);
    stocks.forEach(function(value, key) {
        if (value.amount > 0) {
            let buttonid = "sell-" + value.code + "-form";
            let link = document.getElementById(buttonid);
            link.onsubmit = function(event) {
                event.preventDefault();
                let code = value.code
                const quan = this.elements[1].value;
                let data = Model.getMyStock(code);
                stockHandler(data, -(quan));
                alert(quan + " " + data.code + " Stock(s) has been sold");
            }
        }
        
    });
}

function redraw() { 
    let addButton = document.getElementById("alterBalance");
    addButton.onsubmit = balanceHandler;
    let searchButton = document.getElementById("searchform");
    searchButton.onsubmit = searchHandler;
    let clearButton = document.getElementById("clearPortfolio");
    clearButton.onclick = function() {
        if (window.confirm("Do you wish to clear all stored portfolio data?")) {
            localStorage.clear();
            location.reload();
        }
    }
    updateBalance();
    drawMyStocks();
}

window.onload = function() {
    Model.getLocalBalance();
    Model.getLocalMyStock();
    updateBalance();
    redraw();
};

window.onhashchange = function() {
    redraw();
}

