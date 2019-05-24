function Check(val){
    toString(val);
    out=0
    for (i=0; i<val.length; i++){
        out+=val[i]**4
    }
    return out;
}

function main(){
    var values = [];
    for (x=1633;x<1637;x++){
        if (x == Check(x)){
            values.push(x);
        }
    }
    console.log(values);
}

main();
function test(){
    var inp = document.getElementById("input_text").value;
    var out = Check(inp);

    document.getElementById("output_text").value = out;
}

