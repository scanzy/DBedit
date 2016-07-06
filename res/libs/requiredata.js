//used to easily access objects in sessionStorage and localStorage
Storage.prototype.setObject = function (key, value) { this.setItem(key, JSON.stringify(value)); }
Storage.prototype.getObject = function(key) { var value = this.getItem(key); return value && JSON.parse(value); }

//object to set callbacks to get data, to execute actions when data is avaliable
var requiredata = {

    options: {
        //do not use this two true together
        useSessionStorage: false, //set this to true to have persistent data across pages in same session
        useLocalStorage: false //set this to true to have persistent data across pages until localStorage.clear()
    },

    entries: {}, //used to store data and callbacks 

    //called to setup entry
    entrysetup: function (name) {
        if (!(name in this.entries)) this.entries[name] = { callbacks: [] }; //creates object if needed
    },

    //gets data if set, null otherwise
    get: function (name) {
        this.entrysetup(name); //creates object if needed

        //searches in entries
        if ('data' in this.entries[name]) return this.entries[name].data;

        //searches in sessionStorage or localStorage 
        else if (this.options.useSessionStorage) return sessionStorage.getObject(name);
        else if (this.options.useLocalStorage) return localStorage.getObject(name);

        return null; //not found
    },

    //requests data
    request: function (name, callback) {
        data = this.get(name); //tries to get data

        //if found data, executes callback        
        if (data !== null) callback(data);

        ///if not loaded data yet, saves callback to call it later 
        else this.entries[name].callbacks.push(callback);
    },

    //gets function to load data (loads data if needed)
    load: function (name, func) {
        data = this.get(name); //tries to get data

        //if not loaded data yet, loads data
        if (data === null) func();
    },

    //saves data and triggers request callbacks
    set: function (name, data) {
        this.entrysetup(name); //creates object if needed

        //saves data
        this.entries[name].data = data;

        //saves data also in sessionStorage or localStorage
        if (this.options.useSessionStorage) sessionStorage.setObject(name, data);
        if (this.options.useLocalStorage) localStorage.setObject(name, data);

        //and triggers all callbacks
        for (var func in this.entries[name].callbacks) func(this.entries[name].data);
    }    
}