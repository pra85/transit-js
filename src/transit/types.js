// Copyright (c) Cognitect, Inc.
// All rights reserved.
  
"use strict";

var url  = require("url"),
    Long = require("long"),
    eq   = require("./eq");

function nullValue() {
    return null;
}

function boolValue(s) {
    return s === "t";
}

function intValue(s) {
    return Long.fromString(s, false, 10);
}

function floatValue(s) {
    return parseFloat(s);
}

function BigDecimal(s) {
    this.value = s;
}

function bigDecimalValue(s) {
    return new BigDecimal(s);
}

function charValue(s) {
    return s;
}

function Keyword(name) {
    this.name = name;
    this.hashCode = -1;
}

Keyword.prototype.com$cognitect$transit$equals = function(other) {
    return (other instanceof Keyword) && this.name == other.name;
};

Keyword.prototype.com$cognitect$transit$hashCode = function() {
    if(this.hashCode !== -1) {
        return this.hashCode;
    } else {
        this.hashCode = eq.hashCode(this.name);
        return this.hashCode;
    }
}

function keyword(s) {
    return new Keyword(s);
}

function Symbol(name) {
    this.name = name;
    this.hashCode = -1;
}

Symbol.prototype.com$cognitect$transit$equals = function(other) {
    return (other instanceof Symbol) && this.name == other.name;
}

Symbol.prototype.com$cognitect$transit$hashCode = function() {
    if(this.hashCode !== -1) {
        return this.hashCode;
    } else {
        this.hashCode = eq.hashCode(this.name);
        return this.hashCode;
    }
}

function symbol(s) {
    return new Symbol(s);
}

function UUID(str) {
    this.str = str;
    this.hashCode = -1;
}

UUID.prototype.com$cognitect$transit$equals = function(other) {
    return (other instanceof UUID) && this.str == other.str;
};

UUID.prototype.com$cognitecat$transit$hashCode = function() {
    if(this.hashCode !== -1) {
        return this.hashCode;
    } else {
        this.hashCode = eq.hashCode(this.str);
        return this.hashCode;
    }
};

function uuid(s) {
    return new UUID(s);
}

function date(s) {
    return new Date(s);
}

Date.prototype.com$cognitect$transit$equals = function(other) {
    if(other instanceof Date) {
        return this.valueOf() === other.valueOf();
    } else {
        return false;
    }
}

Date.prototype.com$cognitect$transit$hashCode = function() {
    return this.valueOf();
}

function Binary(str) {
    this.str = str;
}

function binary(str) {
    return new Binary(str);
}

function uri(s) {
    return url.parse(s);
}

function ints(xs) {
    return xs;
}

function longs(xs) {
    return xs;
}

function floats(xs) {
    return xs;
}

function doubles(xs) {
    return xs;
}

function bools(xs) {
    return xs;
}  

function TransitMap(keys, map) {
    this.map = map;
    this.keys = keys;
    this.size = keys.length;
    this.hashCode = -1;
}

TransitMap.prototype.clear = function() {
    throw new Error("Unsupported operation: clear");
};

TransitMap.prototype.delete = function() {
    throw new Error("Unsupported operation: delete");
};

TransitMap.prototype.entries = function() {
    throw new Error("Unsupported operation: entries");
};

TransitMap.prototype.forEach = function(callback) {
    for(var i = 0; i < this.keys.length; i++) {
        var vals = this.map[this.keys[i]];
        for(var j = 0; j < vals.length; j+=2) {
            callback(vals[j+1], vals[j], this);
        }
    }
};

TransitMap.prototype.get = function(k) {
  var code = eq.hashCode(k),
      vals = this.map[code];
    if(vals != null) {
        for(var i = 0; i < vals.length; i+=2) {
            if(eq.equals(k,vals[i])) {
                return vals[i+1];
            }
        }
    } else {
        return null;
    } 
};

TransitMap.prototype.has = function(k) {
    var code = eq.hashCode(k),
        vals = this.map[code];
    if(vals != null) {
        for(var i = 0; i < vals.length; i+=2) {
            if(eq.equals(k,vals[i])) {
                return true;
            }
        }
        return false;
    } else {
        return false;
    }
};

TransitMap.prototype.keys = function() {
    throw new Error("Unsupported operation: keys");
};
  
TransitMap.prototype.set = function(k, v) {
    throw new Error("Unsupported operation: set");
};

TransitMap.prototype.values = function() {
    throw new Error("Unsupported operation: value");
};
  
TransitMap.prototype.com$cognitect$transit$hashCode = function() {
    if(this.hashCode != -1) return this.hashCode;
    this.hashCode = eq.hashMapLike(this);
    return this.hashCode;
};

