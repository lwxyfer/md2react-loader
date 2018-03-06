---
test-front-matter: 'hello world'
imports:
  Button: './button.js'
  HelloWorld: './hello-world.js'
---
# Hello World

This is an example component

```run
<HelloWorld />
<Button label="Hello World" />
```

You can set who to say Hello

```demo
<HelloWorld who="Fernando" />
<Button label="Hello Fernando" />
```
