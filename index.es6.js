'use strict';

var _ = require('lodash');
var axios = require('axios');
var redefine = require('redefine');
var resolveResponse = require('contentful-resolve-response');
var querystring = require('querystring');

export default function createClient (options) {
  return new Client(options || {});
};

class Client {
  constructor (options) {
    enforcep(options, 'accessToken');
    enforcep(options, 'space');

    this.options = _.defaults({}, options, {
      host: 'cdn.contentful.com',
      secure: true
    });
  }

  _request (path, query) {
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
  }

  asset (id, callback) {
    return nodeify(
      this._request('/assets/' + id).then(Asset.parse),
      callback
    );
  }

  assets (object, callback) {
    var query = Query.parse(object);
    var deferred = this._request('/assets', query)
                   .then(_.partial(SearchResult.parse));
    return nodeify(deferred, callback);
  }

  contentType (id, callback) {
    var deferred = this._request('/content_types/' + id)
                   .then(ContentType.parse);
    return nodeify(deferred, callback);
  }

  contentTypes (object, callback) {
    var query = Query.parse(object);
    var deferred = this._request('/content_types', query)
                   .then(_.partial(SearchResult.parse));
    return nodeify(deferred, callback);
  }

  entry (id, callback) {
    var deferred = this._request('/entries/' + id)
                   .then(Entry.parse);
    return nodeify(deferred, callback);
  }

  entries (object, callback) {
    var query = Query.parse(object);
    var deferred = this._request('/entries', query)
                   .then(_.partial(SearchResult.parse));
    return nodeify(deferred, callback);
  }

  space (callback) {
    return nodeify(this._request(''), callback);
  }

  _pagedSync  (sync) {
    var self = this;
    return this._request('/sync', sync.query)
               .then(function (data) {
                 sync.append(data);
                 if(!sync.done){
                   return self._pagedSync(sync);
                 } else {
                   return {
                     items: sync.items,
                     nextSyncToken: sync.nextSyncToken
                   };
                 }
               });
  }

  sync  (object, callback) {
    if (!object || (!object.initial && !object.nextSyncToken)) {
      throw new Error('Please provide either the initial flag or a nextSyncToken for syncing');
    }
    var query = Query.parse(object);
    var deferred = this._pagedSync(new Sync(query))
                   .then(function (response) {
                     response.items = SearchResult.parse(response);
                     return response;
                   });
    return nodeify(deferred, callback);
  }
}

class Asset {
  static parse (object) {
    return _.extend(new Asset(), {
      sys: Sys.parse(object.sys),
      fields: object.fields
    });
  }
}

class Entry {
  static parse (object) {
    return _.extend(new Entry(), {
      sys: Sys.parse(object.sys),
      fields: object.fields
    });
  }
}

class ContentType {
  static parse (object) {
    return _.extend(new ContentType(), {
      sys: Sys.parse(object.sys),
      fields: object.fields.map(Field.parse),
    }, _.pick(object, 'name', 'displayField'));
  }
}

class Field {
  static parse (object) {
    return _.extend(new Field(), object);
  }
}

class SearchResult {
  static parse (object) {
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

class Query {
  toQueryString () {
    return querystring.stringify(this);
  }

  static parse (object) {
    return _.extend(new Query(), stringifyArrayValues(object));
  }
}

class Space {
  static parse (object) {
    return _.extend(new Space(), object);
  }
}

class Sys {
  static parse (object) {
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

class Link {
  static parse (object) {
    return _.extend(new Link(), {
      sys: Sys.parse(object.sys)
    });
  }
}

class Sync {
  constructor (query) {
    this.query = query;
    this.items = [];
    this.done = false;
  }

  append (data) {
    this.items = this.items.concat(data.items);
    if(data.nextPageUrl){
      var nextPageUrl = data.nextPageUrl.split('?');
      this.query = _.omit(this.query, 'initial', 'type', 'sync_token');
      this.query.sync_token = querystring.parse(nextPageUrl[1]).sync_token;
    } else if(data.nextSyncUrl){
      var nextSyncUrl = data.nextSyncUrl.split('?');
      this.nextSyncToken = querystring.parse(nextSyncUrl[1]).sync_token;
      this.done = true;
    }
  }
}


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
