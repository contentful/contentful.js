build:
	browserify -s contentful index.js > dist/contentful.js
	uglifyjs  dist/contentful.js > dist/contentful.min.js
	ls -hl dist

clean:
	rm dist/*

.PHONY: build clean
