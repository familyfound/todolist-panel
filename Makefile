
default: build
	@:

build: index.js todolist-panel.css template.js
	@echo "Component"
	@component build --dev

template.html: template.jade
	@jade $<

template.js: template.html
	@component convert $<

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

# open browser correctly in mac or linux
UNAME_S := $(shell uname -s)
ifeq ($(UNAME_S),Linux)
		open := google-chrome
endif
ifeq ($(UNAME_S),Darwin)
		open := open
endif

example: build
	@${open} test/example.html

.PHONY: clean example
