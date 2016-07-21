$.fn.extend({
    scanzytable: function (options) {

        //options default setup
        var options = defaultValues(options, {
            requiredata: { options: { }, name: 'scanzytable-' + this.attr('id') },
            request: { url:'', data: {} }, columns: {},
            fetch: {                
                rows: { 
                    start: function () { return "<tr>"; }, end: function () { return "</tr>"; },
                    click: undefined, hoverClass: undefined
                },
                cell: {}, content: {}, cells: { start: undefined, end: undefined }, contents: undefined,
            },
            button: { show: false, text: "New", click: function () { } },
            search: { show: false, text: "Search..." },
            done: function() {}, fail: function() {}, always: function() {}
        });

        //adds html for searchbar and new item btn
        if (options.search.show || options.button.show) {
            var html = '<div class="row">';

            if (options.search.show) //searchbar
                html += '<div class="col-xs-8 col-md-6 col-lg-4"> \
                    <input type="text" class="form-control input-sm items-search" placeholder="' + options.search.text + '"/></div>';

            if (options.button.show) //new item button
                html += '<div class="col-xs-4 col-md-6 col-lg-8 right"> \
                    <button class="btn btn-sm btn-success new-item" type="button"> \
                    <span class="glyphicon glyphicon-plus"></span> <span>' + options.button.text + '</span></button> </div>';

            this.append(html + '</div>');
        }

        //adds html for table
        var thead = ""; for (var i in options.columns) thead += "<th>" + options.columns[i] + "</th>";
        this.append('<div class="table-responsive"><table class="table"><thead><tr>' + thead + '</tr></thead><tbody></tbody></table></div>');

        //adds hidden texts for hints
        this.append('<div><p class="no-items grey center" style="display:none;">There are currently no elements</p>\
            <p class="loading-items center grey" style="display:none;">Loading data...</p> \
            <div class="loading-items-error center" style="display:none;"><p class="grey">Error while loading data</p>\
                <button class="items-load-retry btn btn-default btn-sm"><span class="glyphicon glyphicon-repeat"></span> <span>Retry</span></button></div> \
            <div class="no-items-results center" style="display:none;"><p class="grey">No rows matching searched string</p>\
                <button class="btn btn-default btn-sm items-clear-search"><span class="glyphicon glyphicon-repeat"></span> <span>Reset search</span></button></div></div>');

        //saves root, options and load items function
        var t = { root: this, options: options, loadItems: function (requestdata) {

                this.loader.loadItems(requestdata); //loads items
                this.root.find(".items-search").focus(); //focuses search
            } 
        };

        //inits loader
        t.loader = this.find("tbody").scanzyload({ request: options.request, requiredata: options.requiredata,
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
            t.root.on("mouseenter", "tr", function () { $(this).addClass(t.options.fetch.rows.hoverClass); });
            t.root.on("mouseleave", "tr", function () { $(this).removeClass(t.options.fetch.rows.hoverClass); });
        }       

        return t; //returns table object ref
    }
});