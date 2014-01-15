build:
	browserify -s contentful index.js > dist/contentful.js
	uglifyjs dist/contentful.js -m -c > dist/contentful.min.js
	ls -hl dist

clean:
	rm dist/*

sync-pages: clean build
	git checkout gh-pages
	rm -rf dist example
	git checkout master dist example
	git commit dist example -m 'Sync dist & example with gh-pages'

.PHONY: build clean
