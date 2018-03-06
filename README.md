Markdown to React
==================

[![npm version](https://img.shields.io/npm/v/md2react-loader.svg)](https://www.npmjs.com/package/md2react-loader)
[![build status](https://travis-ci.org/lwxyfer/md2react-loader.svg?branch=master)](https://travis-ci.org/lwxyfer/md2react-loader)
[![dependencies Status](https://david-dm.org/lwxyfer/md2react-loader/status.svg)](https://david-dm.org/lwxyfer/md2react-loader)
[![devDependencies Status](https://david-dm.org/lwxyfer/md2react-loader/dev-status.svg)](https://david-dm.org/lwxyfer/md2react-loader?type=dev)

Webpack loader that parses markdown files and converts them to a React Component.

By extending md syntax, you can easily write react componet in `.md` files.


## Usage

install:

```
npm i -D md2react-loader
```

config your webpack and make sure you have installed babel-loader:

```js
module: {
  rules: [
    {
      test: /\.md$/,
      use: [
        'babel-loader',
        {
          loader: 'md2react-loader',
        }
      ],
    },
  ]
}
```

write your md files:

*hello.md*
<pre>

---
imports:
  TestComponent: './testComponent.js'
  '{ Component1, Component2 }': './components.js'
---
# Hello World

This is an example component

```run
&lt;TestComponent /&gt;
```

```demo
&lt;HelloWorld who="World!!!" /&gt;
```

</pre>


*app.js*
```js
import React, { PropTypes } from 'react';

/**
* use md just like a react component
*/
import Hello from 'hello.md'


export default (props) => {
  return (
    <div className="hello-world">
      <Hello />
    </div>
  );
}
```

## Advanced

In the FrontMatter you should import the components you want to render
with the component name as a key and it's path as the value。

Markdown syntax extension:

<pre>
```run
```
</pre>
- Use the *run* tag to code fenceblocks you want the
loader to compile as Components this will just output the rendered component.
<pre>
```demo
```
</pre>
- Use the *demo* tag to code fenceblocks you want the
loader to compile as Components this will output the usual highlighted code
and the rendered component.

if you want to custom the output of code, you can just download the repo and change it.

## TODO

- loader options: 
  - config dependencies 
  - config markdown render options


## Inspired by [react-markdown-loader](https://github.com/lwxyfer/react-markdown-loader)

## License

MIT (c) 2018
