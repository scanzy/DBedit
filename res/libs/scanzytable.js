$.fn.extend({
    scanzytable: function (options) {

        //options default setup
        var options = defaultValues(options, {
            requiredata: { options: { }, name: 'scanzytable-' + this.attr('id') },
            request: { url:'', data: {} }, columns: {},
            sort: { 
                load: { enabled: false, column: undefined }, //sorting when data loaded
                func: { rows: undefined, columns: {}}, //sorting functions
                click: { enabled: false } //enable sort when th clicked
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
            var html = '<div class="row">';

            if (options.search.show) //searchbar
                html += '<div class="col-xs-8 col-md-6 col-lg-4"> \
                    <input type="text" class="form-control input-sm items-search" style="display:none;" placeholder="' + options.search.text + '"/></div>';

            if (options.button.show) //new item button
                html += '<div class="col-xs-4 col-md-6 col-lg-8 right"> \
                    <button class="btn btn-sm btn-success new-item new-item-sm" type="button" style="display:none;"> \
                    <span class="glyphicon glyphicon-plus"></span> <span>' + options.button.text + '</span></button></div>';

            this.append(html + '</div>');
        }

        //adds html for table
        var thead = ""; for (var i in options.columns) thead += "<th>" + options.columns[i] + "</th>";
        this.append('<div class="table-responsive"><table class="table"><thead><tr>' + thead + '</tr></thead><tbody></tbody></table></div>');

        //adds hidden texts for hints
        this.append('<div><p class="no-items grey center" style="display:none;">' + options.empty + '</p>\
            <p class="loading-items center grey" style="display:none;">' + options.loading + '</p> \
            <div class="loading-items-error center" style="display:none;"><p class="grey">Error while loading data</p>\
                <button class="items-load-retry btn btn-default btn-sm"><span class="glyphicon glyphicon-repeat"></span> <span>Retry</span></button></div> \
            <div class="no-items-results center" style="display:none;"><p class="grey">No rows matching searched string</p>\
                <button class="btn btn-default btn-sm items-clear-search"><span class="glyphicon glyphicon-repeat"></span> <span>Reset search</span></button></div></div>');
               
        if (options.button.show) //adds big new button 
            this.append('<div class="new-item-lg center" style="display:none; margin: 4em auto;"><button class="btn btn-success btn-lg new-item">\
                <span class="glyphicon glyphicon-plus"></span> <span>' + options.button.text + '</span></button></div>');

        //saves root, options and load items function
        var t = { root: this, options: options, loadItems: function (requestdata) {

                this.loader.loadItems(requestdata); //loads items
                this.root.find(".items-search").focus(); //focuses search
            } 
        };

        //inits loader
        t.loader = this.find("tbody").scanzyload({ request: options.request, requiredata: options.requiredata,            
            processResponse: function(data) {                 
                var rowcount = (data != null && data != "") ? data.length : 0; //calculates row count

                //hides search if needed (too few rows)
                if (rowcount < options.search.minRows) 
                    t.root.find(".items-search").hide(); else t.root.find(".items-search").show();

                //hides new button from top right to show it under table if needed (too few rows)
                if (rowcount <= options.button.maxRows) 
                { t.root.find(".new-item-sm").hide(); t.root.find(".new-item-lg").show(); }
                else { t.root.find(".new-item-sm").show(); t.root.find(".new-item-lg").hide(); }

                //sorts data if needed
                if (options.sort.load.enabled) {
                    
                    //uses default rows sort func if specified
                    if (options.sort.func.rows != undefined) data.sort(options.sort.func.rows);
                    else {
                        var sortcol = options.sort.load.column; //gets sort column
                        if (sortcol == undefined) //if no column specified uses first one
                            sortcol = options.columns[0];

                        //uses custom sort func if specified
                        if (sortcol in options.sort.func.columns) 
                            data.sort(function(a, b) { return options.sort.func.columns[sortcol](a[sortcol], b[sortcol]); });
                        else data.sort(function(a, b) { return a[sortcol].localeCompare(b[sortcol]); }); //uses default sort                        
                    }
                }

                return data;
            },            
            fetch: function (i, data) {

                //fetches row
                var html = options.fetch.rows.start(i, data);
                for (var col in options.columns) {

                    if (col in options.fetch.cell) { //opens tag
                        if ('start' in options.fetch.cell[col]) html += options.fetch.cell[col].start(col, data[col], i, data);
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
                        if('end' in options.fetch.cell[col]) html += options.fetch.cell[col].end(col, data[col], i, data);
                    } else if (options.fetch.cells.end != undefined)
                        html += options.fetch.cells.end(col, data[col], i, data);
                    else html += "</td>"; 
                }
                return html + options.fetch.rows.end(i, data);
            },
            loading: t.root.find(".loading-items"),
            error: t.root.find(".loading-items-error"),
            empty: t.root.find(".no-items"), 
            retry: t.root.find(".items-load-retry")
        });

        //handlers for new button, reset search
        if (options.button.show) this.find(".new-item").click(options.button.click);
        this.find(".items-clear-search").click(function (e) {
            e.preventDefault(); t.root.find(".items-search").val(''); //resets search input (shows all rows)
            t.root.find(".no-items-results").hide(); t.root.find("tr").show(); $(".items-search").focus();
        })

        //handler for searchbar
        this.find(".items-search").bind('input', function () {
            var searchstr = $(this).val().trim().toLowerCase(); //gets input
            if (searchstr == "") t.root.find("tr").show(); //shows all if no input
            t.root.find("tbody tr").each(function () {
                if ($(this).text().toLowerCase().indexOf(searchstr) == -1) //finds elements
                    $(this).hide(); else $(this).show();
            });
            (t.root.find("tbody tr:visible").length == 0) ? // controls "no items found" visibility 
            t.root.find(".no-items-results").show() : t.root.find(".no-items-results").hide();
        });

        //row click/hover handlers
        if (t.options.fetch.rows.click != undefined) t.root.on("click", "tr", t.options.fetch.rows.click);   
        if (t.options.fetch.rows.hoverClass != undefined) {
            t.root.find("tbody").css({ 'cursor': 'pointer'}); //shows pointer
            t.root.on("mouseenter", "tbody tr", function () { $(this).addClass(t.options.fetch.rows.hoverClass); });
            t.root.on("mouseleave", "tbody tr", function () { $(this).removeClass(t.options.fetch.rows.hoverClass); });
        }       

        return t; //returns table object ref
    }
});