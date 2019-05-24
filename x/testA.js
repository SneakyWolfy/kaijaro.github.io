function bisearch(num, ary){
    a=0;
    b=ary.length;
    while (true) {
        index=parseInt((b+a)/2)
        if (ary[index]<num){
            a=index;
        } else if (ary[index]>num) {
            b=index;
        } if (b-a == 1) {
            return b;
        }
    }
}

function insert(arr,val,i){
    out=arr.slice(0,i);
    out.push(val);
    return out.concat(arr.slice(i,arr.length));
}

function numsort(arr, val){
    return insert(arr,val,bisearch(val, arr))
}

numlist=[4]

for (x=2;x<101;x++){
    for (y=2;y<101;y++){
        value = x**y;
        if (!numlist.includes(value)) {
            numlist = numsort(numlist,value);
        }
    }
}

console.log(numlist);