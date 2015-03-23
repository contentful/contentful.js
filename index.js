'use strict';

var _ = require('lodash');
var axios = require('axios');
var redefine = require('redefine');
var resolveResponse = require('contentful-resolve-response');
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

  _request: function(path, query) {
    if (!query) query = {};
    query.access_token = this.options.accessToken;

    var params = {
      headers: {},
      method: 'get',
      url: [
        this.options.secure ? 'https' : 'http',
        '://',
        _.first(this.options.host.split(':')),
        ':',
        this.options.secure ? '443' : '80',
        '/spaces/',
        this.options.space,
        path,
        '?',
        querystring.stringify(query)
      ].join('')
    };
    params.headers['Content-Type'] = 'application/vnd.contentful.delivery.v1+json';

    return axios(params)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        throw error.data;
      });
  },

  asset: function(id, callback) {
    return nodeify(
      this._request('/assets/' + id).then(Asset.parse),
      callback
    );
  },

  assets: function(object, callback) {
    var query = Query.parse(object);
    var deferred = this._request('/assets', query)
                   .then(_.partial(SearchResult.parse));
    return nodeify(deferred, callback);
  },

  contentType: function(id, callback) {
    var deferred = this._request('/content_types/' + id)
                   .then(ContentType.parse);
    return nodeify(deferred, callback);
  },

  contentTypes: function(object, callback) {
    var query = Query.parse(object);
    var deferred = this._request('/content_types', query)
                   .then(_.partial(SearchResult.parse));
    return nodeify(deferred, callback);
  },

  entry: function(id, callback) {
    var deferred = this._request('/entries/' + id)
                   .then(Entry.parse);
    return nodeify(deferred, callback);
  },

  entries: function(object, callback) {
    var query = Query.parse(object);
    var deferred = this._request('/entries', query)
                   .then(_.partial(SearchResult.parse));
    return nodeify(deferred, callback);
  },

  space: function(callback) {
    return nodeify(this._request(''), callback);
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
    parse: function(object) {
      walkMutate(object, isParseableResource, parseResource);
      var items = resolveResponse(object);
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

exports.createClient = function(options) {
  return new Client(options || {});
};

function exists(value) {
  return value != null;
}

function truthy(value) {
  return (value !== false) && exists(value);
}

function compacto(object) {
  return _.reduce(object, function(compacted, value, key) {
    if (truthy(value)) compacted[key] = value;
    return compacted;
  }, {});
}

function enforcep(object, property) {
  if (!exists(object[property]))
    throw new TypeError('Expected property ' + property);
}

var parseableResourceTypes =  {
  Asset: Asset,
  ContentType: ContentType,
  Entry: Entry,
  Space: Space
};

function isParseableResource(object) {
  return _.isObject(object) && _.isObject(object.sys) && 'type' in object.sys &&
    object.sys.type in parseableResourceTypes;
}

function parseResource(resource) {
  var Type = parseableResourceTypes[resource.sys.type];
  return Type.parse(resource);
}

function stringifyArrayValues(object) {
  return _.reduce(object, function(object, value, key) {
    object[key] = _.isArray(value) ? value.join(',') : value;
    return object;
  }, {});
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

function nodeify(deferred, callback) {
  if(callback) {
    return deferred
    .then(function (response) {
      callback(null, response);
      return response;
    })
    .catch(function (error) {
      callback(error);
      throw error;
    });
  }
  return deferred;
}
