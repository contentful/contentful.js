build:
	browserify -s contentful index.js > dist/contentful.js
	uglifyjs  dist/contentful.js > dist/contentful.min.js

clean:
	rm dist/*

.PHONY: build clean
