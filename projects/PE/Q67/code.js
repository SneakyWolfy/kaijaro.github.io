console.time("c")
fetch('./p067_triangle.txt')
    .then(response => response.text())
    .then(text => {
        var triangle = text.split('\n').map(l => {
            return l.split(' ').map(n => {
                return parseInt(n)
            })
        })
        let dict = {};
        let arr = triangle.slice(0, -1);
        
        let recurse = (x, y) => {
            if (`${x}-${y}` in dict) {
                return dict[`${x}-${y}`];
            }
            if (x >= arr.length - 1) {
                dict[`${x}-${y}`] = arr[x][y];
                return arr[x][y];
            } else {
                let { a, b } = { a: recurse(x + 1, y), b: recurse(x + 1, y + 1) };
                let v;
                a > b ? (v = arr[x][y] + a) : (v = arr[x][y] + b);
                dict[`${x}-${y}`] = v;
                return v;
            }
        };
        console.timeEnd("c")
        console.log(recurse(0, 0));
        console.log(dict);
    })

