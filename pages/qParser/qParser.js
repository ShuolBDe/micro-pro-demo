// pages/qParser/qParser.js
var htmlparser = require('./htmlparser');

var block = makeSet('div,p'),
    inline = makeSet('em,img,span');

function qParser(html) {
    var json = {};
    var handler = new htmlparser.HtmlBuilder(function(err, dom) {
      if(err) {
        console.log(err);
      }
    });
    var parser = new htmlparser.Parser(handler);
    parser.parseComplete(html);
    json = process(handler.dom);
    return json;
}

function extend(target, ext) {
    var copy = null;
    for(let prop in ext) {
        copy = ext[prop];
        if(copy instanceof Array) {
            target[prop] = extend([], copy);
        } else if(copy instanceof Object) {
            target[prop] = extend({}, copy);
        } else {
            target[prop] = copy;
        }
    }
    return target;
}

function getAttrs(str) {
    if(!str) {
        return {};
    }
    var regExp = /([^\s]*?)=(?:"([^\"]*?)")|(?:'([^\']*?)')/g;
    var attrs = {};
    str.replace(regExp, function(match, m1, m2) {
        attrs[m1] = m2;
    });
    return attrs;
}

// htmlparser转出的数据，子元素的attr会被计入父元素、子元素（自闭合标签标签 eg:<img/> <br/>）中会丢失attr
// 使用本函数修正
function process(doms) {
    if(Array.isArray(doms)) {
        doms.forEach((dom, index) => {
            dom.tagType = block.has(dom.name) ? 'block' : 'inline';
            dom.attributes = extend({}, getAttrs(dom.raw));
            if(dom.children) {
                var children = dom.children;
                children.forEach( (c, index) => {
                    if(c.type == 'tag' && !c.attributes) {
                        c.attributes = extend({}, getAttrs(c.raw));
                    }
                    process(c);
                });
            }
        });
    } else {
        doms.tagType = block.has(doms.name) ? 'block' : 'inline';
        doms.attributes = extend({}, getAttrs(doms.raw));
    }
    return doms;
}

function makeSet(str) {
    var s = new Set();
    str.split(',').map( (item, index) => s.add(item));
    return s;
}
module.exports = qParser;