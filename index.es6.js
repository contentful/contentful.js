'use strict';

import axios from 'axios';
import resolveResponse from 'contentful-resolve-response';
import querystring from 'querystring';

export function createClient (options) {
  return new Client(options || {});
};

class Client {
  constructor ({accessToken, space, secure, host}) {
    if (!accessToken) {
      throw new TypeError('Expected property accessToken');
    }

    if (!space) {
      throw new TypeError('Expected property space');
    }

    const insecure = secure === false;
    var [hostname, port] = (host && host.split(':')) || [];

    hostname = hostname || 'cdn.contentful.com';
    port = port || (insecure ? 80 : 443);

    this.options = {
      baseUrl: `${insecure ? 'http' : 'https'}://${hostname}:${port}/spaces/${space}`,
      accessToken: accessToken
    };
  }

  _request (path, query) {
    if (!query) {
      query = {}
    };

    query.access_token = this.options.accessToken;

    const params = {
      headers: {},
      method: 'get',
      url: `${this.options.baseUrl}${path}?${querystring.stringify(query)}`
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
      this._request('/assets/' + id).then(parseResource),
      callback
    );
  }

  assets (object, callback) {
    const query = new Query(object);
    const deferred = this._request('/assets', query).then(parseSearchResult);
    return nodeify(deferred, callback);
  }

  contentType (id, callback) {
    const deferred = this._request('/content_types/' + id).then(ContentType.parse);
    return nodeify(deferred, callback);
  }

  contentTypes (object, callback) {
    const query = new Query(object);
    const deferred = this._request('/content_types', query).then(parseSearchResult);
    return nodeify(deferred, callback);
  }

  entry (id, callback) {
    const deferred = this._request('/entries/' + id)
                   .then(Entry.parse);
    return nodeify(deferred, callback);
  }

  entries (object, callback) {
    const query = new Query(object);
    const deferred = this._request('/entries', query).then(parseSearchResult);
    return nodeify(deferred, callback);
  }

  space (callback) {
    return nodeify(this._request(''), callback);
  }

  _pagedSync (sync) {
    const self = this;
    return this._request('/sync', sync.query)
               .then(function (data) {
                 sync.append(data);

                 if (!sync.done) {
                   return self._pagedSync(sync);
                 } else {
                   return {
                     items: sync.items,
                     nextSyncToken: sync.nextSyncToken
                   };
                 }
               });
  }

  sync (object, callback) {
    if (!object || (!object.initial && !object.nextSyncToken)) {
      throw new Error('Please provide either the initial flag or a nextSyncToken for syncing');
    }
    const query = new Query(object);
    const deferred = this._pagedSync(new Sync(query)).then(function (response) {
      response.items = parseSearchResult(response);
      return response;
    });
    return nodeify(deferred, callback);
  }
}

class Asset {
  constructor ({sys, fields}) {
    this.sys = new Sys(sys);
    this.fields = fields;
  }

  static parse (object) {
    return new Asset(object);
  }

  get file () {
    return this.fields.file;
  }

  get title () {
    return this.fields.title;
  }

  get description () {
    return this.fields.description;
  }

  get url () {
    return this.fields.file.url;
  }

  get contentType () {
    return this.fields.file.contentType;
  }

  get details () {
    return this.fields.file.details;
  }
}

class Entry {
  constructor ({sys, fields}) {
    this.sys = new Sys(sys);
    this.fields = fields;
  }

  static parse (object) {
    return new Entry(object);
  }
}

class ContentType {
  constructor ({sys, fields, name, displayField}) {
    this.sys = new Sys(sys);
    this.name = name;
    this.displayField = displayField;
    this.fields = fields && fields.map(Field.parse);
  }

  static parse (object) {
    return new ContentType(object);
  }
}

class Field {
  constructor (object) {
    for (var k in object) {
      this[k] = object[k];
    }
  }

  static parse (object) {
    return new Field(object);
  }
}

class Query {
  constructor (object) {
    for (var k in object) {
      this[k] = object[k];
    }
  }

  toQueryString () {
    return querystring.stringify(this);
  }

  static parse (object) {
    return new Query(stringifyArrayValues(object));
  }
}

class Space {
  static parse (object) {
    return _.extend(new Space(), object);
  }
}

class Sys {
  constructor ({id, revision, type, locale, contentType, createdAt, linkType, updatedAt, space}) {
    this.id = id;
    this.revision = revision;
    this.type = type;
    this.locale = locale;
    this.space = space && Link.parse(space);
    this.contentType = contentType && new Link(contentType);
    this.createdAt = createdAt && new Date(createdAt);
    this.updatedAt = updatedAt && new Date(updatedAt);
  }

  static parse (object) {
    return new Sys(object);
  }
}

class Link {
  constructor ({sys}) {
    this.sys = new Sys(sys);
  }

  static parse (object) {
    return new Link(object);
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

    if (data.nextPageUrl) {
      const nextPageUrl = data.nextPageUrl.split('?');
      this.query = _.omit(this.query, 'initial', 'type', 'sync_token');
      this.query.sync_token = querystring.parse(nextPageUrl[1]).sync_token;
    } else if (data.nextSyncUrl) {
      const nextSyncUrl = data.nextSyncUrl.split('?');
      this.nextSyncToken = querystring.parse(nextSyncUrl[1]).sync_token;
      this.done = true;
    }
  }
}

const parseableResourceTypes = {
  Asset: Asset,
  ContentType: ContentType,
  Entry: Entry,
  Space: Space
};

function isParseableResource (object) {
  return _.isObject(object) && _.isObject(object.sys) && 'type' in object.sys &&
    object.sys.type in parseableResourceTypes;
}

function parseResource (resource) {
  var Type = parseableResourceTypes[resource.sys.type];
  return Type.parse(resource);
}

function parseSearchResult (object) {
  walkMutate(object, isParseableResource, parseResource);
  const items = resolveResponse(object);
  Object.defineProperties(items, {
    limit: { value: object.limit, enumerable: false },
    skip:  { value: object.skip,  enumerable: false },
    total: { value: object.total, enumerable: false }
  });
  return items;
}

function stringifyArrayValues (object) {
  return keys(object).reduce(function (result, key) {
    const value = object[key];
    result[key] = _.isArray(value) ? value.join(',') : value;
    return result;
  }, {});
}

function walkMutate (input, pred, mutator) {
  if (pred(input)) {
    return mutator(input);
  }

  if (input && typeof input === 'object') {
    for (var key in input) {
      input[key] = walkMutate(input[key], pred, mutator);
    }
  }

  return input;
}

function nodeify (deferred, callback) {
  if (callback) {
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
