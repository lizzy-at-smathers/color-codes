ar _in = {a: {b: 2, c: {d: 3, colorCode: "something"},  colorCode: "something"}, colorCode: "something"};

var out = clone(_in);

out.a.c.e = 5;

console.log(_in.a.c.e);
console.log(out.a.c.e);

function clone(obj) { 
    var cloned = {}; 
    for (var key in obj) { 
        console.log(key);
        if (obj[key].colorCode) { 
            cloned[key] = clone(obj[key]);
         } else { 
            cloned[key] = obj[key];
         } 
    }
    return cloned; 
}
