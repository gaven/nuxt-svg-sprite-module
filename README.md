# nuxt-svg-sprite-module

> A quick and dirty way to inline svg sprites in your Nuxt app.
## Install

```sh
$ yarn add nuxt-svg-sprite-module

$ npm install nuxt-svg-sprite-module --save
```

## Configure

In `nuxt.config.js`

```js
  modules: [
    ['nuxt-svg-sprite-module', {
      directory: '/assets/icons'
      options: {
        // Configuration options:
        // https://github.com/jkphl/svg-sprite#configuration-basics
      }
    }]
  ]
```

## Usage

This module finds svgs in your specified directory and inlines them in Nuxt's [app template](https://nuxtjs.org/guide/views/#app-template). You can pass [svg-sprite options](https://github.com/jkphl/svg-sprite#configuration-basics) to be merged with the the default configuration options.

By default, icons are prefixed with the word `icon`.

```html
  <svg>
    <use xlink:href='#icon-foo'></use>
  </svg>
```

In order to tell this module where to inline your sprite you need to include a comment within your `app.html` file. Idealy this comment would proceed the opening `<body>` tag. If an `app.html` file does not exist, one will be generated in its absence.

```html
<!-- svg-sprite -->
```

## Contributing

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](https://github.com/gaven/nuxt-svg-sprite-module/issues/new)

## Author

#### Gaven Heim

* [github/gaven](https://github.com/gaven)
* [twitter/gavenheim](https://twitter.com/gavenheim)
