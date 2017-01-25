$.fn.extend({
    scanzytable: function (options) {

        //options default setup
        var options = defaultValues(options, {
            loadnow: { enabled: false, data: undefined },
            requiredata: { options: { }, name: 'scanzytable-' + this.attr('id') },
            request: { url:'', data: {} }, columns: {},
            sort: { 
                enabled: false, column: undefined, reverse: false, //sorting when data loaded
                func: { rows: undefined, columns: {}}, //sorting functions
                click: false //enable sort when th clicked
            }, 
            fetch: {                
                rows: { 
                    start: function () { return "<tr>"; }, end: function () { return "</tr>"; },
                    click: undefined, hoverClass: undefined
                },
                cell: {}, content: {}, cells: { start: undefined, end: undefined }, contents: undefined,
            },
            empty: "There are currently no elements", loading: "Loading data...",
            button: { show: false, text: "New", click: function () { }, maxRows: 0 },
            search: { show: false, text: "Search...", minRows: 1 },
            done: function() {}, fail: function() {}, always: function() {}
        });

        //adds html for searchbar and new item btn
        if (options.search.show || options.button.show) {
            var html = '<div class="row table-topbar" style="display:none">';

            if (options.search.show) //searchbar
                html += '<div class="col-md-6 col-lg-4"> \
                    <input type="text" class="form-control input-sm items-search" style="display:none;" placeholder="' + options.search.text + '"/></div>';

            if (options.button.show) //new item button
                html += '<div class="col-md-6 col-lg-8 right"> \
                    <button class="btn btn-sm btn-success new-item new-item-sm" type="button" style="display:none;"> \
                    <span class="glyphicon glyphicon-plus"></span> <span>' + options.button.text + '</span></button></div>';

            this.append(html + '</div>');
        }

        //adds html for table
        var thead = ""; for (var colname in options.columns) 
            thead += '<th name="' + colname + '"><span class="colname">' + options.columns[colname] + '</span> \
                <span class="sort-normal glyphicon glyphicon-chevron-down" style="display:none"></span>\
                <span class="sort-reverse glyphicon glyphicon-chevron-up" style="display:none"></span>\
                <span class="no-sort glyphicon glyphicon-minus" style="color:transparent !important"></span></th>';
        $('<div class="table-responsive"><table class="table"><thead class="noselect"><tr>' + thead + '</tr></thead><tbody></tbody></table></div>')
        .appendTo(this).hide().fadeIn("slow"); //appends elements with animation

        //adds hidden texts for hints
        $('<p class="no-items grey center">' + options.empty + '</p><p class="loading-items center grey">' + options.loading + '</p> \
            <div class="loading-items-error center"><p class="grey">Error while loading data</p>\
                <button class="items-load-retry btn btn-default btn-sm"><span class="glyphicon glyphicon-repeat"></span> <span>Retry</span></button></div> \
            <div class="no-items-results center"><p class="grey">No rows matching searched string</p>\
                <button class="btn btn-default btn-sm items-clear-search"><span class="glyphicon glyphicon-repeat"></span> <span>Reset search</span></button></div>')
                .appendTo(this).hide();
               
        if (options.button.show) //adds hidden big new button 
            this.append('<div class="new-item-lg center" style="display:none; margin: 3em auto;"><button class="btn btn-success btn-lg new-item">\
                <span class="glyphicon glyphicon-plus"></span> <span>' + options.button.text + '</span></button></div>');       

        //shows sort state (highlights sort col, using icon for asc/desc)
        function showSortState() {
            t.root.find("th").each(function() { //for each th
                var colname = $(this).attr('name'); //gets name

                //adds/removes class from name
                $(this).find(".colname").toggleClass('sorted', (colname == t.options.sort.column)); 

                //hides shows icons
                if ((colname == t.options.sort.column)) { //if sorting this column
                    $(this).find(".sort-normal").toggle(!t.options.sort.reverse); 
                    $(this).find(".sort-reverse").toggle(t.options.sort.reverse); 
                }
                else $(this).find(".sort-normal, .sort-reverse").hide();
                $(this).find(".no-sort").toggle(colname != t.options.sort.column);
            });
        }

        //sorts data using custom function if specified
        function sortData(data, sortcol, reverse) { 
            if (sortcol in options.sort.func.columns) //manipulates data
                data.sort(function(a, b) { return options.sort.func.columns[sortcol](a[sortcol], b[sortcol]); });
            else data.sort(function(a, b) { return a[sortcol].split('_').pop().localeCompare(b[sortcol].split('_').pop()) * (reverse ? -1: 1); });

            //saves this sorting mode
            t.options.sort.column = sortcol;
            t.options.sort.reverse = reverse;
            return data;
        }

        //saves root, options and load items function
        var t = { root: this, options: options, loadItems: function (requestdata) {

                this.loader.loadItems(requestdata); //loads items
                showSortState(); //adds icon in table heading, etc
                this.root.find(".items-search").focus(); //focuses search
                return t; //returns obj table ref
            } 
        };

        //inits loader
        t.loader = this.find("tbody").scanzyload({ request: options.request, requiredata: options.requiredata, loadnow: options.loadnow,           
            processResponse: function(data) {                 
                var rowcount = (data != null && data != "") ? data.length : 0; //calculates row count

                //to hide searchbar/new button
                var showSearch = (rowcount >= options.search.minRows);
                var showNewBtnSm = (rowcount > options.button.maxRows);

                //hides search if needed (too few rows)
                t.root.find(".items-search").toggle(showSearch) ;

                //hides new button from top right to show it under table if needed (too few rows)
                t.root.find(".new-item-sm").toggle(showNewBtnSm);
                t.root.find(".new-item-lg").toggle(!showNewBtnSm); 

                //hides the whole topbar if nothing inside
                if (showSearch || showNewBtnSm) 
                    t.root.find(".table-topbar").fadeIn("slow");
                else t.root.find(".table-topbar").fadeOut("slow");

                //sorts data if needed
                if (options.sort.enabled) {
                    
                    //uses default rows sort func if specified
                    if (options.sort.func.rows != undefined) data.sort(options.sort.func.rows);
                    else {
                        var sortcol = options.sort.column; //gets sort column
                        if (sortcol == undefined) //if no column specified uses first one
                            sortcol = Object.keys(options.columns)[0];                        

                        data = sortData(data, sortcol, options.sort.reverse); //sorts by column               
                    }
                }

                return data;
            },            
            fetch: function (i, data) {

                //fetches row
                var html = options.fetch.rows.start(i, data);
                for (var col in options.columns) {

                    if (col in options.fetch.cell) { //opens tag
                        if (options.fetch.cell[col].start != undefined) html += options.fetch.cell[col].start(col, data[col], i, data);
                    } else if (options.fetch.cells.start != undefined)
                        html += options.fetch.cells.start(col, data[col], i, data);
                    else html += "<td>";

                    //puts content
                    if (col in options.fetch.content)
                        html += options.fetch.content[col](col, data[col], i, data);
                    else if (options.fetch.contents != undefined)
                        html += options.fetch.contents(col, data[col], i, data);
                    else html += data[col]; 

                    if (col in options.fetch.cell) { //closes tag
                        if(options.fetch.cell[col].end != undefined) html += options.fetch.cell[col].end(col, data[col], i, data);
                    } else if (options.fetch.cells.end != undefined)
                        html += options.fetch.cells.end(col, data[col], i, data);
                    else html += "</td>"; 
                }
                return html + options.fetch.rows.end(i, data);
            },
            loading: t.root.find(".loading-items"),
            error: t.root.find(".loading-items-error"),
            empty: t.root.find(".no-items"), 
            retry: t.root.find(".items-load-retry"),
            done: options.done, always: options.always, fail: options.fail
        });

        //handlers for new button, reset search
        if (options.button.show) this.find(".new-item").click(options.button.click);
        this.find(".items-clear-search").click(function (e) {
            e.preventDefault(); t.root.find(".items-search").val(''); //resets search input (shows all rows)
            t.root.find(".no-items-results").fadeOut("slow"); t.root.find("tr").fadeIn("slow"); $(".items-search").focus();
        })

        //handler for searchbar
        this.find(".items-search").bind('input', function () {
            var searchstr = $(this).val().trim().toLowerCase(); //gets input
            if (searchstr == "") t.root.find("tr").show(); //shows all if no input
            t.root.find("tbody tr").each(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(searchstr) != -1); //finds elements
            });
            (t.root.find("tbody tr:visible").length == 0) ? // controls "no items found" visibility 
            t.root.find(".no-items-results").show() : t.root.find(".no-items-results").hide();
        });

        //sets sort function 
        t.sortBy = function(col, reverse){
            var data = t.loader.data.slice(0); //gets original request data to sort it (clones array)
            if (col != undefined) data = sortData(data, col, reverse); //sorts by column
            else t.options.sort.column = undefined; //skips sort if undefined

            var html = ""; //fetches table again
            for (var i in data) html += t.loader.options.fetch(i, data[i]);
            t.loader.root.html(html);
            showSortState(); //adds icon in table heading, etc
        }

        //sort th click handler
        if (t.options.sort.click) {
            t.root.on('click', "th .colname", function() { 
                var sortcol = $(this).parent().attr('name'); //gets this column
                if (t.options.sort.column == sortcol) { //if previously sorted this column
                    if (t.options.sort.reverse) t.sortBy(); //returns to unsorted
                    else t.sortBy(sortcol, true); //sorts this column (reverse)
                } else t.sortBy(sortcol, false); //sorts this column (normal)
            });
            t.root.on("mouseenter", "th .colname", function() { $(this).addClass('hover'); });
            t.root.on("mouseleave", "th .colname", function() { $(this).removeClass('hover'); });
        }

        //row click/hover handlers
        if (options.fetch.rows.click != undefined) t.root.on("click", "tbody tr", options.fetch.rows.click);   
        if (options.fetch.rows.hoverClass != undefined) {
            t.root.find("tbody").css({ 'cursor': 'pointer'}); //shows pointer
            t.root.on("mouseenter", "tbody tr", function () { $(this).addClass(options.fetch.rows.hoverClass); });
            t.root.on("mouseleave", "tbody tr", function () { $(this).removeClass(options.fetch.rows.hoverClass); });
        }       

        return t; //returns table object ref
    }
});