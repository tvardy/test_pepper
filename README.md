# How to use?


## Global dependencies

The only global dependency that this package would need is `node` alog with `npm` installed on your machine.


## Setup

After cloning (or unpacking) get into projects directory from your terminal console and run:

```bash
npm run setup
```

That will run dependencies installation process. After it's finished your good to go.

## Running

Just type in your terminal:

```bash
npm start
```

That command will progress with these steps:
- build all the files into `dest` directory
- run `static-server` (on default port `9080`) to serve the project

You can now [visit the project](http://localhost:9080) in a browser of your choice.

Note: If you have something else running on the port `9080`, you can override the default setting by running:

```bash
npm start -- -p YOUR_PORT_NUMBER
```


## Stopping

To stop the `static-server` instance just hit `CTRL+C` in the terminal


## Editing

If you wanted to work on the files on a dev setup, you can use:

```bash
npm run watch
```

command for that purposes.

After running the command you'll have a `browser-sync` environment running [here](http://localhost:3000).


# PS
There are tagged versions of the code:

- `0.0.2` - a lightweight solution using CarpetJS, MinifiedJS and JSPM
- `0.0.3` - uses WebPack config in place of JSPM
- `0.0.4` - uses InfernoJS
- `0.0.5` - uses InfernoJS with some optimisations (a separate data model + `fetch()`)
- `0.0.6` - uses VueJS
- *(maybe some other versions)*
