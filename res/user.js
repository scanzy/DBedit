requiredata.request('userdata', function(data) {    
    requiredata.set('title', data.name + ' ' + data.surname); //sets name in title
});