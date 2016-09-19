//functions to easily convert colinfo from typedata or linktypedata to fieldinfo to pass to bootstrap form

function typecols2fieldinfo(typecols, values)
{
    //prepares fields
    var fields = { };
    for(var col in typecols) {

        var colinfo = typecols[col]; //gets column info

        //generates shared field options
        var fieldinfo = { label: colinfo.displayname + ":", type: colinfo.type, 
            options: { allowEmpty: colinfo.allowEmpty, unique: colinfo.unique } 
        };

        //sets type specific options
        switch(colinfo.type)
        {
            case "int":
                if ("min" in colinfo) fieldinfo.options.min = colinfo.min;
                if ("max" in colinfo) fieldinfo.options.max = colinfo.max;
                break;

            case "bool":
                if ("on" in colinfo) fieldinfo.options.on = colinfo.on;
                if ("off" in colinfo) fieldinfo.options.off = colinfo.off;
                break;

            case "select": 
                fieldinfo.options.choices = { };
                for(var opt in colinfo.options)
                    fieldinfo.options.choices[opt] = colinfo.options[opt].text; 
                break;
        }        
        if (values != undefined) if (col in values) fieldinfo.value = values[col]; //sets value
        fields[col] = fieldinfo; //saves field info
    }
    return fields;
}