TransitMap.prototype.com$cognitect$transit$equals = function(other) {
    if((other instanceof TransitMap) &&
       (this.size === other.size)) {
        for(var code in this.map) {
            var vals = this.map[code];
            for(var j = 0; j < vals.length; j+=2) {
                if(!eq.equals(vals[j+1], other.get(vals[j]))) {
                    return false;
                }
            }
        }
        return true;
    } else {
        return false;
    }
};

function transitMap(arr) {
    var map  = {},
        keys = [];
    for(var i = 0; i < arr.length; i+=2) {
        var code = eq.hashCode(arr[i]),
            vals = map[code];
        if(vals == null) {
            keys.push(code);
            map[code] = [arr[i], arr[i+1]];
        } else {
            var newEntry = true;
            for(var j = 0; j < vals.length; j+= 2) {
                if(eq.equals(vals[j], arr[i])) {
                    vals[j+1] = arr[i+1];
                    newEntry = false;
                    break;
                }
            }
            if(newEntry) {
                keys.push(code);
                vals.push(arr[i]);
                vals.push(arr[i+1]);
            }
        }
    }
    return new TransitMap(keys, map);
}

function cmap(xs) {
    return transitMap(xs);
}

function TransitSet(map) {
    this.map = map;
    this.size = map.size;
}

TransitSet.prototype.add = function(value) {
    throw new Error("Unsupported operation: add");
};

TransitSet.prototype.clear = function() {
    throw new Error("Unsupported operation: clear");
};

TransitSet.prototype.delete = function(value) {
    throw new Error("Unsupported operation: delete");
};

TransitSet.prototype.entries = function() {
    throw new Error("Unsupported operation: entries");
};

TransitSet.prototype.forEach = function(iterator, thisArg) {
    this.map.forEach(function(v, k, m) {
        iterator(k, this);
    });
};

TransitSet.prototype.has = function(value) {
    return this.map.has(value);
};

TransitSet.prototype.keys = function() {
    throw new Error("Unsupported operation: keys");
};

TransitSet.prototype.values = function() {
    throw new Error("Unsupported operation: valuesa");
};

TransitSet.prototype.com$cognitect$transit$equals = function(other) {
    if(other instanceof TransitSet) {
        if(this.size === other.size) {
            return eq.equals(this.map, other.map);
        }
    } else {
        return false;
    }
};

TransitSet.prototype.com$cognitect$transit$hashCode = function(other) {
    return eq.hashCode(this.map);
};

function transitSet(arr) {
    var map  = {},
        keys = [];
    for(var i = 0; i < arr.length; i++) {
        var code = eq.hashCode(arr[i]),
            vals = map[code];
        if(vals == null) {
            keys.push(code);
            map[code] = [arr[i], true];
        } else {
            var newEntry = true;
            for(var j = 0; j < vals.length; j+= 2) {
                if(eq.equals(vals[j], arr[i])) {
                    newEntry = false;
                    break;
                }
            }
            if(newEntry) {
                keys.push(code);
                vals.push(arr[i]);
                vals.push(true);
                size++;
            }
        }
    }
    return new TransitSet(new TransitMap(keys, map));
}

function Quote(obj) {
    this.obj = obj;
}

function quoted(obj) {
    return new Quote(obj);
}

function TaggedValue(tag, rep) {
    this.tag = tag;
    this.rep = rep;
}

function taggedValue(tag, rep) {
    return new TaggedValue(tag, rep);
}

function LinkedList(head, tail) {
    this.head = head;
    this.tail = tail;
}

function cons(x, tail) {
    return new LinkedList(x, tail);
};

function Queue() {
    this.list = null;
}

Queue.prototype.peek = function() {
    if(this.list) {
        return this.list.head;
    } else {
        return null;
    }
};

Queue.prototype.push = function(x) {
    this.list = cons(x, this.list);
};

Queue.prototype.pop = function(x) {
    if(this.list) {
        var ret = this.list.head;
        this.list = this.list.tail;
        return ret;
    } else {
        return null;
    }
};

function queue() {
    return new Queue();
}

function List(arr) {
    this.arr = arr;
}

function list(xs) {
    return new List(xs);
}

module.exports = {
    nullValue: nullValue,
    boolValue: boolValue,
    intValue: intValue,
    floatValue: floatValue,
    BigDecimal: BigDecimal,
    bigDecimalValue: bigDecimalValue,
    charValue: charValue,
    keyword: keyword,
    Keyword: Keyword,
    symbol: symbol,
    Symbol: Symbol,
    uuid: uuid,
    UUID: UUID,
    map: transitMap,
    TransitMap: TransitMap,
    set: transitSet,
    TransitSet: TransitSet,
    cmap: cmap,
    date: date,
    Binary: Binary,
    binary: binary,
    uri: uri,
    List: List,
    list: list,
    ints: ints,
    longs: longs,
    floats: floats,
    doubles: doubles,
    bools: bools,
    taggedValue: taggedValue,
    TaggedValue: TaggedValue,
    quoted: quoted,
    Quote: Quote,
    queue: queue,
    Queue: Queue
};
