!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.contentful=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _ = require('underscore-contrib');
var questor = require('questor');
var redefine = require('redefine');
var querystring = require('querystring');

var Client = redefine.Class({
  constructor: function Client(options) {
    enforcep(options, 'accessToken');
    enforcep(options, 'space');

    this.options = _.defaults({}, options, {
      host: 'cdn.contentful.com',
      secure: true
    });
  },

  request: function(path, options) {
    if (!options) options = {};
    if (!options.headers) options.headers = {};
    if (!options.query) options.query = {};
    options.headers['Content-Type'] = 'application/vnd.contentful.delivery.v1+json';
    options.query.access_token = this.options.accessToken;

    var uri = [
      this.options.secure ? 'https' : 'http',
      '://',
      _.first(this.options.host.split(':')),
      ':',
      this.options.secure ? '443' : '80',
      '/spaces/',
      this.options.space,
      path,
      '?',
      querystring.stringify(options.query)
    ].join('');

    return questor(uri, options)
      .then(parseJSONBody)
      .catch(Error, function(error) {
        throw error;
      })
      .catch(function(error) {
        throw parseJSONBody(error);
      });
  },

  asset: function(id, callback) {
    return this.request('/assets/' + id).then(Asset.parse).nodeify(callback);
  },

  assets: function(object, callback) {
    var query = Query.parse(object);
    return this.request('/assets', {query: query})
      .then(_.partial(SearchResult.parse, Asset))
      .nodeify(callback);
  },

  contentType: function(id, callback) {
    return this.request('/content_types/' + id)
      .then(ContentType.parse)
      .nodeify(callback);
  },

  contentTypes: function(object, callback) {
    var query = Query.parse(object);
    return this.request('/content_types', {query: query})
      .then(_.partial(SearchResult.parse, ContentType))
      .nodeify(callback);
  },

  entry: function(id, callback) {
    return this.request('/entries/' + id)
      .then(Entry.parse)
      .nodeify(callback);
  },

  entries: function(object, callback) {
    var query = Query.parse(object);
    return this.request('/entries', {query: query})
      .then(_.partial(SearchResult.parse, Entry))
      .nodeify(callback);
  },

  space: function(callback) {
    return this.request('').nodeify(callback);
  }
});

var Asset = redefine.Class({
  constructor: function Asset() {},

  statics: {
    parse: function(object) {
      return _.extend(new Asset(), {
        sys: Sys.parse(object.sys),
        fields: object.fields
      });
    }
  }
});

var Entry = redefine.Class({
  constructor: function Entry() {},

  statics: {
    parse: function(object) {
      return _.extend(new Entry(), {
        sys: Sys.parse(object.sys),
        fields: object.fields
      });
    }
  }
});

var ContentType = redefine.Class({
  constructor: function ContentType() {},

  statics: {
    parse: function(object) {
      return _.extend(new ContentType(), {
        sys: Sys.parse(object.sys),
        fields: object.fields.map(Field.parse),
      }, _.pick(object, 'name', 'displayField'));
    }
  }
});

var Field = redefine.Class({
  constructor: function Field() {},

  statics: {
    parse: function(object) {
      return _.extend(new Field(), object);
    }
  }
});

var SearchResult = redefine.Class({
  constructor: function SearchResult() {},

  statics: {
    parse: function(ItemType, object) {
      walkMutate(object, isParseableResource, parseResource);
      var items = resolveLinks(object);
      return redefine(
        items, {
          limit: object.limit,
          skip: object.skip,
          total: object.total
        }, {
          enumerable: false
        }
      );
    }
  }
});

var Query = redefine.Class({
  constructor: function Query() {},

  toQueryString: function() {
    return querystring.stringify(this);
  },

  statics: {
    parse: function(object) {
      return _.extend(new Query(), stringifyArrayValues(object));
    },
  }
});

var Space = redefine.Class({
  constructor: function Space() {},

  statics: {
    parse: function(object) {
      return _.extend(new Space(), object);
    }
  }
});

var Sys = redefine.Class({
  constructor: function Sys() {},

  statics: {
    parse: function(object) {
      return _.extend(
        new Sys(),
        _.pick(object, 'id', 'revision', 'type', 'locale'),
        compacto({
          contentType: object.contentType && Link.parse(object.contentType),
          createdAt: object.createdAt && new Date(object.createdAt),
          linkType: object.linkType,
          updatedAt: object.updatedAt && new Date(object.updatedAt),
          space: object.space && Link.parse(object.space)
        })
      );
    }
  }
});

var Link = redefine.Class({
  constructor: function Link() {},

  statics: {
    parse: function(object) {
      return _.extend(new Link(), {
        sys: Sys.parse(object.sys)
      });
    }
  }
});

exports.createClient = _.fnull(function(options) {
  return new Client(options);
}, {});

function compacto(object) {
  return _.reduce(object, function(compacted, value, key) {
    if (_.truthy(value)) compacted[key] = value;
    return compacted;
  }, {});
}

function enforcep(object, property) {
  if (!_.exists(object[property]))
    throw new TypeError('Expected property ' + property);
}

var parseableResourceTypes =  {
  Asset: Asset,
  ContentType: ContentType,
  Entry: Entry,
  Space: Space
};

function isParseableResource(object) {
  return _.getPath(object, ['sys', 'type']) in parseableResourceTypes;
}

function parseResource(resource) {
  var Type = parseableResourceTypes[resource.sys.type];
  return Type.parse(resource);
}

function parseJSONBody(response) {
  return JSON.parse(response.body);
}

function stringifyArrayValues(object) {
  return _.reduce(object, function(object, value, key) {
    object[key] = _.isArray(value) ? value.join(',') : value;
    return object;
  }, {});
}

function resolveLinks(response) {
  walkMutate(response, isLink, function(link) {
    return getLink(response, link) || link;
  });
  return response.items;
}

function isLink(object) {
  return _.getPath(object, ['sys', 'type']) === 'Link';
}

function getLink(response, link) {
  var type = link.sys.linkType;
  var id = link.sys.id;
  var pred = function(resource) {
    return resource.sys.type === type && resource.sys.id === id;
  };
  return _.find(response.items, pred) ||
    response.includes && _.find(response.includes[type], pred);
}

