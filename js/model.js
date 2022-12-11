export {Model};

const Model = {

    stocks: new Map(),

    myStocks: new Map(),

    searchResults: {
        bestMatches: []
    },

    balance: 0,

    adjustBalance: function(value) {
        this.balance = Number(this.balance) + Number(value);
        localStorage.setItem("balance", JSON.stringify(this.balance));
    },

    getBalance: function() {
        return this.balance;
    },

    setBalance: function(value) {
        this.balance = Number(value);
        localStorage.setItem("balance", JSON.stringify(this.balance));
    },

    getLocalBalance: function() {
        let storedString = localStorage.getItem('balance');
        let storedData = JSON.parse(storedString);
        if (storedData) this.balance = storedData;
    },

    getStock: function(stock) {
        return Model.stocks.get(stock);
    },

    addToMyStock: function(stock, quantity) {
        const sData = {
            'code': stock.code,
            'name': stock.name,
            'price': stock.price,
            'amount': quantity,
        }
        Model.myStocks.set(stock.code, sData);
        Model.loadMyStocks();
    },

    getMyStocks: function() {
        return Model.myStocks;
    },

    getMyStock: function(stock) {
        return Model.myStocks.get(stock);
    },

    checkMyStock: function(stock) {
        if (Model.myStocks.has(stock)) {
            return Model.myStocks.get(stock);
        } else {
            return null;
        }
    },

    getLocalMyStock: function() {
        Model.readMyStocks();
    },

    loadMyStocks: function() {
        let s = Model.getMyStocks();
        let mS = {}
        s.forEach(function(value, key) {
            mS[key] = value;
        });
        localStorage.setItem("myStock", JSON.stringify(mS));
    },

    readMyStocks: function() {
        let storedString = localStorage.getItem('myStock');
        let storedData = JSON.parse(storedString);
        if (storedData) {
            for (const item in storedData) {
                const data = {
                    'code': storedData[item].code,
                    'name': storedData[item].name,
                    'price': Number(storedData[item].price),
                    'amount': Number(storedData[item].amount),
                }
                Model.myStocks.set(item, data);
            }
        }
    },

    fetchStockData: function(stock, pos) {
        let url = 'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + stock + '&apikey=KKTPX4DEHXWOPRD0';
        fetch(url)
        .then(
            function(response) {
                return response.json();
            }
        ).then(
            function(data) {
                const sData = {
                    'code': data["Global Quote"]["01. symbol"],
                    'name': Model.searchResults.bestMatches[pos]["2. name"],
                    'price': data["Global Quote"]["05. price"],
                }
                Model.stocks.set(stock, sData);
                let event = new CustomEvent("stockData");
                window.dispatchEvent(event);
            }
        );
    },

    searchStocks: function(search) {
        let url = "https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=" + search + "&apikey=KKTPX4DEHXWOPRD0"
        fetch(url)
        .then(
            function(response) {
                return response.json();
            }
        ).then(
            function(data) {
                Model.searchResults = data;
                let event = new CustomEvent("searchData");
                window.dispatchEvent(event);
            }
        );
    },

}