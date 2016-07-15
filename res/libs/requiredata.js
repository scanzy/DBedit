//used to easily access objects in sessionStorage and localStorage
Storage.prototype.setObject = function (key, value) { this.setItem(key, JSON.stringify(value)); }
Storage.prototype.getObject = function(key) { var value = this.getItem(key); return value && JSON.parse(value); }

//object to set callbacks to get data, to execute actions when data is avaliable
var requiredata = {

    entries: {}, //used to store data and callbacks 

    //called to setup entry
    entrysetup: function (name) {
        if (!(name in this.entries)) this.entries[name] = { //creates object if needed

            success: [], //callbacks called when got data
            error: [], //callbacks called on loading error
            complete: [], //callbacks called on loading completed

            options: {
                //do not use this two true together
                useSessionStorage: false, //set this to true to have persistent data across pages in same session
                useLocalStorage: false //set this to true to have persistent data across pages until localStorage.clear()
            }
        }
        return this.entries[name]; //returns entry
    },

    //sets options for this entry (or gets)
    options: function(name, opts) {
        var entry = this.entrysetup(name); //creates object if needed

        //updates options if passed as arguments
        if (opts != undefined) for(x in opts) entry.options[x] = opts[x];

        return entry.options; //returns updated options
    },

    //gets data if set, null otherwise
    get: function (name) {
        var entry = this.entrysetup(name); //creates object if needed

        //searches in entries
        if ('data' in this.entries[name]) return entry.data;

        //searches in sessionStorage or localStorage 
        else if (entry.options.useSessionStorage) return sessionStorage.getObject(name);
        else if (entry.options.useLocalStorage) return localStorage.getObject(name);

        return null; //not found
    },

    //requests data
    request: function (name, callback) {
        data = this.get(name); //tries to get data

        //if found data, executes callback        
        if (data !== null) callback(data);

        //if not loaded data yet, saves callback to call it later 
        else this.entries[name].success.push(callback);
    },

    //gets function to load data (loads data if needed)
    load: function (name, func) {
        data = this.get(name); //tries to get data

        //if not loaded data yet, loads data
        if (data === null) func();
    },

    //saves data and triggers request callbacks
    set: function (name, data) {
        var entry = this.entrysetup(name); //creates object if needed

        //saves data
        entry.data = data;

        //saves data also in sessionStorage or localStorage
        if (entry.options.useSessionStorage) sessionStorage.setObject(name, data);
        if (entry.options.useLocalStorage) localStorage.setObject(name, data);

        //and triggers all callbacks
        for (var i = 0; i < entry.success.length; i++) entry.success[i](entry.data);
    },

    //uses ajax to load data
    loadAjax: function (name, ajaxsettings) {
        var data = this.get(name); //tries to get data

        var entry = this.entries[name];

        //if not loaded data yet, loads data
        if (data === null) 
            $.ajax(ajaxsettings).done(function(data) { requiredata.set(name, data); })
            .fail(function(x, y, z) { for (var i in entry.error) entry.error[i](x, y, z); })
            .always(function() { for (var i in entry.complete) entry.complete[i](); });

        //returns object to set ajax callbacks 
        return fakeJqXHR = {
            done: function(callback) { requiredata.entries[name].success.push(callback); return this; },
            fail: function(callback) { requiredata.entries[name].error.push(callback); return this; },
            always: function(callback) { requiredata.entries[name].complete.push(callback); return this; }
        };
    }
}