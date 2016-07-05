//stores param
var type = GetParam('type'); var typedata;

//gets data about this entity
$.ajax({ url: "./apis/entitytype/one.php?type=" + encodeURIComponent(type), cache: true }).fail(errorPopup)
.success(function (data) { 

    typedata = data; //saves data
    $(".box.title h1").text(data.displayname); //sets title

    var columns = []; //gets columns
    for (var col in data.columns) columns[col] = data.columns[col].displayname;

    //setups table
    entitiestable = $("#entities-table").scanzytable({ columns: columns,
        request: { url: "./apis/entity/get.php?type=" + encodeURIComponent(type), error: errorPopup,
            complete: function () {
                translate(document.getElementById("entities-table")); //translates table               

                //handlers
                $("#entities-table tbody").on("click", "tr", function () {
                    window.location.href = "./?type=" + encodeURIComponent(type) +
                    "&id=" + encodeURIComponent($(this).attr('data-entity-id'));
                });

                $("#entities-table tbody").on("mouseenter", "tr", function () { $(this).addClass("hover"); });
                $("#entities-table tbody").on("mouseleave", "tr", function () { $(this).removeClass("hover"); });
            },
            success: function(data) {
                $(".box.title h1").html(typedata.displayname + ' <span class="badge badge-light">' + data.length + '</span>');
            }
        },
        fetch: {
            content: {
                "itemscount": function (x, count) { return "<span class='label label-info'>" + count + "</span>"; }
            },
            row: { start: function (id) { return "<tr class='clickable' data-entity-id='" + id + "'>"; } }
        },
        search: { show: true }, button: { show: true, text: typedata.add, click: function () {
            window.location.href = "./?type=" + encodeURIComponent(type) + "&action=new";
        }
        }
    });

    //loads data
    entitiestable.loadItems();
});