function walkMutate(input, pred, mutator) {
  if (pred(input))
    return mutator(input);

  if (_.isArray(input) || _.isObject(input)) {
    _.each(input, function(item, key) {
      input[key] = walkMutate(item, pred, mutator);
    });
    return input;
  }

  return input;
}

},{"querystring":22,"questor":19,"redefine":2,"underscore-contrib":3}],2:[function(require,module,exports){
/*! (C) WebReflection Mit Style License */
var _=this._=function(e,t,n){function q(e,t){for(var n={},r=T(e),i=0,s=r.length,o;i<s;i++)o=r[i],n[o]=x(e,o);return k(t===undefined?N(e):t,n)}function R(e,t,n,r){j(n||Z.defaults||{},_),j(r,_);if(S.call(r,a)||S.call(r,p))delete _[g],delete _[m];E(e,t,_),A(_)}function U(e,t,n,r){R(e,t,r,n instanceof V?n:n instanceof G?X(e,t,n):(P[m]=n,P)),delete P[m]}function z(e,t,n){for(var r in t)S.call(t,r)&&U(e,r,t[r],n)}function W(e,t){for(var n=0,r,i;n<t.length;n++)r=t[n],Q(r)&&(r=(r.type||r.name)==="mixin"?r.call(r)||r:r[h]),C(e,r)}function X(e,t,n){var r=n._,s=S.call(n,i)?!!n[i]:!0,u=S.call(n,o)&&n[o],f=S.call(n,g)&&n[g],l;return n[a]=function(){return H&&(n=x(e,t),delete e[t]),_[m]=r.call(l=this),_[i]=s,_[o]=u,_[g]=f,E(l,t,_),A(_),H&&(j(n,_),E(e,t,_),A(_)),l[t]},H&&(n[i]=!0),n}function V(e){j(e,this)}function $(e){return new V(e)}function J(e){return k(Q(e)?e[h]:e)}function K(e,t,n){var r=J(e);return t?Z(r,t,n):r}function Q(e){return typeof e=="function"}function G(e){this._=Q(e)?e:j(e,this)||e[m]}function Y(e){return new G(e)}function Z(e,t,n,r){return(typeof t=="string"?U(e,t,n,r):z(e,t,n))||e}function et(e){return function(n,r,i){return(typeof r=="string"?U(n,r,i,e):z(n,r,e))||n}}function tt(e,t){var n,r,i,s;while(t=N(t)){i=T(t),n=i.length;while(n--)if(t[r=i[n]]===e){do s=N(t),t=s;while(s[r]===e);return s[r]}}}function nt(){return tt(nt.caller,this).apply(this,arguments)}function rt(e,t){return typeof e=="string"?rt(this,e):e[l+t]||it(e,t)}function it(e,t){return O[m]=b.call(e[t],e),E(e,l+t,O),O[m]=rt,e[l+t]}function st(e,t){var n=S.call(e,s)?e[s]:function(){},i=S.call(e,d)&&e[d],o=S.call(e,u)&&e[u],a;t||(t={},t[g]=!0),delete e[s];if(o){delete e[u],Z(n[h]=J(o),"constructor",n);if(Q(o))for(a in o)S.call(o,a)&&a!=="name"&&a!=="length"&&R(n,a,_,x(o,a))}return i&&(delete e[d],z(n,i,D)),S.call(e,f)&&(W(n[h],[].concat(e[f])),delete e[f]),z(n[h],e,t),ot(n[h]),r in n[h]||E(n[h],r,O),n}function ot(e){return S.call(e,v)?object:E(e,v,M)}var r="bound",i="configurable",s="constructor",o="enumerable",u="extend",a="get",f="mixin",l="__@",c="__proto__",h="prototype",p="set",d="statics",v="super",m="value",g="writable",y=t,b=t.bind||function(t){var n=this;return function(){return n.apply(t,arguments)}},w=function(t,r){return e[t]||n[t]||r},E=w("defineProperty"),S=w("hasOwnProperty"),x=w("getOwnPropertyDescriptor"),T=w("getOwnPropertyNames",n.keys),N=w("getPrototypeOf",function(t){return t[c]}),C=n.mixin||function(t,n){for(var r=T(n),i=r.length;i--;R(t,r[i],_,x(n,r[i])));return t},k=e.create||e.inherit||n.create,L=[i,o,a,p,m,g],A=y("o","delete o."+L.join(";delete o.")),O=k(null),M=k(null),_=k(null),D={},P={},H=!1,B,j,F,I;D[g]=!0,D[o]=!0;for(B=0;B<L.length;B++)L[B]=['if(h.call(a,"','"))b.',"=a.",";"].join(L[B]);j=y("h","return function(a,b){"+L.join("")+"}")(S),M[m]=function at(e){return b.apply(tt(at.caller,e),arguments)},M[i]=M[o]=M[g]=!1,E(nt,"bind",M),M[m]=nt,O[o]=!1,O[i]=O[g]=!0,O[m]=rt,Z.from=K,Z.Class=st,Z[v]=ot,Z.mixin=C,Z.bound=rt,Z.clone=q,Z.as=$,Z.later=Y,Z.using=et,Z.defaults={},"undefined"!=typeof module&&module.exports&&((module.exports=Z).redefine=Z),e.mixin?e.mixin({redefine:Z}):e.redefine=Z;try{I=k(Z({},{_:Y(n)}))._}catch(ut){A(_),H=!0}return e}(_||this,Function,Object);
},{}],3:[function(require,module,exports){
require('./underscore.array.builders');
require('./underscore.array.selectors');
require('./underscore.collections.walk');
require('./underscore.function.arity');
require('./underscore.function.combinators');
require('./underscore.function.dispatch');
require('./underscore.function.iterators');
require('./underscore.function.predicates');
require('./underscore.object.builders');
require('./underscore.object.selectors');
require('./underscore.util.existential');
require('./underscore.util.operators');
require('./underscore.util.strings');
require('./underscore.util.trampolines');

module.exports = require('underscore');

},{"./underscore.array.builders":5,"./underscore.array.selectors":6,"./underscore.collections.walk":7,"./underscore.function.arity":8,"./underscore.function.combinators":9,"./underscore.function.dispatch":10,"./underscore.function.iterators":11,"./underscore.function.predicates":12,"./underscore.object.builders":13,"./underscore.object.selectors":14,"./underscore.util.existential":15,"./underscore.util.operators":16,"./underscore.util.strings":17,"./underscore.util.trampolines":18,"underscore":4}],4:[function(require,module,exports){
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.5.2';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, iterator, context) {
    var result;
    any(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
    each(obj, function(value, index, list) {
      if (iterator.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, iterator, context) {
    return _.filter(obj, function(value, index, list) {
      return !iterator.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
    each(obj, function(value, index, list) {
      if (!(result = result && iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, iterator, context) {
    iterator || (iterator = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
    each(obj, function(value, index, list) {
      if (result || (result = iterator.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, function(value){ return value[key]; });
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs, first) {
    if (_.isEmpty(attrs)) return first ? void 0 : [];
    return _[first ? 'find' : 'filter'](obj, function(value) {
      for (var key in attrs) {
        if (attrs[key] !== value[key]) return false;
      }
      return true;
    });
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.where(obj, attrs, true);
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return -Infinity;
    var result = {computed : -Infinity, value: -Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed > result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    if (!iterator && _.isEmpty(obj)) return Infinity;
    var result = {computed : Infinity, value: Infinity};
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      computed < result.computed && (result = {value : value, computed : computed});
    });
    return result.value;
  };

  // Shuffle an array, using the modern version of the 
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from an array.
  // If **n** is not specified, returns a single random element from the array.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (arguments.length < 2 || guard) {
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    return _.isFunction(value) ? value : function(obj){ return obj[value]; };
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, value, context) {
    var iterator = lookupIterator(value);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, value, context) {
      var result = {};
      var iterator = value == null ? _.identity : lookupIterator(value);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    (_.has(result, key) ? result[key] : (result[key] = [])).push(value);
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = iterator == null ? _.identity : lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    return (n == null) || guard ? array[0] : slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) {
      return array[array.length - 1];
    } else {
      return slice.call(array, Math.max(array.length - n, 0));
    }
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.indexOf(other, item) >= 0;
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, "length").concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context.
  _.partial = function(func) {
    var args = slice.call(arguments, 1);
    return function() {
      return func.apply(this, args.concat(slice.call(arguments)));
    };
  };

  // Bind all of an object's methods to that object. Useful for ensuring that
  // all callbacks defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error("bindAll must be passed function names");
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : new Date;
      timeout = null;
      result = func.apply(context, args);
    };
    return function() {
      var now = new Date;
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;
    return function() {
      context = this;
      args = arguments;
      timestamp = new Date();
      var later = function() {
        var last = (new Date()) - timestamp;
        if (last < wait) {
          timeout = setTimeout(later, wait - last);
        } else {
          timeout = null;
          if (!immediate) result = func.apply(context, args);
        }
      };
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) result = func.apply(context, args);
      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return function() {
      var args = [func];
      push.apply(args, arguments);
      return wrapper.apply(this, args);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = nativeKeys || function(obj) {
    if (obj !== Object(obj)) throw new TypeError('Invalid object');
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

}).call(this);

},{}],5:[function(require,module,exports){
// Underscore-contrib (underscore.array.builders.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------
  
  // Create quick reference variables for speed access to core prototypes.
  var slice   = Array.prototype.slice,
      concat  = Array.prototype.concat;

  var existy = function(x) { return x != null; };

  // Mixing in the array builders
  // ----------------------------

  _.mixin({
    // Concatenates one or more arrays given as arguments.  If given objects and
    // scalars as arguments `cat` will plop them down in place in the result 
    // array.  If given an `arguments` object, `cat` will treat it like an array
    // and concatenate it likewise.
    cat: function() {
      return _.reduce(arguments, function(acc, elem) {
        if (_.isArguments(elem)) {
          return concat.call(acc, slice.call(elem));
        }
        else {
          return concat.call(acc, elem);
        }
      }, []);
    },

    // 'Constructs' an array by putting an element at its front
    cons: function(head, tail) {
      return _.cat([head], tail);
    },

    // Takes an array and parititions it some number of times into
    // sub-arrays of size n.  Allows and optional padding array as
    // the third argument to fill in the tail partition when n is
    // not sufficient to build paritions of the same size.
    partition: function(array, n, pad) {
      var p = function(array) {
        if (array == null) return [];

        var part = _.take(array, n);

        if (n === _.size(part)) {
          return _.cons(part, p(_.drop(array, n)));
        }
        else {
          return pad ? [_.take(_.cat(part, pad), n)] : [];
        }
      };

      return p(array);
    },

    // Takes an array and parititions it some number of times into
    // sub-arrays of size n.  If the array given cannot fill the size
    // needs of the final partition then a smaller partition is used
    // for the last.
    partitionAll: function(array, n, step) {
      step = (step != null) ? step : n;

      var p = function(array, n, step) {
        if (_.isEmpty(array)) return [];

        return _.cons(_.take(array, n),
                      p(_.drop(array, step), n, step));
      };

      return p(array, n, step);
    },

    // Maps a function over an array and concatenates all of the results.
    mapcat: function(array, fun) {
      return _.cat.apply(null, _.map(array, fun));
    },

    // Returns an array with some item between each element
    // of a given array.
    interpose: function(array, inter) {
      if (!_.isArray(array)) throw new TypeError;
      var sz = _.size(array);
      if (sz === 0) return array;
      if (sz === 1) return array;

      return slice.call(_.mapcat(array, function(elem) { 
        return _.cons(elem, [inter]);
      }), 0, -1);
    },

    // Weaves two or more arrays together
    weave: function(/* args */) {
      if (!_.some(arguments)) return [];
      if (arguments.length == 1) return arguments[0];

      return _.filter(_.flatten(_.zip.apply(null, arguments), true), function(elem) {
        return elem != null;
      });
    },
    interleave: _.weave,

    // Returns an array of a value repeated a certain number of
    // times.
    repeat: function(t, elem) {
      return _.times(t, function() { return elem; });
    },

    // Returns an array built from the contents of a given array repeated
    // a certain number of times.
    cycle: function(t, elems) {
      return _.flatten(_.times(t, function() { return elems; }), true);
    },

    // Returns an array with two internal arrays built from
    // taking an original array and spliting it at an index.
    splitAt: function(array, index) {
      return [_.take(array, index), _.drop(array, index)];
    },

    // Call a function recursively f(f(f(args))) until a second
    // given function goes falsey.  Expects a seed value to start.
    iterateUntil: function(doit, checkit, seed) {
      var ret = [];
      var result = doit(seed);

      while (checkit(result)) {
        ret.push(result);
        result = doit(result);
      }

      return ret;
    },

    // Takes every nth item from an array, returning an array of
    // the results.
    takeSkipping: function(array, n) {
      var ret = [];
      var sz = _.size(array);

      if (n <= 0) return [];
      if (n === 1) return array;

      for(var index = 0; index < sz; index += n) {
        ret.push(array[index]);
      }

      return ret;
    },

    // Returns an array of each intermediate stage of a call to
    // a `reduce`-like function.
    reductions: function(array, fun, init) {
      var ret = [];
      var acc = init;

      _.each(array, function(v,k) {
        acc = fun(acc, array[k]);
        ret.push(acc);
      });

      return ret;
    },

    // Runs its given function on the index of the elements rather than 
    // the elements themselves, keeping all of the truthy values in the end.
    keepIndexed: function(array, pred) {
      return _.filter(_.map(_.range(_.size(array)), function(i) {
        return pred(i, array[i]);
      }),
      existy);
    },

    // Accepts an array-like object (other than strings) as an argument and
    // returns an array whose elements are in the reverse order. Unlike the
    // built-in `Array.prototype.reverse` method, this does not mutate the
    // original object. Note: attempting to use this method on a string will
    // result in a `TypeError`, as it cannot properly reverse unicode strings.

    reverseOrder: function(obj) {
      if (typeof obj == 'string')
        throw new TypeError('Strings cannot be reversed by _.reverseOrder');
      return slice.call(obj).reverse();
    }
  });

})(this);

},{"underscore":4}],6:[function(require,module,exports){
// Underscore-contrib (underscore.array.selectors.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variables for speed access to core prototypes.
  var slice   = Array.prototype.slice,
      concat  = Array.prototype.concat;

  var existy = function(x) { return x != null; };
  var truthy = function(x) { return (x !== false) && existy(x); };
  var isSeq = function(x) { return (_.isArray(x)) || (_.isArguments(x)); };

  // Mixing in the array selectors
  // ----------------------------

  _.mixin({
    // Returns the second element of an array. Passing **n** will return all but
    // the first of the head N values in the array.  The **guard** check allows it
    // to work with `_.map`.
    second: function(array, n, guard) {
      if (array == null) return void 0;
      return (n != null) && !guard ? slice.call(array, 1, n) : array[1];
    },

    // Returns the third element of an array. Passing **n** will return all but
    // the first two of the head N values in the array.  The **guard** check allows it
    // to work with `_.map`.
    third: function(array, n, guard) {
      if (array == null) return void 0;
      return (n != null) && !guard ? slice.call(array, 2, n) : array[2];
    },

    // A function to get at an index into an array
    nth: function(array, index, guard) {
      if ((index != null) && !guard) return array[index];
    },

    // Takes all items in an array while a given predicate returns truthy.
    takeWhile: function(array, pred) {
      if (!isSeq(array)) throw new TypeError;

      var sz = _.size(array);

      for (var index = 0; index < sz; index++) {
        if(!truthy(pred(array[index]))) {
          break;
        }
      }

      return _.take(array, index);
    },

    // Drops all items from an array while a given predicate returns truthy.
    dropWhile: function(array, pred) {
      if (!isSeq(array)) throw new TypeError;

      var sz = _.size(array);

      for (var index = 0; index < sz; index++) {
        if(!truthy(pred(array[index])))
          break;
      }

      return _.drop(array, index);
    },

    // Returns an array with two internal arrays built from
    // taking an original array and spliting it at the index
    // where a given function goes falsey.
    splitWith: function(array, pred) {
      return [_.takeWhile(array, pred), _.dropWhile(array, pred)];
    },

    // Takes an array and partitions it as the given predicate changes
    // truth sense.
    partitionBy: function(array, fun){
      if (_.isEmpty(array) || !existy(array)) return [];

      var fst    = _.first(array);
      var fstVal = fun(fst);
      var run    = concat.call([fst], _.takeWhile(_.rest(array), function(e) {
        return _.isEqual(fstVal, fun(e));
      }));

      return concat.call([run], _.partitionBy(_.drop(array, _.size(run)), fun));
    },

    // Returns the 'best' value in an array based on the result of a
    // given function.
    best: function(array, fun) {
      return _.reduce(array, function(x, y) {
        return fun(x, y) ? x : y;
      });
    },

    // Returns an array of existy results of a function over an source array.
    keep: function(array, fun) {
      if (!isSeq(array)) throw new TypeError("expected an array as the first argument");

      return _.filter(_.map(array, function(e) {
        return fun(e);
      }), existy);
    }
  });

})(this);

},{"underscore":4}],7:[function(require,module,exports){
// Underscore-contrib (underscore.collections.walk.js 0.0.1)
// (c) 2013 Patrick Dubroy
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // An internal object that can be returned from a visitor function to
  // prevent a top-down walk from walking subtrees of a node.
  var stopRecursion = {};

  // An internal object that can be returned from a visitor function to
  // cause the walk to immediately stop.
  var stopWalk = {};

  var notTreeError = 'Not a tree: same object found in two different branches';

  // Implements the default traversal strategy: if `obj` is a DOM node, walk
  // its DOM children; otherwise, walk all the objects it references.
  function defaultTraversal(obj) {
    return _.isElement(obj) ? obj.children : obj;
  }

  // Walk the tree recursively beginning with `root`, calling `beforeFunc`
  // before visiting an objects descendents, and `afterFunc` afterwards.
  // If `collectResults` is true, the last argument to `afterFunc` will be a
  // collection of the results of walking the node's subtrees.
  function walkImpl(root, traversalStrategy, beforeFunc, afterFunc, context, collectResults) {
    var visited = [];
    return (function _walk(value, key, parent) {
      // Keep track of objects that have been visited, and throw an exception
      // when trying to visit the same object twice.
      if (_.isObject(value)) {
        if (visited.indexOf(value) >= 0) throw new TypeError(notTreeError);
        visited.push(value);
      }

      if (beforeFunc) {
        var result = beforeFunc.call(context, value, key, parent);
        if (result === stopWalk) return stopWalk;
        if (result === stopRecursion) return;
      }

      var subResults;
      var target = traversalStrategy(value);
      if (_.isObject(target) && !_.isEmpty(target)) {
        // If collecting results from subtrees, collect them in the same shape
        // as the parent node.
        if (collectResults) subResults = _.isArray(value) ? [] : {};

        var stop = _.any(target, function(obj, key) {
          var result = _walk(obj, key, value);
          if (result === stopWalk) return true;
          if (subResults) subResults[key] = result;
        });
        if (stop) return stopWalk;
      }
      if (afterFunc) return afterFunc.call(context, value, key, parent, subResults);
    })(root);
  }

  // Internal helper providing the implementation for `pluck` and `pluckRec`.
  function pluck(obj, propertyName, recursive) {
    var results = [];
    this.preorder(obj, function(value, key) {
      if (!recursive && key == propertyName)
        return stopRecursion;
      if (_.has(value, propertyName))
        results[results.length] = value[propertyName];
    });
    return results;
  }

  var exports = {
    // Performs a preorder traversal of `obj` and returns the first value
    // which passes a truth test.
    find: function(obj, visitor, context) {
      var result;
      this.preorder(obj, function(value, key, parent) {
        if (visitor.call(context, value, key, parent)) {
          result = value;
          return stopWalk;
        }
      }, context);
      return result;
    },

    // Recursively traverses `obj` and returns all the elements that pass a
    // truth test. `strategy` is the traversal function to use, e.g. `preorder`
    // or `postorder`.
    filter: function(obj, strategy, visitor, context) {
      var results = [];
      if (obj == null) return results;
      strategy(obj, function(value, key, parent) {
        if (visitor.call(context, value, key, parent)) results.push(value);
      }, null, this._traversalStrategy);
      return results;
    },

    // Recursively traverses `obj` and returns all the elements for which a
    // truth test fails.
    reject: function(obj, strategy, visitor, context) {
      return this.filter(obj, strategy, function(value, key, parent) {
        return !visitor.call(context, value, key, parent);
      });
    },

    // Produces a new array of values by recursively traversing `obj` and
    // mapping each value through the transformation function `visitor`.
    // `strategy` is the traversal function to use, e.g. `preorder` or
    // `postorder`.
    map: function(obj, strategy, visitor, context) {
      var results = [];
      strategy(obj, function(value, key, parent) {
        results[results.length] = visitor.call(context, value, key, parent);
      }, null, this._traversalStrategy);
      return results;
    },

    // Return the value of properties named `propertyName` reachable from the
    // tree rooted at `obj`. Results are not recursively searched; use
    // `pluckRec` for that.
    pluck: function(obj, propertyName) {
      return pluck.call(this, obj, propertyName, false);
    },

    // Version of `pluck` which recursively searches results for nested objects
    // with a property named `propertyName`.
    pluckRec: function(obj, propertyName) {
      return pluck.call(this, obj, propertyName, true);
    },

    // Recursively traverses `obj` in a depth-first fashion, invoking the
    // `visitor` function for each object only after traversing its children.
    // `traversalStrategy` is intended for internal callers, and is not part
    // of the public API.
    postorder: function(obj, visitor, context, traversalStrategy) {
      traversalStrategy = traversalStrategy || this._traversalStrategy;
      walkImpl(obj, traversalStrategy, null, visitor, context);
    },

    // Recursively traverses `obj` in a depth-first fashion, invoking the
    // `visitor` function for each object before traversing its children.
    // `traversalStrategy` is intended for internal callers, and is not part
    // of the public API.
    preorder: function(obj, visitor, context, traversalStrategy) {
      traversalStrategy = traversalStrategy || this._traversalStrategy;
      walkImpl(obj, traversalStrategy, visitor, null, context);
    },

    // Builds up a single value by doing a post-order traversal of `obj` and
    // calling the `visitor` function on each object in the tree. For leaf
    // objects, the `memo` argument to `visitor` is the value of the `leafMemo`
    // argument to `reduce`. For non-leaf objects, `memo` is a collection of
    // the results of calling `reduce` on the object's children.
    reduce: function(obj, visitor, leafMemo, context) {
      var reducer = function(value, key, parent, subResults) {
        return visitor(subResults || leafMemo, value, key, parent);
      };
      return walkImpl(obj, this._traversalStrategy, null, reducer, context, true);
    }
  };

  // Set up aliases to match those in underscore.js.
  exports.collect = exports.map;
  exports.detect = exports.find;
  exports.select = exports.filter;

  // Returns an object containing the walk functions. If `traversalStrategy`
  // is specified, it is a function determining how objects should be
  // traversed. Given an object, it returns the object to be recursively
  // walked. The default strategy is equivalent to `_.identity` for regular
  // objects, and for DOM nodes it returns the node's DOM children.
  _.walk = function(traversalStrategy) {
    var walker = _.clone(exports);

    // Bind all of the public functions in the walker to itself. This allows
    // the traversal strategy to be dynamically scoped.
    _.bindAll.apply(null, [walker].concat(_.keys(walker)));

    walker._traversalStrategy = traversalStrategy || defaultTraversal;
    return walker;
  };

  // Use `_.walk` as a namespace to hold versions of the walk functions which
  // use the default traversal strategy.
  _.extend(_.walk, _.walk());
})(this);

},{"underscore":4}],8:[function(require,module,exports){
// Underscore-contrib (underscore.function.arity.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  function enforcesUnary (fn) {
    return function mustBeUnary () {
      if (arguments.length === 1) {
        return fn.apply(this, arguments);
      }
      else throw new RangeError('Only a single argument may be accepted.');

    };
  }

  // Curry
  // -------
  var curry = (function () {
    function collectArgs(func, that, argCount, args, newArg, reverse) {
      if (reverse === true) {
        args.unshift(newArg);
      } else {
        args.push(newArg);
      }
      if (args.length == argCount) {
        return func.apply(that, args);
      } else {
        return enforcesUnary(function () {
          return collectArgs(func, that, argCount, args.slice(0), arguments[0], reverse);
        });
      }
    }
    return function curry (func, reverse) {
      var that = this;
      return enforcesUnary(function () {
        return collectArgs(func, that, func.length, [], arguments[0], reverse);
      });
    };
  }());

  // Enforce Arity
  // --------------------
  var enforce = (function () {
    var CACHE = [];
    return function enforce (func) {
      if (typeof func !== 'function') {
        throw new Error('Argument 1 must be a function.');
      }
      var funcLength = func.length;
      if (CACHE[funcLength] === undefined) {
        CACHE[funcLength] = function (enforceFunc) {
          return function () {
            if (arguments.length !== funcLength) {
              throw new RangeError(funcLength + ' arguments must be applied.');
            }
            return enforceFunc.apply(this, arguments);
          };
        };
      }
      return CACHE[funcLength](func);
    };
  }());

  // Mixing in the arity functions
  // -----------------------------

  _.mixin({
    // ### Fixed arguments

    // Fixes the arguments to a function based on the parameter template defined by
    // the presence of values and the `_` placeholder.
    fix: function(fun) {
      var fixArgs = _.rest(arguments);

      var f = function() {
        var args = fixArgs.slice();
        var arg = 0;

        for ( var i = 0; i < args.length || arg < arguments.length; i++ ) {
          if ( args[i] === _ ) {
            args[i] = arguments[arg++];
          }
        }

        return fun.apply(null, args);
      };

      f._original = fun;

      return f;
    },

    unary: function (fun) {
      return function unary (a) {
        return fun.call(this, a);
      };
    },

    binary: function (fun) {
      return function binary (a, b) {
        return fun.call(this, a, b);
      };
    },

    ternary: function (fun) {
      return function ternary (a, b, c) {
        return fun.call(this, a, b, c);
      };
    },

    quaternary: function (fun) {
      return function quaternary (a, b, c, d) {
        return fun.call(this, a, b, c, d);
      };
    },

    // Flexible curry function with strict arity.
    // Argument application left to right.
    // source: https://github.com/eborden/js-curry
    curry: curry,

    // Flexible right to left curry with strict arity.
    rCurry: function (func) {
      return curry.call(this, func, true);
    },


    curry2: function (fun) {
      return enforcesUnary(function curried (first) {
        return enforcesUnary(function (last) {
          return fun.call(this, first, last);
        });
      });
    },

    curry3: function (fun) {
      return enforcesUnary(function (first) {
        return enforcesUnary(function (second) {
          return enforcesUnary(function (last) {
            return fun.call(this, first, second, last);
          });
        });
      });
    },

      // reverse currying for functions taking two arguments.
    rcurry2: function (fun) {
      return enforcesUnary(function (last) {
        return enforcesUnary(function (first) {
          return fun.call(this, first, last);
        });
      });
    },

    rcurry3: function (fun) {
      return enforcesUnary(function (last) {
        return enforcesUnary(function (second) {
          return enforcesUnary(function (first) {
            return fun.call(this, first, second, last);
          });
        });
      });
    },
    // Dynamic decorator to enforce function arity and defeat varargs.
    enforce: enforce
  });

  _.arity = (function () {
    // Allow 'new Function', as that is currently the only reliable way
    // to manipulate function.length
    /* jshint -W054 */
    var FUNCTIONS = {};
    return function arity (numberOfArgs, fun) {
      if (FUNCTIONS[numberOfArgs] == null) {
        var parameters = new Array(numberOfArgs);
        for (var i = 0; i < numberOfArgs; ++i) {
          parameters[i] = "__" + i;
        }
        var pstr = parameters.join();
        var code = "return function ("+pstr+") { return fun.apply(this, arguments); };";
        FUNCTIONS[numberOfArgs] = new Function(['fun'], code);
      }
      if (fun == null) {
        return function (fun) { return arity(numberOfArgs, fun); };
      }
      else return FUNCTIONS[numberOfArgs](fun);
    };
  })();

})(this);

},{"underscore":4}],9:[function(require,module,exports){
// Underscore-contrib (underscore.function.combinators.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  var existy = function(x) { return x != null; };
  var truthy = function(x) { return (x !== false) && existy(x); };
  var __reverse = [].reverse;
  var __slice = [].slice;
  var __map = [].map;
  var curry2 = function (fun) {
    return function curried (first, optionalLast) {
      if (arguments.length === 1) {
        return function (last) {
          return fun(first, last);
        };
      }
      else return fun(first, optionalLast);
    };
  };
  
  // n.b. depends on underscore.function.arity.js
    
  // Takes a target function and a mapping function. Returns a function
  // that applies the mapper to its arguments before evaluating the body.
  function baseMapArgs (fun, mapFun) {
    return _.arity(fun.length, function () {
      return fun.apply(this, __map.call(arguments, mapFun));
    });
  }
  
  // Mixing in the combinator functions
  // ----------------------------------

  _.mixin({
    // Takes a value and returns a function that always returns
    // said value.
    always: function(value) {
      return function() { return value; };
    },

    // Takes some number of functions, either as an array or variadically
    // and returns a function that takes some value as its first argument 
    // and runs it through a pipeline of the original functions given.
    pipeline: function(/*, funs */){
      var funs = (_.isArray(arguments[0])) ? arguments[0] : arguments;

      return function(seed) {
        return _.reduce(funs,
                        function(l,r) { return r(l); },
                        seed);
      };
    },

    // Composes a bunch of predicates into a single predicate that
    // checks all elements of an array for conformance to all of the
    // original predicates.
    conjoin: function(/* preds */) {
      var preds = arguments;

      return function(array) {
        return _.every(array, function(e) {
          return _.every(preds, function(p) {
            return p(e);
          });
        });
      };
    },

    // Composes a bunch of predicates into a single predicate that
    // checks all elements of an array for conformance to any of the
    // original predicates.
    disjoin: function(/* preds */) {
      var preds = arguments;

      return function(array) {
        return _.some(array, function(e) {
          return _.some(preds, function(p) {
            return p(e);
          });
        });
      };
    },

    // Takes a predicate-like and returns a comparator (-1,0,1).
    comparator: function(fun) {
      return function(x, y) {
        if (truthy(fun(x, y)))
          return -1;
        else if (truthy(fun(y, x)))
          return 1;
        else
          return 0;
      };
    },

    // Returns a function that reverses the sense of a given predicate-like.
    complement: function(pred) {
      return function() {
        return !pred.apply(null, arguments);
      };
    },

    // Takes a function expecting varargs and
    // returns a function that takes an array and
    // uses its elements as the args to  the original
    // function
    splat: function(fun) {
      return function(array) {
        return fun.apply(null, array);
      };
    },

    // Takes a function expecting an array and returns
    // a function that takes varargs and wraps all
    // in an array that is passed to the original function.
    unsplat: function(fun) {
      var funLength = fun.length;

      if (funLength < 1) {
        return fun;
      }
      else if (funLength === 1)  {
        return function () {
          return fun.call(this, __slice.call(arguments, 0));
        };
      }
      else {
        return function () {
          var numberOfArgs = arguments.length,
              namedArgs = __slice.call(arguments, 0, funLength - 1),
              numberOfMissingNamedArgs = Math.max(funLength - numberOfArgs - 1, 0),
              argPadding = new Array(numberOfMissingNamedArgs),
              variadicArgs = __slice.call(arguments, fun.length - 1);

          return fun.apply(this, namedArgs.concat(argPadding).concat([variadicArgs]));
        };
      }
    },

    // Same as unsplat, but the rest of the arguments are collected in the
    // first parameter, e.g. unsplatl( function (args, callback) { ... ]})
    unsplatl: function(fun) {
      var funLength = fun.length;

      if (funLength < 1) {
        return fun;
      }
      else if (funLength === 1)  {
        return function () {
          return fun.call(this, __slice.call(arguments, 0));
        };
      }
      else {
        return function () {
          var numberOfArgs = arguments.length,
              namedArgs = __slice.call(arguments, Math.max(numberOfArgs - funLength + 1, 0)),
              variadicArgs = __slice.call(arguments, 0, Math.max(numberOfArgs - funLength + 1, 0));

          return fun.apply(this, [variadicArgs].concat(namedArgs));
        };
      }
    },
    
    // map the arguments of a function
    mapArgs: curry2(baseMapArgs),

    // Returns a function that returns an array of the calls to each
    // given function for some arguments.
    juxt: function(/* funs */) {
      var funs = arguments;

      return function(/* args */) {
        var args = arguments;
        return _.map(funs, function(f) {
          return f.apply(null, args);
        });
      };
    },

    // Returns a function that protects a given function from receiving
    // non-existy values.  Each subsequent value provided to `fnull` acts
    // as the default to the original function should a call receive non-existy
    // values in the defaulted arg slots.
    fnull: function(fun /*, defaults */) {
      var defaults = _.rest(arguments);

      return function(/*args*/) {
        var args = _.toArray(arguments);
        var sz = _.size(defaults);

        for(var i = 0; i < sz; i++) {
          if (!existy(args[i]))
            args[i] = defaults[i];
        }

        return fun.apply(null, args);
      };
    },

    // Flips the first two args of a function
    flip2: function(fun) {
      return function(/* args */) {
        var flipped = __slice.call(arguments);
        flipped[0] = arguments[1];
        flipped[1] = arguments[0];

        return fun.apply(null, flipped);
      };
    },

    // Flips an arbitrary number of args of a function
    flip: function(fun) {
      return function(/* args */) {
        var reversed = __reverse.call(arguments);

        return fun.apply(null, reversed);
      };
    },

    // Takes a method-style function (one which uses `this`) and pushes
    // `this` into the argument list. The returned function uses its first
    // argument as the receiver/context of the original function, and the rest
    // of the arguments are used as the original's entire argument list.
    functionalize: function(method) {
      return function(ctx /*, args */) {
        return method.apply(ctx, _.rest(arguments));
      };
    },

    // Takes a function and pulls the first argument out of the argument
    // list and into `this` position. The returned function calls the original
    // with its receiver (`this`) prepending the argument list. The original
    // is called with a receiver of `null`.
    methodize: function(func) {
      return function(/* args */) {
        return func.apply(null, _.cons(this, arguments));
      };
    },
    
    k: _.always,
    t: _.pipeline
  });
  
  _.unsplatr = _.unsplat;
    
  // map the arguments of a function, takes the mapping function
  // first so it can be used as a combinator
  _.mapArgsWith = curry2(_.flip(baseMapArgs));
  
  // Returns function property of object by name, bound to object
  _.bound = function(obj, fname) {
    var fn = obj[fname];
    if (!_.isFunction(fn))
      throw new TypeError("Expected property to be a function");
    return _.bind(fn, obj);
  };

})(this);

},{"underscore":4}],10:[function(require,module,exports){
// Underscore-contrib (underscore.function.dispatch.js 0.0.1)
// (c) 2013 Justin Ridgewell
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variable for speed.
  var slice   = Array.prototype.slice;

  // Mixing in the attempt function
  // ------------------------

  _.mixin({
    // If object is not undefined or null then invoke the named `method` function
    // with `object` as context and arguments; otherwise, return undefined.
    attempt: function(object, method) {
      if (object == null) return void 0;
      var func = object[method];
      var args = slice.call(arguments, 2);
      return _.isFunction(func) ? func.apply(object, args) : void 0;
    }
  });

})(this);

},{"underscore":4}],11:[function(require,module,exports){
// Underscore-contrib (underscore.function.iterators.js 0.0.1)
// (c) 2013 Michael Fogus and DocumentCloud Inc.
// Underscore-contrib may be freely distributed under the MIT license.

(function(root, undefined) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------
  
  var HASNTBEENRUN = {};
  
  function unary (fun) {
    return function (first) {
      return fun.call(this, first);
    };
  }
  
  function binary (fun) {
    return function (first, second) {
      return fun.call(this, first, second);
    };
  }
  
  // Mixing in the iterator functions
  // --------------------------------

  function foldl (iter, binaryFn, seed) {
    var state, element;
    if (seed !== void 0) {
      state = seed;
    }
    else {
      state = iter();
    }
    element = iter();
    while (element != null) {
      state = binaryFn.call(element, state, element);
      element = iter();
    }
    return state;
  }
  
  function unfold (seed, unaryFn) {
    var state = HASNTBEENRUN;
    return function () {
      if (state === HASNTBEENRUN) {
        state = seed;
      } else if (state != null) {
        state = unaryFn.call(state, state);
      }

      return state;
    };
  }
  
  // note that the unfoldWithReturn behaves differently than
  // unfold with respect to the first value returned
  function unfoldWithReturn (seed, unaryFn) {
    var state = seed,
        pair,
        value;
    return function () {
      if (state != null) {
        pair = unaryFn.call(state, state);
        value = pair[1];
        state = value != null ? pair[0] : void 0;
        return value;
      }
      else return void 0;
    };
  }

  function accumulate (iter, binaryFn, initial) {
    var state = initial;
    return function () {
      var element = iter();
      if (element == null) {
        return element;
      }
      else {
        if (state === void 0) {
          state = element;
        } else {
          state = binaryFn.call(element, state, element);
        }
        
        return state;
      }
    };
  }
  
  function accumulateWithReturn (iter, binaryFn, initial) {
    var state = initial,
        stateAndReturnValue,
        element;
    return function () {
      element = iter();
      if (element == null) {
        return element;
      }
      else {
        if (state === void 0) {
          state = element;
          return state;
        }
        else {
          stateAndReturnValue = binaryFn.call(element, state, element);
          state = stateAndReturnValue[0];
          return stateAndReturnValue[1];
        }
      }
    };
  }
  
  function map (iter, unaryFn) {
    return function() {
      var element;
      element = iter();
      if (element != null) {
        return unaryFn.call(element, element);
      } else {
        return void 0;
      }
    };
  }

  function mapcat(iter, unaryFn) {
    var lastIter = null;
    return function() {
      var element;
      var gen;
      if (lastIter == null) {
        gen = iter();
        if (gen == null) {
          lastIter = null;
          return void 0;
        }
        lastIter = unaryFn.call(gen, gen);
      }
      while (element == null) {
        element = lastIter();
        if (element == null) {
          gen = iter();
          if (gen == null) {
            lastIter = null;
            return void 0;
          }
          else {
            lastIter = unaryFn.call(gen, gen);
          }
        }
      }
      return element;
    };
  }

  function select (iter, unaryPredicateFn) {
    return function() {
      var element;
      element = iter();
      while (element != null) {
        if (unaryPredicateFn.call(element, element)) {
          return element;
        }
        element = iter();
      }
      return void 0;
    };
  }
  
  function reject (iter, unaryPredicateFn) {
    return select(iter, function (something) {
      return !unaryPredicateFn(something);
    });
  }
  
  function find (iter, unaryPredicateFn) {
    return select(iter, unaryPredicateFn)();
  }

  function slice (iter, numberToDrop, numberToTake) {
    var count = 0;
    while (numberToDrop-- > 0) {
      iter();
    }
    if (numberToTake != null) {
      return function() {
        if (++count <= numberToTake) {
          return iter();
        } else {
          return void 0;
        }
      };
    }
    else return iter;
  }
  
  function drop (iter, numberToDrop) {
    return slice(iter, numberToDrop == null ? 1 : numberToDrop);
  }

  function take (iter, numberToTake) {
    return slice(iter, 0, numberToTake == null ? 1 : numberToTake);
  }

  function List (array) {
    var index = 0;
    return function() {
      return array[index++];
    };
  }
  
  function Tree (array) {
    var index, myself, state;
    index = 0;
    state = [];
    myself = function() {
      var element, tempState;
      element = array[index++];
      if (element instanceof Array) {
        state.push({
          array: array,
          index: index
        });
        array = element;
        index = 0;
        return myself();
      } else if (element === void 0) {
        if (state.length > 0) {
          tempState = state.pop();
          array = tempState.array;
          index = tempState.index;
          return myself();
        } else {
          return void 0;
        }
      } else {
        return element;
      }
    };
    return myself;
  }
  
  function K (value) {
    return function () {
      return value;
    };
  }

  function upRange (from, to, by) {
    return function () {
      var was;
    
      if (from > to) {
        return void 0;
      }
      else {
        was = from;
        from = from + by;
        return was;
      }
    };
  }

  function downRange (from, to, by) {
    return function () {
      var was;
    
      if (from < to) {
        return void 0;
      }
      else {
        was = from;
        from = from - by;
        return was;
      }
    };
  }
  
  function range (from, to, by) {
    if (from == null) {
      return upRange(1, Infinity, 1);
    }
    else if (to == null) {
      return upRange(from, Infinity, 1);
    }
    else if (by == null) {
      if (from <= to) {
        return upRange(from, to, 1);
      }
      else return downRange(from, to, 1);
    }
    else if (by > 0) {
      return upRange(from, to, by);
    }
    else if (by < 0) {
      return downRange(from, to, Math.abs(by));
    }
    else return k(from);
  }
  
  var numbers = unary(range);

  _.iterators = {
    accumulate: accumulate,
    accumulateWithReturn: accumulateWithReturn,
    foldl: foldl,
    reduce: foldl,
    unfold: unfold,
    unfoldWithReturn: unfoldWithReturn,
    map: map,
    mapcat: mapcat,
    select: select,
    reject: reject,
    filter: select,
    find: find,
    slice: slice,
    drop: drop,
    take: take,
    List: List,
    Tree: Tree,
    constant: K,
    K: K,
    numbers: numbers,
    range: range
  };

})(this, void 0);

},{"underscore":4}],12:[function(require,module,exports){
// Underscore-contrib (underscore.function.predicates.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------


  // Mixing in the predicate functions
  // ---------------------------------

  _.mixin({
    // A wrapper around instanceof
    isInstanceOf: function(x, t) { return (x instanceof t); },

    // An associative object is one where its elements are
    // accessed via a key or index. (i.e. array and object)
    isAssociative: function(x) { return _.isArray(x) || _.isObject(x) || _.isArguments(x); },

    // An indexed object is anything that allows numerical index for
    // accessing its elements (e.g. arrays and strings). NOTE: Underscore
    // does not support cross-browser consistent use of strings as array-like
    // objects, so be wary in IE 8 when using  String objects and IE<8.
    // on string literals & objects.
    isIndexed: function(x) { return _.isArray(x) || _.isString(x) || _.isArguments(x); },

    // A seq is something considered a sequential composite type (i.e. arrays and `arguments`).
    isSequential: function(x) { return (_.isArray(x)) || (_.isArguments(x)); },

    // Check if an object is an object literal, since _.isObject(function() {}) === _.isObject([]) === true
    isPlainObject: function(x) { return _.isObject(x) && x.constructor === root.Object; },

    // These do what you think that they do
    isZero: function(x) { return 0 === x; },
    isEven: function(x) { return _.isFinite(x) && (x & 1) === 0; },
    isOdd: function(x) { return _.isFinite(x) && !_.isEven(x); },
    isPositive: function(x) { return x > 0; },
    isNegative: function(x) { return x < 0; },
    isValidDate: function(x) { return _.isDate(x) && !_.isNaN(x.getTime()); },

    // A numeric is a variable that contains a numeric value, regardless its type
    // It can be a String containing a numeric value, exponential notation, or a Number object
    // See here for more discussion: http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric/1830844#1830844
    isNumeric: function(n) {
      return !isNaN(parseFloat(n)) && isFinite(n);
    },

    // An integer contains an optional minus sign to begin and only the digits 0-9
    // Objects that can be parsed that way are also considered ints, e.g. "123"
    // Floats that are mathematically equal to integers are considered integers, e.g. 1.0
    // See here for more discussion: http://stackoverflow.com/questions/1019515/javascript-test-for-an-integer
    isInteger: function(i) {
      return _.isNumeric(i) && i % 1 === 0;
    },

    // A float is a numbr that is not an integer.
    isFloat: function(n) {
      return _.isNumeric(n) && !_.isInteger(n);
    },

    // checks if a string is a valid JSON
    isJSON: function(str) {
      try {
        JSON.parse(str);
      } catch (e) {
        return false;
      }
      return true;
    },

    // Returns true if its arguments are monotonically
    // increaing values; false otherwise.
    isIncreasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return arguments[0] < arguments[1];

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] >= arguments[i]) {
          return false;
        }
      }

      return true;
    },

    // Returns true if its arguments are monotonically
    // decreaing values; false otherwise.
    isDecreasing: function() {
      var count = _.size(arguments);
      if (count === 1) return true;
      if (count === 2) return arguments[0] > arguments[1];

      for (var i = 1; i < count; i++) {
        if (arguments[i-1] <= arguments[i]) {
          return false;
        }
      }

      return true;
    }
  });

})(this);

},{"underscore":4}],13:[function(require,module,exports){
// Underscore-contrib (underscore.object.builders.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variables for speed access to core prototypes.
  var slice   = Array.prototype.slice,
      concat  = Array.prototype.concat;

  var existy = function(x) { return x != null; };
  var truthy = function(x) { return (x !== false) && existy(x); };
  var isAssociative = function(x) { return _.isArray(x) || _.isObject(x); };
  var curry2 = function(fun) {
    return function(last) {
      return function(first) {
        return fun(first, last);
      };
    };
  };

  // Mixing in the object builders
  // ----------------------------

  _.mixin({
    // Merges two or more objects starting with the left-most and
    // applying the keys right-word
    // {any:any}* -> {any:any}
    merge: function(/* objs */){
      var dest = _.some(arguments) ? {} : null;

      if (truthy(dest)) {
        _.extend.apply(null, concat.call([dest], _.toArray(arguments)));
      }

      return dest;
    },

    // Takes an object and another object of strings to strings where the second
    // object describes the key renaming to occur in the first object.
    renameKeys: function(obj, kobj) {
      return _.reduce(kobj, function(o, nu, old) {
        if (existy(obj[old])) {
          o[nu] = obj[old];
          return o;
        }
        else
          return o;
      },
      _.omit.apply(null, concat.call([obj], _.keys(kobj))));
    },

    // Snapshots an object deeply. Based on the version by
    // [Keith Devens](http://keithdevens.com/weblog/archive/2007/Jun/07/javascript.clone)
    // until we can find a more efficient and robust way to do it.
    snapshot: function(obj) {
      if(obj == null || typeof(obj) != 'object') {
        return obj;
      }

      var temp = new obj.constructor();

      for(var key in obj) {
        if (obj.hasOwnProperty(key)) {
          temp[key] = _.snapshot(obj[key]);
        }
      }

      return temp;
    },

    // Updates the value at any depth in a nested object based on the
    // path described by the keys given.  The function provided is supplied
    // the current value and is expected to return a value for use as the
    // new value.  If no keys are provided, then the object itself is presented
    // to the given function.
    updatePath: function(obj, fun, ks, defaultValue) {
      if (!isAssociative(obj)) throw new TypeError("Attempted to update a non-associative object.");
      if (!existy(ks)) return fun(obj);

      var deepness = _.isArray(ks);
      var keys     = deepness ? ks : [ks];
      var ret      = deepness ? _.snapshot(obj) : _.clone(obj);
      var lastKey  = _.last(keys);
      var target   = ret;

      _.each(_.initial(keys), function(key) {
        if (defaultValue && !_.has(target, key)) {
          target[key] = _.clone(defaultValue);
        }
        target = target[key];
      });

      target[lastKey] = fun(target[lastKey]);
      return ret;
    },

    // Sets the value at any depth in a nested object based on the
    // path described by the keys given.
    setPath: function(obj, value, ks, defaultValue) {
      if (!existy(ks)) throw new TypeError("Attempted to set a property at a null path.");

      return _.updatePath(obj, function() { return value; }, ks, defaultValue);
    },

    // Returns an object where each element of an array is keyed to
    // the number of times that it occurred in said array.
    frequencies: curry2(_.countBy)(_.identity)
  });

})(this);

},{"underscore":4}],14:[function(require,module,exports){
// Underscore-contrib (underscore.object.selectors.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Create quick reference variables for speed access to core prototypes.
  var concat  = Array.prototype.concat;
  var ArrayProto = Array.prototype;
  var slice = ArrayProto.slice;

  // Mixing in the object selectors
  // ------------------------------

  _.mixin({
    // Returns a function that will attempt to look up a named field
    // in any object that it's given.
    accessor: function(field) {
      return function(obj) {
        return (obj && obj[field]);
      };
    },

    // Given an object, returns a function that will attempt to look up a field
    // that it's given.
    dictionary: function (obj) {
      return function(field) {
        return (obj && field && obj[field]);
      };
    },

    // Like `_.pick` except that it takes an array of keys to pick.
    selectKeys: function (obj, ks) {
      return _.pick.apply(null, concat.call([obj], ks));
    },

    // Returns the key/value pair for a given property in an object, undefined if not found.
    kv: function(obj, key) {
      if (_.has(obj, key)) {
        return [key, obj[key]];
      }

      return void 0;
    },

    // Gets the value at any depth in a nested object based on the
    // path described by the keys given. Keys may be given as an array
    // or as a dot-separated string.
    getPath: function getPath (obj, ks) {
      if (typeof ks == "string") ks = ks.split(".");

      // If we have reached an undefined property
      // then stop executing and return undefined
      if (obj === undefined) return void 0;

      // If the path array has no more elements, we've reached
      // the intended property and return its value
      if (ks.length === 0) return obj;

      // If we still have elements in the path array and the current
      // value is null, stop executing and return undefined
      if (obj === null) return void 0;

      return getPath(obj[_.first(ks)], _.rest(ks));
    },

    // Returns a boolean indicating whether there is a property
    // at the path described by the keys given
    hasPath: function hasPath (obj, ks) {
      if (typeof ks == "string") ks = ks.split(".");

      var numKeys = ks.length;

      if (obj == null && numKeys > 0) return false;

      if (!(ks[0] in obj)) return false;

      if (numKeys === 1) return true;

      return hasPath(obj[_.first(ks)], _.rest(ks));
    },

    pickWhen: function(obj, pred) {
      var copy = {};

      _.each(obj, function(value, key) {
        if (pred(obj[key])) copy[key] = obj[key];
      });

      return copy;
    },

    omitWhen: function(obj, pred) {
      return _.pickWhen(obj, function(e) { return !pred(e); });
    }

  });

})(this);

},{"underscore":4}],15:[function(require,module,exports){
// Underscore-contrib (underscore.util.existential.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  
  // Mixing in the truthiness
  // ------------------------

  _.mixin({
    exists: function(x) { return x != null; },
    truthy: function(x) { return (x !== false) && _.exists(x); },
    falsey: function(x) { return !_.truthy(x); },
    not:    function(b) { return !b; },
    firstExisting: function() {
      for (var i = 0; i < arguments.length; i++) {
        if (arguments[i] != null) return arguments[i];
      }
    }
  });

})(this);

},{"underscore":4}],16:[function(require,module,exports){
// Underscore-contrib (underscore.function.arity.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Setup for variadic operators
  // ----------------------------

  // Turn a binary math operator into a variadic operator
  function variadicMath(operator) {
    return function() {
      return _.reduce(arguments, operator);
    };
  }

  // Turn a binary comparator into a variadic comparator
  function variadicComparator(comparator) {
    return function() {
      var result;
      for (var i = 0; i < arguments.length - 1; i++) {
        result = comparator(arguments[i], arguments[i + 1]);
        if (result === false) return result;
      }
      return result; 
    };
  }

  // Turn a boolean-returning function into one with the opposite meaning
  function invert(fn) {
    return function() {
      return !fn.apply(this, arguments);
    };
  }

  // Basic math operators
  function add(x, y) {
    return x + y;
  }

  function sub(x, y) {
    return x - y;
  }

  function mul(x, y) {
    return x * y;
  }

  function div(x, y) {
    return x / y;
  }

  function mod(x, y) {
    return x % y;
  }

  function inc(x) {
    return ++x;
  }

  function dec(x) {
    return --x;
  }

  function neg(x) {
    return -x;
  }

  // Bitwise operators
  function bitwiseAnd(x, y) {
    return x & y;
  }

  function bitwiseOr(x, y) {
    return x | y;
  }

  function bitwiseXor(x, y) {
    return x ^ y;
  }

  function bitwiseLeft(x, y) {
    return x << y;
  }

  function bitwiseRight(x, y) {
    return x >> y;
  }

  function bitwiseZ(x, y) {
    return x >>> y;
  }

  function bitwiseNot(x) {
    return ~x;
  }

  // Basic comparators
  function eq(x, y) {
    return x == y;
  }

  function seq(x, y) {
    return x === y;
  }

  // Not
  function not(x) {
    return !x;
  }

  // Relative comparators
  function gt(x, y) {
    return x > y;
  }

  function lt(x, y) {
    return x < y;
  }

  function gte(x, y) {
    return x >= y;
  }

  function lte(x, y) {
    return x <= y;
  }

  // Mixing in the operator functions
  // -----------------------------

  _.mixin({
    add: variadicMath(add),
    sub: variadicMath(sub),
    mul: variadicMath(mul),
    div: variadicMath(div),
    mod: mod,
    inc: inc,
    dec: dec,
    neg: neg,
    eq: variadicComparator(eq),
    seq: variadicComparator(seq),
    neq: invert(variadicComparator(eq)),
    sneq: invert(variadicComparator(seq)),
    not: not,
    gt: variadicComparator(gt),
    lt: variadicComparator(lt),
    gte: variadicComparator(gte),
    lte: variadicComparator(lte),
    bitwiseAnd: variadicMath(bitwiseAnd),
    bitwiseOr: variadicMath(bitwiseOr),
    bitwiseXor: variadicMath(bitwiseXor),
    bitwiseNot: bitwiseNot,
    bitwiseLeft: variadicMath(bitwiseLeft),
    bitwiseRight: variadicMath(bitwiseRight),
    bitwiseZ: variadicMath(bitwiseZ)
  });
})(this);

},{"underscore":4}],17:[function(require,module,exports){
// Underscore-contrib (underscore.util.strings.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  // Mixing in the string utils
  // ----------------------------

  _.mixin({
    // Explodes a string into an array of chars
    explode: function(s) {
      return s.split('');
    },

    // Implodes and array of chars into a string
    implode: function(a) {
      return a.join('');
    },

    // Converts a string to camel case
    camelCase : function( string ){
      return  string.replace(/-([a-z])/g, function (g) { return g[1].toUpperCase(); });
    },

    // Converts camel case to dashed (opposite of _.camelCase)
    toDash : function( string ){
      string = string.replace(/([A-Z])/g, function($1){return "-"+$1.toLowerCase();});
      // remove first dash
      return  ( string.charAt( 0 ) == '-' ) ? string.substr(1) : string;
    },

    // Reports whether a string contains a search string.
    strContains: function(str, search) {
      if (typeof str != 'string') throw new TypeError;
      return (str.indexOf(search) != -1);
    }

  });
})(this);

},{"underscore":4}],18:[function(require,module,exports){
// Underscore-contrib (underscore.util.trampolines.js 0.0.1)
// (c) 2013 Michael Fogus, DocumentCloud and Investigative Reporters & Editors
// Underscore-contrib may be freely distributed under the MIT license.

(function(root) {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `global` on the server.
  var _ = root._ || require('underscore');

  // Helpers
  // -------

  
  // Mixing in the truthiness
  // ------------------------

  _.mixin({
    done: function(value) {
      var ret = _(value);
      ret.stopTrampoline = true;
      return ret;
    },

    trampoline: function(fun /*, args */) {
      var result = fun.apply(fun, _.rest(arguments));

      while (_.isFunction(result)) {
        result = result();
        if ((result instanceof _) && (result.stopTrampoline)) break;
      }

      return result.value();
    }
  });

})(this);

},{"underscore":4}],19:[function(require,module,exports){
var global=typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {};!function(t){if("object"==typeof exports)module.exports=t();else if("function"==typeof define&&define.amd)define(t);else{var e;"undefined"!=typeof window?e=window:"undefined"!=typeof global?e=global:"undefined"!=typeof self&&(e=self),e.questor=t()}}(function(){var t;return function e(t,r,i){function n(s,a){if(!r[s]){if(!t[s]){var c="function"==typeof require&&require;if(!a&&c)return c(s,!0);if(o)return o(s,!0);throw new Error("Cannot find module '"+s+"'")}var u=r[s]={exports:{}};t[s][0].call(u.exports,function(e){var r=t[s][1][e];return n(r?r:e)},u,u.exports,e,t,r,i)}return r[s].exports}for(var o="function"==typeof require&&require,s=0;s<i.length;s++)n(i[s]);return n}({1:[function(e,r,i){var n=e("__browserify_process"),o="undefined"!=typeof self?self:"undefined"!=typeof window?window:{};!function(e){"object"==typeof i?r.exports=e():"function"==typeof t&&t.amd?t(e):"undefined"!=typeof window?window.Promise=e():"undefined"!=typeof o?o.Promise=e():"undefined"!=typeof self&&(self.Promise=e())}(function(){return function t(r,i,n){function o(a,c){if(!i[a]){if(!r[a]){var u="function"==typeof e&&e;if(!c&&u)return u(a,!0);if(s)return s(a,!0);throw new Error("Cannot find module '"+a+"'")}var l=i[a]={exports:{}};r[a][0].call(l.exports,function(t){var e=r[a][1][t];return o(e?e:t)},l,l.exports,t,r,i,n)}return i[a].exports}for(var s="function"==typeof e&&e,a=0;a<n.length;a++)o(n[a]);return o}({1:[function(t,e){"use strict";e.exports=function(){var t=function(){function t(t){this.constructor$(t),this.message=t,this.name="AssertionError"}return t.prototype=new Error,t.prototype.constructor=t,t.prototype.constructor$=Error,t}();return function e(r,i){if(r!==!0){var n=new t(i);throw Error.captureStackTrace&&Error.captureStackTrace(n,e),console&&console.error&&console.error(n.stack+""),n}}}()},{}],2:[function(t,e){"use strict";function r(){this._isTickUsed=!1,this._length=0,this._lateBuffer=new n,this._functionBuffer=new n(75e3);var t=this;this.consumeFunctionBuffer=function(){t._consumeFunctionBuffer()}}var i=(t("./assert.js"),t("./schedule.js")),n=t("./queue.js"),o=t("./util.js").errorObj,s=t("./util.js").tryCatch1;r.prototype.haveItemsQueued=function(){return this._length>0},r.prototype.invokeLater=function(t,e,r){this._lateBuffer.push(t,e,r),this._queueTick()},r.prototype.invoke=function(t,e,r){var i=this._functionBuffer;i.push(t,e,r),this._length=i.length(),this._queueTick()},r.prototype._consumeFunctionBuffer=function(){for(var t=this._functionBuffer;t.length()>0;){var e=t.shift(),r=t.shift(),i=t.shift();e.call(r,i)}this._reset(),this._consumeLateBuffer()},r.prototype._consumeLateBuffer=function(){for(var t=this._lateBuffer;t.length()>0;){var e=t.shift(),r=t.shift(),i=t.shift(),n=s(e,r,i);if(n===o)throw this._queueTick(),n.e}},r.prototype._queueTick=function(){this._isTickUsed||(i(this.consumeFunctionBuffer),this._isTickUsed=!0)},r.prototype._reset=function(){this._isTickUsed=!1,this._length=0},e.exports=new r},{"./assert.js":1,"./queue.js":16,"./schedule.js":17,"./util.js":19}],3:[function(t,e){"use strict";var r=t("./promise.js")();e.exports=r},{"./promise.js":12}],4:[function(t,e){"use strict";e.exports=function(){function e(t){var e;if("function"==typeof t)e="[function "+(t.name||"anonymous")+"]";else{e=t.toString();var i=/\[object [a-zA-Z0-9$_]+\]/;if(i.test(e))try{var n=JSON.stringify(t);e=n}catch(o){}0===e.length&&(e="(empty array)")}return"(<"+r(e)+">, no stack trace)"}function r(t){var e=41;return t.length<e?t:t.substr(0,e-3)+"..."}function i(t,e){this.captureStackTrace(t,e)}var n=(t("./assert.js"),t("./util.js").inherits),o=t("./es5.js").defineProperty,s=new RegExp("\\b(?:[\\w.]*Promise(?:Array|Spawn)?\\$_\\w+|tryCatch(?:1|2|Apply)|new \\w*PromiseArray|\\w*PromiseArray\\.\\w*PromiseArray|setTimeout|CatchFilter\\$_\\w+|makeNodePromisified|processImmediate|process._tickCallback|nextTick|Async\\$\\w+)\\b"),a=null,c=null,u=!1;n(i,Error),i.prototype.captureStackTrace=function(t,e){l(this,t,e)},i.possiblyUnhandledRejection=function(t){if("object"==typeof console){var e;if("object"==typeof t||"function"==typeof t){var r=t.stack;e="Possibly unhandled "+c(r,t)}else e="Possibly unhandled "+String(t);"function"==typeof console.error||"object"==typeof console.error?console.error(e):("function"==typeof console.log||"object"==typeof console.error)&&console.log(e)}},u="CapturedTrace$captureStackTrace"!==i.prototype.captureStackTrace.name,i.combine=function(t,e){for(var r=t.length-1,i=e.length-1;i>=0;--i){var n=e[i];if(t[r]!==n)break;t.pop(),r--}t.push("From previous event:");for(var o=t.concat(e),c=[],i=0,u=o.length;u>i;++i)s.test(o[i])||i>0&&!a.test(o[i])&&"From previous event:"!==o[i]||c.push(o[i]);return c},i.isSupported=function(){return"function"==typeof l};var l=function f(){if("number"==typeof Error.stackTraceLimit&&"function"==typeof Error.captureStackTrace){a=/^\s*at\s*/,c=function(t,r){return"string"==typeof t?t:void 0!==r.name&&void 0!==r.message?r.name+". "+r.message:e(r)};var t=Error.captureStackTrace;return function(e,r){t(e,r)}}var r=new Error;if(!u&&"string"==typeof r.stack&&"function"==typeof"".startsWith&&r.stack.startsWith("stackDetection@")&&"stackDetection"===f.name){o(Error,"stackTraceLimit",{writable:!0,enumerable:!1,configurable:!1,value:25}),a=/@/;var i=/[@\n]/;return c=function(t,r){return"string"==typeof t?r.name+". "+r.message+"\n"+t:void 0!==r.name&&void 0!==r.message?r.name+". "+r.message:e(r)},function(t,e){var r,n=e.name,o=(new Error).stack,s=o.split(i),a=s.length;for(r=0;a>r&&s[r]!==n;r+=2);s=s.slice(r+2),a=s.length-2;var c="";for(r=0;a>r;r+=2)c+=s[r],c+="@",c+=s[r+1],c+="\n";t.stack=c}}return c=function(t,r){return"string"==typeof t?t:"object"!=typeof r&&"function"!=typeof r||void 0===r.name||void 0===r.message?e(r):r.name+". "+r.message},null}();return i}},{"./assert.js":1,"./es5.js":9,"./util.js":19}],5:[function(t,e){"use strict";e.exports=function(e){function r(t,e,r){this._instances=t,this._callback=e,this._promise=r}function i(t,e){var r={},i=o(t,r,e);if(i===s)return i;var n=a(r);return n.length?(s.e=new TypeError("Catch filter must inherit from Error or be a simple predicate function"),s):i}var n=t("./util.js"),o=n.tryCatch1,s=n.errorObj,a=t("./es5.js").keys;return r.prototype.doFilter=function(t){for(var r=this._callback,n=this._promise,a=n._isBound()?n._boundTo:void 0,c=0,u=this._instances.length;u>c;++c){var l=this._instances[c],f=l===Error||null!=l&&l.prototype instanceof Error;if(f&&t instanceof l){var p=o(r,a,t);return p===s?(e.e=p.e,e):p}if("function"==typeof l&&!f){var h=i(l,t);if(h===s){this._promise._attachExtraTrace(s.e),t=s.e;break}if(h){var p=o(r,a,t);return p===s?(e.e=p.e,e):p}}}return e.e=t,e},r}},{"./es5.js":9,"./util.js":19}],6:[function(t,e){"use strict";var r=t("./util.js"),i=(t("./assert.js"),r.isPrimitive),n=r.wrapsPrimitiveReceiver;e.exports=function(t){var e=function(){return this},r=function(){throw this},o=function(t,e){return 1===e?function(){throw t}:2===e?function(){return t}:void 0};t.prototype["return"]=t.prototype.thenReturn=function(t){return n&&i(t)?this._then(o(t,2),void 0,void 0,void 0,void 0,this.thenReturn):this._then(e,void 0,void 0,t,void 0,this.thenReturn)},t.prototype["throw"]=t.prototype.thenThrow=function(t){return n&&i(t)?this._then(o(t,1),void 0,void 0,void 0,void 0,this.thenThrow):this._then(r,void 0,void 0,t,void 0,this.thenThrow)}}},{"./assert.js":1,"./util.js":19}],7:[function(t,e){"use strict";function r(t){return(1&t)>0}function i(t){return(2&t)>0}function n(t){return 1|t}function o(t){return 2|t}function s(t){return-3&t}function a(t){var e;return g(t)&&void 0!==(e=t.__promiseHandled__)&&(t.__promiseHandled__=s(e)),t}function c(t){try{j(t,"__rejectionError__",d)}catch(e){}}function u(t){return null==t?!1:t instanceof d||t.__rejectionError__===d}function l(t){try{return j(t,"__promiseHandled__",0),!0}catch(e){return!1}}function f(t){return t instanceof b}function p(t){if(f(t)){var e=t.__promiseHandled__;return void 0===e?l(t):!r(e)}return!1}function h(t,e){function r(r){this.message="string"==typeof r?r:e,this.name=t,b.captureStackTrace&&b.captureStackTrace(this,this.constructor)}return m(r,b),r}function d(t){this.name="RejectionError",this.message=t,this.cause=t,t instanceof b?(this.message=t.message,this.stack=t.stack):b.captureStackTrace&&b.captureStackTrace(this,this.constructor)}var _=t("./global.js"),v=t("./es5.js").freeze,y=t("./util.js"),m=y.inherits,g=y.isObject,j=y.notEnumerableProp,b=_.Error,w=_.TypeError;"function"!=typeof w&&(w=h("TypeError","type error"));var k=_.RangeError;"function"!=typeof k&&(k=h("RangeError","range error"));var E=h("CancellationError","cancellation error"),P=h("TimeoutError","timeout error");m(d,b);var T="__BluebirdErrorTypes__",F=_[T];F||(F=v({CancellationError:E,TimeoutError:P,RejectionError:d}),j(_,T,F)),e.exports={Error:b,TypeError:w,RangeError:k,CancellationError:F.CancellationError,RejectionError:F.RejectionError,TimeoutError:F.TimeoutError,originatesFromRejection:u,markAsOriginatingFromRejection:c,attachDefaultState:l,ensureNotHandled:a,withHandledUnmarked:s,withHandledMarked:o,withStackAttached:n,isStackAttached:r,isHandled:i,canAttach:p}},{"./es5.js":9,"./global.js":11,"./util.js":19}],8:[function(t,e){"use strict";e.exports=function(e){function r(t){var r=new i(t),n=e.rejected(r),o=n._peekContext();return null!=o&&o._attachExtraTrace(r),n}var i=t("./errors.js").TypeError;return r}},{"./errors.js":7}],9:[function(t,e){function r(t){var e=[];for(var r in t)c.call(t,r)&&e.push(r);return e}function i(t,e,r){return t[e]=r.value,t}function n(t){return t}function o(t){try{return Object(t).constructor.prototype}catch(e){return l}}function s(t){try{return"[object Array]"===u.call(t)}catch(e){return!1}}var a=function(){"use strict";return void 0===this}();if(a)e.exports={freeze:Object.freeze,defineProperty:Object.defineProperty,keys:Object.keys,getPrototypeOf:Object.getPrototypeOf,isArray:Array.isArray,isES5:a};else{var c={}.hasOwnProperty,u={}.toString,l={}.constructor.prototype;e.exports={isArray:s,keys:r,defineProperty:i,freeze:n,getPrototypeOf:o,isES5:a}}},{}],10:[function(t,e){e.exports=function(e,r){function i(){return this}function n(){throw l(this),this}function o(t){return function(){return t}}function s(t){return function(){throw l(t),t}}function a(t,e,r){var c=f&&p(e);return r?t._then(c?i:o(e),h,void 0,e,void 0,a):t._then(c?n:s(e),h,void 0,e,void 0,a)}function c(t){var i=this.promise,n=this.handler,o=i._isBound()?n.call(i._boundTo):n();if(void 0!==o){var s=e._cast(o,c,void 0);if(e.is(s))return a(s,t,i.isFulfilled())}return i.isRejected()?(l(t),r.e=t,r):t}var u=t("./util.js"),l=t("./errors.js").ensureNotHandled,f=u.wrapsPrimitiveReceiver,p=u.isPrimitive,h=u.thrower;e.prototype.lastly=e.prototype["finally"]=function(t){if("function"!=typeof t)return this.then();var e={promise:this,handler:t};return this._then(c,c,void 0,e,void 0,this.lastly)}}},{"./errors.js":7,"./util.js":19}],11:[function(t,e){"use strict";e.exports=function(){return"undefined"!=typeof this?this:"undefined"!=typeof n&&"undefined"!=typeof o&&"string"==typeof n.execPath?o:"undefined"!=typeof window&&"undefined"!=typeof document&&"undefined"!=typeof navigator&&null!==navigator&&"string"==typeof navigator.appName?void 0!==window.wrappedJSObject?window.wrappedJSObject:window:void 0}()},{}],12:[function(t,e){"use strict";e.exports=function(){function e(t){return void 0===t?!1:t instanceof i}function r(t,e){return t instanceof d?e>=0:!1}function i(t){if("function"!=typeof t)throw new F("the promise constructor requires a resolver function");if(this.constructor!==i)throw new F("the promise constructor cannot be invoked directly");this._bitField=0,this._fulfillmentHandler0=void 0,this._rejectionHandler0=void 0,this._promise0=void 0,this._receiver0=void 0,this._settledValue=void 0,this._boundTo=void 0,t!==f&&this._resolveFromResolver(t)}function o(t,e,r){return s(t,d,r,e===!0&&t._isBound()?t._boundTo:void 0).promise()}function s(t,r,n,o){var a=null;return m(t)?a=t:(a=i._cast(t,n,void 0),a!==t?a._setBoundTo(o):e(a)||(a=null)),null!==a?new r(a,"function"==typeof n?n:s,o):{promise:function(){return M("expecting an array, a promise or a thenable")}}}var a=t("./global.js"),c=(t("./assert.js"),t("./util.js")),u=t("./async.js"),l=t("./errors.js"),f=function(){},p={},h={e:null},d=t("./promise_array.js")(i,f),_=t("./captured_trace.js")(),v=t("./catch_filter.js")(h),y=t("./promise_resolver.js"),m=c.isArray,g=c.notEnumerableProp,j=c.isObject,b=c.ensurePropertyExpansion,w=c.errorObj,k=c.tryCatch1,E=c.tryCatch2,P=c.tryCatchApply,T=l.RangeError,F=l.TypeError,x=l.CancellationError,R=l.TimeoutError,A=l.RejectionError,C=l.originatesFromRejection,H=l.markAsOriginatingFromRejection,O=l.ensureNotHandled,S=l.withHandledMarked,V=l.withStackAttached,B=l.isStackAttached,L=l.isHandled,U=l.canAttach,q=c.thrower,M=t("./errors_api_rejection")(i),N=function(){return new F("circular promise resolution chain")};i.prototype.bind=function(t){var e=new i(f);return D&&e._setTrace(this.bind,this),e._follow(this),e._setBoundTo(t),this._cancellable()&&(e._setCancellable(),e._cancellationParent=this),e},i.prototype.toString=function(){return"[object Promise]"},i.prototype.caught=i.prototype["catch"]=function(t){var e=arguments.length;if(e>1){var r,i=new Array(e-1),n=0;for(r=0;e-1>r;++r){var o=arguments[r];if("function"!=typeof o){var s=new F("A catch filter must be an error constructor or a filter function");return this._attachExtraTrace(s),void u.invoke(this._reject,this,s)}i[n++]=o}i.length=n,t=arguments[r],this._resetTrace(this.caught);var a=new v(i,t,this);return this._then(void 0,a.doFilter,void 0,a,void 0,this.caught)}return this._then(void 0,t,void 0,void 0,void 0,this.caught)},i.prototype.then=function(t,e,r){return this._then(t,e,r,void 0,void 0,this.then)},i.prototype.done=function(t,e,r){var i=this._then(t,e,r,void 0,void 0,this.done);i._setIsFinal()},i.prototype.spread=function(t,e){return this._then(t,e,void 0,p,void 0,this.spread)},i.prototype.isFulfilled=function(){return(268435456&this._bitField)>0},i.prototype.isRejected=function(){return(134217728&this._bitField)>0},i.prototype.isPending=function(){return!this.isResolved()},i.prototype.isResolved=function(){return(402653184&this._bitField)>0},i.prototype.isCancellable=function(){return!this.isResolved()&&this._cancellable()},i.prototype.toJSON=function(){var t={isFulfilled:!1,isRejected:!1,fulfillmentValue:void 0,rejectionReason:void 0};return this.isFulfilled()?(t.fulfillmentValue=this._settledValue,t.isFulfilled=!0):this.isRejected()&&(t.rejectionReason=this._settledValue,t.isRejected=!0),t},i.prototype.all=function(){return o(this,!0,this.all)},i.is=e,i.all=function(t){return o(t,!1,i.all)},i.join=function(){for(var t=arguments.length,e=new Array(t),r=0;t>r;++r)e[r]=arguments[r];return s(e,d,i.join,void 0).promise()},i.resolve=i.fulfilled=function(t,e){var r=new i(f);return D&&r._setTrace("function"==typeof e?e:i.resolve,void 0),r._tryFollow(t)?r:(r._cleanValues(),r._setFulfilled(),r._settledValue=t,r)},i.reject=i.rejected=function(t){var e=new i(f);return D&&e._setTrace(i.reject,void 0),H(t),e._cleanValues(),e._setRejected(),e._settledValue=t,e},i.prototype.error=function(t){return this.caught(C,t)},i.prototype._resolveFromSyncValue=function(t,e){if(t===w)this._cleanValues(),this._setRejected(),this._settledValue=t.e;else{var r=i._cast(t,e,void 0);r instanceof i?this._follow(r):(this._cleanValues(),this._setFulfilled(),this._settledValue=t)}},i.method=function(t){if("function"!=typeof t)throw new F("fn must be a function");return function e(){var r;switch(arguments.length){case 0:r=k(t,this,void 0);break;case 1:r=k(t,this,arguments[0]);break;case 2:r=E(t,this,arguments[0],arguments[1]);break;default:for(var n=arguments.length,o=new Array(n),s=0;n>s;++s)o[s]=arguments[s];r=P(t,o,this)}var a=new i(f);return D&&a._setTrace(e,void 0),a._resolveFromSyncValue(r,e),a}},i["try"]=i.attempt=function(t,e,r){if("function"!=typeof t)return M("fn must be a function");var n=m(e)?P(t,e,r):k(t,r,e),o=new i(f);return D&&o._setTrace(i.attempt,void 0),o._resolveFromSyncValue(n,i.attempt),o},i.defer=i.pending=function(t){var e=new i(f);return D&&e._setTrace("function"==typeof t?t:i.defer,void 0),new y(e)},i.bind=function(t){var e=new i(f);return D&&e._setTrace(i.bind,void 0),e._setFulfilled(),e._setBoundTo(t),e},i.cast=function(t,e){"function"!=typeof e&&(e=i.cast);var r=i._cast(t,e,void 0);return r instanceof i?r:i.resolve(r,e)},i.onPossiblyUnhandledRejection=function(t){_.possiblyUnhandledRejection="function"==typeof t?t:void 0};var D=!1||!("undefined"==typeof n||"string"!=typeof n.execPath||"object"!=typeof n.env||!n.env.BLUEBIRD_DEBUG&&"development"!==n.env.NODE_ENV);i.longStackTraces=function(){if(u.haveItemsQueued()&&D===!1)throw new Error("cannot enable long stack traces after promises have been created");D=_.isSupported()},i.hasLongStackTraces=function(){return D&&_.isSupported()},i.prototype._setProxyHandlers=function(t,e){var r=this._length();if(r>=4194298&&(r=0,this._setLength(0)),0===r)this._promise0=e,this._receiver0=t;else{var i=r-5;this[i+3]=e,this[i+4]=t,this[i+0]=this[i+1]=this[i+2]=void 0}this._setLength(r+5)},i.prototype._proxyPromiseArray=function(t,e){this._setProxyHandlers(t,e)},i.prototype._proxyPromise=function(t){t._setProxied(),this._setProxyHandlers(t,-1)},i.prototype._then=function(t,e,r,n,o,s){var a=void 0!==o,c=a?o:new i(f);if(D&&!a){var l=this._peekContext()===this._traceParent;c._traceParent=l?this._traceParent:this,c._setTrace("function"==typeof s?s:this._then,this)}!a&&this._isBound()&&c._setBoundTo(this._boundTo);var p=this._addCallbacks(t,e,r,c,n);return!a&&this._cancellable()&&(c._setCancellable(),c._cancellationParent=this),this.isResolved()&&u.invoke(this._queueSettleAt,this,p),c},i.prototype._length=function(){return 4194303&this._bitField},i.prototype._isFollowingOrFulfilledOrRejected=function(){return(939524096&this._bitField)>0},i.prototype._isFollowing=function(){return 536870912===(536870912&this._bitField)},i.prototype._setLength=function(t){this._bitField=-4194304&this._bitField|4194303&t},i.prototype._cancellable=function(){return(67108864&this._bitField)>0},i.prototype._setFulfilled=function(){this._bitField=268435456|this._bitField},i.prototype._setRejected=function(){this._bitField=134217728|this._bitField},i.prototype._setFollowing=function(){this._bitField=536870912|this._bitField},i.prototype._setIsFinal=function(){this._bitField=33554432|this._bitField},i.prototype._isFinal=function(){return(33554432&this._bitField)>0},i.prototype._setCancellable=function(){this._bitField=67108864|this._bitField},i.prototype._unsetCancellable=function(){this._bitField=-67108865&this._bitField},i.prototype._receiverAt=function(t){var e;return e=0===t?this._receiver0:this[t+4-5],this._isBound()&&void 0===e?this._boundTo:e},i.prototype._promiseAt=function(t){return 0===t?this._promise0:this[t+3-5]},i.prototype._fulfillmentHandlerAt=function(t){return 0===t?this._fulfillmentHandler0:this[t+0-5]},i.prototype._rejectionHandlerAt=function(t){return 0===t?this._rejectionHandler0:this[t+1-5]},i.prototype._unsetAt=function(t){0===t?this._fulfillmentHandler0=this._rejectionHandler0=this._progressHandler0=this._promise0=this._receiver0=void 0:this[t-5+0]=this[t-5+1]=this[t-5+2]=this[t-5+3]=this[t-5+4]=void 0},i.prototype._resolveFromResolver=function(t){function e(t){i._tryFollow(t)||i._fulfill(t)}function r(t){i._attachExtraTrace(t),H(t),i._reject(t)}var i=this,n=D;n&&(this._setTrace(this._resolveFromResolver,void 0),this._pushContext());var o=E(t,void 0,e,r);n&&this._popContext(),void 0!==o&&o===w&&i._reject(o.e)},i.prototype._addCallbacks=function(t,e,r,i,n){var o=this._length();if(o>=4194298&&(o=0,this._setLength(0)),0===o)this._promise0=i,void 0!==n&&(this._receiver0=n),"function"==typeof t&&(this._fulfillmentHandler0=t),"function"==typeof e&&(this._rejectionHandler0=e),"function"==typeof r&&(this._progressHandler0=r);else{var s=o-5;this[s+3]=i,this[s+4]=n,this[s+0]="function"==typeof t?t:void 0,this[s+1]="function"==typeof e?e:void 0,this[s+2]="function"==typeof r?r:void 0}return this._setLength(o+5),o},i.prototype._setBoundTo=function(t){void 0!==t?(this._bitField=8388608|this._bitField,this._boundTo=t):this._bitField=-8388609&this._bitField},i.prototype._isBound=function(){return 8388608===(8388608&this._bitField)},i.prototype._spreadSlowCase=function(t,e,r,i){var n=s(r,d,this._spreadSlowCase,i).promise()._then(function(){return t.apply(i,arguments)},void 0,void 0,p,void 0,this._spreadSlowCase);e._follow(n)},i.prototype._markHandled=function(t){if("object"==typeof t&&null!==t){var e=t.__promiseHandled__;void 0===e?g(t,"__promiseHandled__",2):t.__promiseHandled__=S(e)}},i.prototype._callSpread=function(t,r,n,o){var s=this._isBound()?this._boundTo:void 0;if(m(n))for(var a=this._settlePromiseFromHandler,c=0,u=n.length;u>c;++c)if(e(i._cast(n[c],a,void 0)))return void this._spreadSlowCase(t,r,n,s);return o&&r._pushContext(),P(t,n,s)},i.prototype._callHandler=function(t,e,r,i,n){var o;return e!==p||this.isRejected()?(n&&r._pushContext(),o=k(t,e,i)):o=this._callSpread(t,r,i,n),n&&r._popContext(),o},i.prototype._settlePromiseFromHandler=function(t,r,n,o){if(!e(o))return void t.call(r,n,o);this.isRejected()&&this._markHandled(n);var s=D,a=this._callHandler(t,r,o,n,s);if(!o._isFollowing())if(a===w||a===o||a===h){var c=a===o?N():O(a.e);a!==h&&o._attachExtraTrace(c),o._rejectUnchecked(c)}else{var u=i._cast(a,s?this._settlePromiseFromHandler:void 0,o);e(u)?(o._follow(u),u._cancellable()&&(o._cancellationParent=u,o._setCancellable())):o._fulfillUnchecked(a)}},i.prototype._follow=function(t){this._setFollowing(),t.isPending()?(t._cancellable()&&(this._cancellationParent=t,this._setCancellable()),t._proxyPromise(this)):t.isFulfilled()?this._fulfillUnchecked(t._settledValue):this._rejectUnchecked(t._settledValue),D&&null==t._traceParent&&(t._traceParent=this)},i.prototype._tryFollow=function(t){if(this._isFollowingOrFulfilledOrRejected()||t===this)return!1;var r=i._cast(t,this._tryFollow,void 0);return e(r)?(this._follow(r),!0):!1},i.prototype._resetTrace=function(t){if(D){var e=this._peekContext(),r=void 0===e;this._trace=new _("function"==typeof t?t:this._resetTrace,r)}},i.prototype._setTrace=function(t,e){if(D){var r=this._peekContext();this._traceParent=r;var i=void 0===r;this._trace=void 0!==e&&e._traceParent===r?e._trace:new _("function"==typeof t?t:this._setTrace,i)}return this},i.prototype._attachExtraTrace=function(t){if(D&&U(t)){var e=this,r=t.stack;r="string"==typeof r?r.split("\n"):[];for(var i=1;null!=e&&null!=e._trace;)r=_.combine(r,e._trace.stack.split("\n")),e=e._traceParent;var n=Error.stackTraceLimit+i,o=r.length;o>n&&(r.length=n),t.stack=r.length<=i?"(No stack trace)":r.join("\n"),t.__promiseHandled__=V(t.__promiseHandled__)}},i.prototype._notifyUnhandledRejection=function(t){L(t.__promiseHandled__)||(t.__promiseHandled__=S(t.__promiseHandled__),_.possiblyUnhandledRejection(t,this))},i.prototype._unhandledRejection=function(t){L(t.__promiseHandled__)||u.invokeLater(this._notifyUnhandledRejection,this,t)},i.prototype._cleanValues=function(){this._cancellable()&&(this._cancellationParent=void 0)},i.prototype._fulfill=function(t){this._isFollowingOrFulfilledOrRejected()||this._fulfillUnchecked(t)},i.prototype._reject=function(t){this._isFollowingOrFulfilledOrRejected()||this._rejectUnchecked(t)},i.prototype._settlePromiseAt=function(t){var e=this.isFulfilled()?this._fulfillmentHandlerAt(t):this._rejectionHandlerAt(t),n=this._settledValue,o=this._receiverAt(t),s=this._promiseAt(t);if("function"==typeof e)this._settlePromiseFromHandler(e,o,n,s);else{var a=!1,c=this.isFulfilled();void 0!==o&&(o instanceof i&&o._isProxied()?(o._unsetProxied(),c?o._fulfillUnchecked(n):o._rejectUnchecked(n),a=!0):r(o,s)&&(c?o._promiseFulfilled(n,s):o._promiseRejected(n,s),a=!0)),a||(c?s._fulfill(n):s._reject(n))}t>=256&&this._queueGC()},i.prototype._isProxied=function(){return 4194304===(4194304&this._bitField)},i.prototype._setProxied=function(){this._bitField=4194304|this._bitField},i.prototype._unsetProxied=function(){this._bitField=-4194305&this._bitField},i.prototype._isGcQueued=function(){return-1073741824===(-1073741824&this._bitField)},i.prototype._setGcQueued=function(){this._bitField=-1073741824|this._bitField},i.prototype._unsetGcQueued=function(){this._bitField=1073741823&this._bitField},i.prototype._queueGC=function(){this._isGcQueued()||(this._setGcQueued(),u.invokeLater(this._gc,this,void 0))},i.prototype._gc=function(){var t=this._length();this._unsetAt(0);for(var e=0;t>e;e++)delete this[e];this._setLength(0),this._unsetGcQueued()},i.prototype._queueSettleAt=function(t){u.invoke(this._settlePromiseAt,this,t)},i.prototype._fulfillUnchecked=function(t){if(this.isPending()){if(t===this){var e=N();return this._attachExtraTrace(e),this._rejectUnchecked(e)}this._cleanValues(),this._setFulfilled(),this._settledValue=t;var r=this._length();r>0&&u.invoke(this._fulfillPromises,this,r)}},i.prototype._fulfillPromises=function(t){t=this._length();for(var e=0;t>e;e+=5)this._settlePromiseAt(e)},i.prototype._rejectUnchecked=function(t){if(this.isPending()){if(t===this){var e=N();return this._attachExtraTrace(e),this._rejectUnchecked(e)}if(this._cleanValues(),this._setRejected(),this._settledValue=t,this._isFinal())return void u.invokeLater(q,void 0,t);var r=this._length();r>0?u.invoke(this._rejectPromises,this,r):this._ensurePossibleRejectionHandled(t)}},i.prototype._rejectPromises=function(t){t=this._length();for(var i=!1,n=0;t>n;n+=5){var o=this._rejectionHandlerAt(n);if(!i)if("function"==typeof o)i=!0;else{var s=this._promiseAt(n);if(e(s)&&s._length()>0)i=!0;else{var a=this._receiverAt(n);(e(a)&&a._length()>0||r(a,s))&&(i=!0)}}this._settlePromiseAt(n)}i||this._ensurePossibleRejectionHandled(this._settledValue)},i.prototype._ensurePossibleRejectionHandled=function(t){if(void 0!==_.possiblyUnhandledRejection&&j(t)){var e=t.__promiseHandled__,r=t;if(void 0===e)r=b(t,"__promiseHandled__",0),e=0;else if(L(e))return;B(e)||this._attachExtraTrace(r),u.invoke(this._unhandledRejection,this,r)}};var G=[];i.prototype._peekContext=function(){var t=G.length-1;return t>=0?G[t]:void 0},i.prototype._pushContext=function(){D&&G.push(this)},i.prototype._popContext=function(){D&&G.pop()};var I=a.Promise;return i.noConflict=function(){return a.Promise===i&&(a.Promise=I),i},_.isSupported()||(i.longStackTraces=function(){},D=!1),i._makeSelfResolutionError=N,t("./finally.js")(i,h),t("./direct_resolve.js")(i),t("./thenables.js")(i),i.RangeError=T,i.CancellationError=x,i.TimeoutError=R,i.TypeError=F,i.RejectionError=A,t("./promisify.js")(i,f),i.prototype=i.prototype,i}},{"./assert.js":1,"./async.js":2,"./captured_trace.js":4,"./catch_filter.js":5,"./direct_resolve.js":6,"./errors.js":7,"./errors_api_rejection":8,"./finally.js":10,"./global.js":11,"./promise_array.js":13,"./promise_resolver.js":14,"./promisify.js":15,"./thenables.js":18,"./util.js":19}],13:[function(t,e){"use strict";e.exports=function(e,r){function i(t){switch(t){case-1:return void 0;case-2:return[];case-3:return{}}}function n(t,i,n){var o=this._promise=new e(r),s=void 0;e.is(t)&&(s=t,t._cancellable()&&(o._setCancellable(),o._cancellationParent=t),t._isBound()&&o._setBoundTo(n)),o._setTrace(i,s),this._values=t,this._length=0,this._totalResolved=0,this._init(void 0,-2)}var o=(t("./assert.js"),t("./errors.js").ensureNotHandled),s=t("./util.js"),a=t("./async.js"),c={}.hasOwnProperty,u=s.isArray;return n.PropertiesPromiseArray=function(){},n.prototype.length=function(){return this._length},n.prototype.promise=function(){return this._promise},n.prototype._init=function(t,r){var o=this._values;if(e.is(o)){if(!o.isFulfilled())return o.isPending()?void o._then(this._init,this._reject,void 0,this,r,this.constructor):void this._reject(o._settledValue);if(o=o._settledValue,!u(o)){var s=new e.TypeError("expecting an array, a promise or a thenable");return void this.__hardReject__(s)}this._values=o}if(0===o.length)return void this._resolve(i(r));var l,f=o.length,p=f;l=this instanceof n.PropertiesPromiseArray?this._values:new Array(f);for(var h=!1,d=0;f>d;++d){var _=o[d];if(void 0!==_||c.call(o,d)){var v=e._cast(_,void 0,void 0);v instanceof e&&v.isPending()?v._proxyPromiseArray(this,d):h=!0,l[d]=v}else p--}if(0===p)return void this._resolve(-2===r?l:i(r));if(this._values=l,this._length=p,h){var y=p===f?this._scanDirectValues:this._scanDirectValuesHoled;a.invoke(y,this,f)}},n.prototype._settlePromiseAt=function(t){var r=this._values[t];e.is(r)?r.isFulfilled()?this._promiseFulfilled(r._settledValue,t):r.isRejected()&&this._promiseRejected(r._settledValue,t):this._promiseFulfilled(r,t)},n.prototype._scanDirectValuesHoled=function(t){for(var e=0;t>e&&!this._isResolved();++e)c.call(this._values,e)&&this._settlePromiseAt(e)},n.prototype._scanDirectValues=function(t){for(var e=0;t>e&&!this._isResolved();++e)this._settlePromiseAt(e)},n.prototype._isResolved=function(){return null===this._values},n.prototype._resolve=function(t){this._values=null,this._promise._fulfill(t)},n.prototype.__hardReject__=n.prototype._reject=function(t){o(t),this._values=null,this._promise._attachExtraTrace(t),this._promise._reject(t)},n.prototype._promiseProgressed=function(t,e){this._isResolved()||this._promise._progress({index:e,value:t})},n.prototype._promiseFulfilled=function(t,e){if(!this._isResolved()){this._values[e]=t;var r=++this._totalResolved;r>=this._length&&this._resolve(this._values)}},n.prototype._promiseRejected=function(t){this._isResolved()||(this._totalResolved++,this._reject(t))},n}},{"./assert.js":1,"./async.js":2,"./errors.js":7,"./util.js":19}],14:[function(t,e){"use strict";function r(t){return t instanceof Error&&h.getPrototypeOf(t)===Error.prototype}function i(t){var e;return e=r(t)?new l(t):t,c.markAsOriginatingFromRejection(e),e}function n(t){function e(e,r){if(e){var n=i(a(e));t._attachExtraTrace(n),t._reject(n)}else if(arguments.length>2){for(var o=arguments.length,s=new Array(o-1),c=1;o>c;++c)s[c-1]=arguments[c];t._fulfill(s)}else t._fulfill(r)}return e}var o,s=t("./util.js"),a=s.maybeWrapAsError,c=t("./errors.js"),u=c.TimeoutError,l=c.RejectionError,f=t("./async.js"),p=s.haveGetters,h=t("./es5.js");if(o=p?function(t){this.promise=t}:function(t){this.promise=t,this.asCallback=n(t),this.callback=this.asCallback},p){var d={get:function(){return n(this.promise)}};h.defineProperty(o.prototype,"asCallback",d),h.defineProperty(o.prototype,"callback",d)}o._nodebackForPromise=n,o.prototype.toString=function(){return"[object PromiseResolver]"},o.prototype.resolve=o.prototype.fulfill=function(t){var e=this.promise;e._tryFollow(t)||f.invoke(e._fulfill,e,t)},o.prototype.reject=function(t){var e=this.promise;c.markAsOriginatingFromRejection(t),e._attachExtraTrace(t),f.invoke(e._reject,e,t)},o.prototype.progress=function(t){f.invoke(this.promise._progress,this.promise,t)},o.prototype.cancel=function(){f.invoke(this.promise.cancel,this.promise,void 0)},o.prototype.timeout=function(){this.reject(new u("timeout"))},o.prototype.isResolved=function(){return this.promise.isResolved()},o.prototype.toJSON=function(){return this.promise.toJSON()},e.exports=o},{"./async.js":2,"./errors.js":7,"./es5.js":9,"./util.js":19}],15:[function(t,e){"use strict";e.exports=function(e,r){function i(t){return t.__isPromisified__===!0}function n(t,i,n){function o(e){for(var r=new Array(e),n=0,o=r.length;o>n;++n)r[n]="a"+(n+1);var s=e>0?",":"";return"string"==typeof t&&i===c?"this['"+t+"']("+r.join(",")+s+" fn);break;":(void 0===i?"callback("+r.join(",")+s+" fn);":"callback.call("+(i===c?"this":"receiver")+", "+r.join(",")+s+" fn);")+"break;"}function s(){return"var args = new Array(len + 1);var i = 0;for (var i = 0; i < len; ++i) {    args[i] = arguments[i];}args[i] = fn;"}var a="string"==typeof n?n+"Async":"promisified";return new Function("Promise","callback","receiver","withAppended","maybeWrapAsError","nodebackForPromise","INTERNAL","var ret = function "+a+'(a1, a2, a3, a4, a5) {"use strict";var len = arguments.length;var promise = new Promise(INTERNAL);promise._setTrace('+a+", void 0);var fn = nodebackForPromise(promise);try{switch(len) {case 1:"+o(1)+"case 2:"+o(2)+"case 3:"+o(3)+"case 0:"+o(0)+"case 4:"+o(4)+"case 5:"+o(5)+"default: "+s()+("string"==typeof t?"this['"+t+"'].apply(":"callback.apply(")+(i===c?"this":"receiver")+", args); break;}}catch(e){ var wrapped = maybeWrapAsError(e);promise._attachExtraTrace(wrapped);promise._reject(wrapped);}return promise;}; ret.__isPromisified__ = true; return ret;")(e,t,i,p,h,f,r)
}function o(t,i){function n(){var o=i;i===c&&(o=this),"string"==typeof t&&(t=o[t]);var s=new e(r);s._setTrace(n,void 0);var a=f(s);try{t.apply(o,p(arguments,a))}catch(u){var l=h(u);s._attachExtraTrace(l),s._reject(l)}return s}return n.__isPromisified__=!0,n}function s(){}function a(t,e,r){if(r){for(var i=g(t),n=0,o=i.length;o>n;n+=2){var a=i[n],u=i[n+1],l=a+"__beforePromisified__",f=a+"Async";_(t,l,u),t[f]=j(l,c,a)}return i.length>16&&(s.prototype=t),t}return j(t,e,void 0)}var c={},u=t("./util.js"),l=t("./es5.js"),f=t("./promise_resolver.js")._nodebackForPromise,p=u.withAppended,h=u.maybeWrapAsError,d=u.canEvaluate,_=u.notEnumerableProp,v=u.deprecated,y=(t("./assert.js"),new RegExp("__beforePromisified__$")),m={}.hasOwnProperty,g=function(){if(l.isES5){var t=Object.create,e=Object.getOwnPropertyDescriptor;return function(r){for(var n=r,o=[],s=t(null);null!==r;){for(var a=l.keys(r),c=0,u=a.length;u>c;++c){var f=a[c];if(!(s[f]||y.test(f)||m.call(n,f+"__beforePromisified__"))){s[f]=!0;var p=e(r,f);null==p||"function"!=typeof p.value||i(p.value)||o.push(f,p.value)}}r=l.getPrototypeOf(r)}return o}}return function(t){var e=[];for(var r in t)if(!y.test(r)&&!m.call(t,r+"__beforePromisified__")){var n=t[r];"function"!=typeof n||i(n)||e.push(r,n)}return e}}(),j=d?n:o;e.promisify=function(t,e){if("object"==typeof t&&null!==t)return v("Promise.promisify for promisifying entire objects is deprecated. Use Promise.promisifyAll instead."),a(t,e,!0);if("function"!=typeof t)throw new TypeError("fn must be a function");return i(t)?t:a(t,arguments.length<2?c:e,!1)},e.promisifyAll=function(t){if("function"!=typeof t&&"object"!=typeof t)throw new TypeError("the target of promisifyAll must be an object or a function");return a(t,void 0,!0)}}},{"./assert.js":1,"./es5.js":9,"./promise_resolver.js":14,"./util.js":19}],16:[function(t,e){"use strict";function r(t,e,r,i,n){for(var o=0;n>o;++o)r[o+i]=t[o+e]}function i(t){return t>>>=0,t-=1,t|=t>>1,t|=t>>2,t|=t>>4,t|=t>>8,t|=t>>16,t+1}function n(t){return"number"!=typeof t?16:i(Math.min(Math.max(16,t),1073741824))}function o(t){this._capacity=n(t),this._length=0,this._front=0,this._makeCapacity()}t("./assert.js"),o.prototype._willBeOverCapacity=function(t){return this._capacity<t},o.prototype._pushOne=function(t){var e=this.length();this._checkCapacity(e+1);var r=this._front+e&this._capacity-1;this[r]=t,this._length=e+1},o.prototype.push=function(t,e,r){var i=this.length()+3;if(this._willBeOverCapacity(i))return this._pushOne(t),this._pushOne(e),void this._pushOne(r);var n=this._front+i-3;this._checkCapacity(i);var o=this._capacity-1;this[n+0&o]=t,this[n+1&o]=e,this[n+2&o]=r,this._length=i},o.prototype.shift=function(){var t=this._front,e=this[t];return this[t]=void 0,this._front=t+1&this._capacity-1,this._length--,e},o.prototype.length=function(){return this._length},o.prototype._makeCapacity=function(){for(var t=this._capacity,e=0;t>e;++e)this[e]=void 0},o.prototype._checkCapacity=function(t){this._capacity<t&&this._resizeTo(this._capacity<<3)},o.prototype._resizeTo=function(t){var e=this._front,i=this._capacity,n=new Array(i),o=this.length();if(r(this,0,n,0,i),this._capacity=t,this._makeCapacity(),this._front=0,i>=e+o)r(n,e,this,0,o);else{var s=o-(e+o&i-1);r(n,e,this,0,s),r(n,0,this,s,o-s)}},e.exports=o},{"./assert.js":1}],17:[function(t,e){"use strict";var r,i=t("./global.js");if(t("./assert.js"),"undefined"!=typeof n&&null!==n&&"function"==typeof n.cwd&&"function"==typeof n.nextTick)r=n.nextTick;else if("function"!=typeof MutationObserver&&"function"!=typeof WebkitMutationObserver&&"function"!=typeof WebKitMutationObserver||"undefined"==typeof document||"function"!=typeof document.createElement)if("function"==typeof i.postMessage&&"function"!=typeof i.importScripts&&"function"==typeof i.addEventListener&&"function"==typeof i.removeEventListener){var o="bluebird_message_key_"+Math.random();r=function(){function t(t){if(t.source===i&&t.data===o){var r=e;e=void 0,r()}}var e=void 0;return i.addEventListener("message",t,!1),function(t){e=t,i.postMessage(o,"*")}}()}else r="function"==typeof MessageChannel?function(){var t=void 0,e=new MessageChannel;return e.port1.onmessage=function(){var e=t;t=void 0,e()},function(r){t=r,e.port2.postMessage(null)}}():i.setTimeout?function(t){setTimeout(t,4)}:function(t){t()};else r=function(){var t=i.MutationObserver||i.WebkitMutationObserver||i.WebKitMutationObserver,e=document.createElement("div"),r=void 0,n=new t(function(){var t=r;r=void 0,t()});return n.observe(e,{attributes:!0}),function(t){r=t,e.setAttribute("class","foo")}}();e.exports=r},{"./assert.js":1,"./global.js":11}],18:[function(t,e){"use strict";e.exports=function(e){function r(t){try{return t.then}catch(e){return s.e=e,s}}function i(t,o,c){if(a(t)){if(t instanceof e)return t;var u=r(t);if(u===s)return o="function"==typeof o?o:i,void 0!==c&&c._attachExtraTrace(u.e),e.reject(u.e,o);if("function"==typeof u)return o="function"==typeof o?o:i,n(t,u,o,c)}return t}function n(t,r,i,n){function o(r){if(!l){if(l=!0,t===r){var i=e._makeSelfResolutionError();return void 0!==n&&n._attachExtraTrace(i),void u.promise._reject(i)}u.resolve(r)}}function a(t){l||(l=!0,void 0!==n&&n._attachExtraTrace(t),u.promise._attachExtraTrace(t),u.promise._reject(t))}var u=e.defer(i),l=!1,f=c(r,t,o,a);return f!==s||l||(l=!0,void 0!==n&&n._attachExtraTrace(f.e),u.promise._reject(f.e)),u.promise}var o=(t("./assert.js"),t("./util.js")),s=o.errorObj,a=o.isObject,c=o.tryCatch2;e._cast=i}},{"./assert.js":1,"./util.js":19}],19:[function(t,e){"use strict";function r(t){"undefined"!=typeof console&&null!==console&&"function"==typeof console.warn&&console.warn("Bluebird: "+t)}function i(t,e,r){try{return t.call(e,r)}catch(i){return m.e=i,m}}function n(t,e,r,i){try{return t.call(e,r,i)}catch(n){return m.e=n,m}}function o(t,e,r){try{return t.apply(r,e)}catch(i){return m.e=i,m}}function s(t){return"string"==typeof t?t:""+t}function a(t){return null==t||t===!0||t===!1||"string"==typeof t||"number"==typeof t}function c(t){return!a(t)}function u(t){return a(t)?new Error(s(t)):t}function l(t,e){var r,i=t.length,n=new Array(i+1);for(r=0;i>r;++r)n[r]=t[r];return n[r]=e,n}function f(t,e,r){var i={value:r,configurable:!0,enumerable:!1,writable:!0};return d.defineProperty(t,e,i),t}function p(t){throw t}var h=t("./global.js"),d=(t("./assert.js"),t("./es5.js")),_=function(){try{var t={};return d.defineProperty(t,"f",{get:function(){return 3}}),3===t.f}catch(e){return!1}}(),v=function(t,e,r){try{return f(t,e,r),t}catch(i){for(var n={},o=d.keys(t),s=0,a=o.length;a>s;++s)try{var c=o[s];n[c]=t[c]}catch(u){n[c]=u}return f(n,e,r),n}},y=function(){return"undefined"!=typeof window&&null!==window&&"undefined"!=typeof window.document&&"undefined"!=typeof navigator&&null!==navigator&&"string"==typeof navigator.appName&&window===h?!1:!0}(),m={e:{}},g=function(t,e){function r(){this.constructor=t,this.constructor$=e;for(var r in e.prototype)i.call(e.prototype,r)&&"$"!==r.charAt(r.length-1)&&(this[r+"$"]=e.prototype[r])}var i={}.hasOwnProperty;return r.prototype=e.prototype,t.prototype=new r,t.prototype},j=function(){return"string"!==this}.call("string"),b={thrower:p,isArray:d.isArray,haveGetters:_,notEnumerableProp:f,isPrimitive:a,isObject:c,ensurePropertyExpansion:v,canEvaluate:y,deprecated:r,errorObj:m,tryCatch1:i,tryCatch2:n,tryCatchApply:o,inherits:g,withAppended:l,asString:s,maybeWrapAsError:u,wrapsPrimitiveReceiver:j};e.exports=b},{"./assert.js":1,"./es5.js":9,"./global.js":11}]},{},[3])(3)})},{__browserify_process:6}],2:[function(t,e){"use strict";function r(t,e){return e||(e={}),o({headers:e.headers,method:e.method,uri:t}).spread(function(t){var e={body:t.body,headers:i(t.getAllResponseHeaders()),status:t.statusCode};if(e.status>=300){var r=new Error(e.body);throw r.body=e.body,r.headers=e.headers,r.status=e.status,r}return e})}function i(t){var e={};if(!t)return e;for(var r=t.split("\r\n"),i=0;i<r.length;i++){var n=r[i],o=n.indexOf(": ")||n.indexOf(":");if(o>0){var s=n.substring(0,o),a=n.substring(o+2);e[s]=a}}return e}var n=t("bluebird"),o=n.promisify(t("xhr"));e.exports=r},{bluebird:1,xhr:3}],3:[function(t,e){function r(t,e){function r(){4===l.readyState&&n()}function n(){var t=null,r=l.statusCode=l.status,i=l.body=l.response||l.responseText||l.responseXML;if(0===r){var n=l.responseText||s[String(l.status).charAt(0)];t=new Error(n),t.statusCode=l.status}e(t,l,i)}function u(t){e(t,l)}"string"==typeof t&&(t={uri:t}),t=t||{},e=o(e);var l;l=t.cors?new c:new a;var f=l.url=t.uri,p=l.method=t.method||"GET",h=t.body||t.data,d=l.headers=t.headers||{},_=!!t.sync;return l.onreadystatechange=r,l.onload=n,l.onerror=u,l.onprogress=function(){},l.ontimeout=i,l.open(p,f,!_),t.cors&&(l.withCredentials=!0),_||(l.timeout="timeout"in t?t.timeout:5e3),l.setRequestHeader&&Object.keys(d).forEach(function(t){l.setRequestHeader(t,d[t])}),l.send(h),l}function i(){}var n=t("global/window"),o=t("once"),s={0:"Internal XMLHttpRequest Error"},a=n.XMLHttpRequest||i,c="withCredentials"in new a?n.XMLHttpRequest:n.XDomainRequest;e.exports=r},{"global/window":4,once:5}],4:[function(t,e){var r="undefined"!=typeof self?self:"undefined"!=typeof window?window:{};e.exports="undefined"!=typeof window?window:"undefined"!=typeof r?r:{}},{}],5:[function(t,e){function r(t){var e=!1;return function(){return e?void 0:(e=!0,t.apply(this,arguments))}}e.exports=r,r.proto=r(function(){Object.defineProperty(Function.prototype,"once",{value:function(){return r(this)},configurable:!0})})},{}],6:[function(t,e){var r=e.exports={};r.nextTick=function(){var t="undefined"!=typeof window&&window.setImmediate,e="undefined"!=typeof window&&window.postMessage&&window.addEventListener;if(t)return function(t){return window.setImmediate(t)};if(e){var r=[];return window.addEventListener("message",function(t){var e=t.source;if((e===window||null===e)&&"process-tick"===t.data&&(t.stopPropagation(),r.length>0)){var i=r.shift();i()}},!0),function(t){r.push(t),window.postMessage("process-tick","*")}}return function(t){setTimeout(t,0)}}(),r.title="browser",r.browser=!0,r.env={},r.argv=[],r.binding=function(){throw new Error("process.binding is not supported")},r.cwd=function(){return"/"},r.chdir=function(){throw new Error("process.chdir is not supported")}},{}]},{},[2])(2)});
},{}],20:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

},{}],21:[function(require,module,exports){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

'use strict';

var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return obj[k].map(function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};

},{}],22:[function(require,module,exports){
'use strict';

exports.decode = exports.parse = require('./decode');
exports.encode = exports.stringify = require('./encode');

},{"./decode":20,"./encode":21}]},{},[1])
(1)
});