'use strict';

var _ = require('lodash');
var questor = require('questor');
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

function parseJSONBody(response) {
  return JSON.parse(response.body);
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
