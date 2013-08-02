'use strict';

var _ = require('underscore-contrib');
var Promise = require('pacta').Promise;
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
    options.headers['Content-Type'] = 'application/vnd.contentful.v1+json';
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

    var promise = new Promise();
    var request = questor(uri, options);
    request.onRejected(function(reason) {
      if (reason instanceof Error) return reason;
      return parseJSONBody(reason);
    }).map(_.bound(promise, 'reject'));
    request.map(parseJSONBody).map(_.bound(promise, 'resolve'));
    return promise;
  },

  asset: function(id) {
    var promise = new Promise();
    var request = this.request('/assets/' + id);
    request.map(Asset.parse).map(_.bound(promise, 'resolve'));
    request.onRejected(_.bound(promise, 'reject'));
    return promise;
  },

  assets: function(object) {
    var query = Query.parse(object);
    var promise = new Promise();
    var request = this.request('/assets', {query: query});
    request.map(_.partial(SearchResult.parse, Asset))
           .map(_.bound(promise, 'resolve'));
    request.onRejected(_.bound(promise, 'reject'));
    return promise;
  },

  contentType: function(id) {
    var promise = new Promise();
    var request = this.request('/content_types/' + id);
    request.map(ContentType.parse).map(_.bound(promise, 'resolve'));
    request.onRejected(_.bound(promise, 'reject'));
    return promise;
  },

  contentTypes: function(object) {
    var query = Query.parse(object);
    var promise = new Promise();
    var request = this.request('/content_types', {query: query});
    request.map(_.partial(SearchResult.parse, ContentType))
           .map(_.bound(promise, 'resolve'));
    request.onRejected(_.bound(promise, 'reject'));
    return promise;
  },

  entry: function(id) {
    var promise = new Promise();
    var request = this.request('/entries/' + id);
    request.map(Entry.parse).map(_.bound(promise, 'resolve'));
    request.onRejected(_.bound(promise, 'reject'));
    return promise;
  },

  entries: function(object) {
    var query = Query.parse(object);
    var promise = new Promise();
    var request = this.request('/entries', {query: query});
    request.map(_.partial(SearchResult.parse, Entry))
           .map(_.bound(promise, 'resolve'));
    request.onRejected(_.bound(promise, 'reject'));
    return promise;
  },

  space: function() {
    var promise = new Promise();
    var request = this.request('');
    request.map(_.bound(promise, 'resolve'));
    request.onRejected(_.bound(promise, 'reject'));
    return promise;
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
      return redefine(
        _.map(object.items, ItemType.parse), {
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
          updatedAt: object.createdAt && new Date(object.createdAt),
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

function parseJSONBody(response) {
  return JSON.parse(response.responseText);
}

function stringifyArrayValues(object) {
  return _.reduce(object, function(object, value, key) {
    object[key] = _.isArray(value) ? value.join(',') : value;
    return object;
  }, {});
}
