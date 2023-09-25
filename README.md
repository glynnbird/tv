# tv

## Terraform-built infrastructure

This app requires some Cloudflare infrastructure, all of which is created using Terraform:

1. A KV namespace.
2. A Cloudflare Pages project, tied to this repo with a binding to the KV Namespace from (1).
3. A custom domain whose traffic is sent the static website from (2).
4. The static website also contains a number of functions which are served out by Cloudflare Workers on the /api/* route.

## Data model

As we only have simple KeyValue store and the Cloudflare KV.list() operation only returns the keys (not the values), the data model packs some data into the key.

| key           | value |  metadata                                                                        |
|---------------|-------|----------------------------------------------------------------------------------|
| 1681893518478 | null  | {"date":"2023-01-05","title":"Line Of Duty","watching":true}                     |


The keys is a timestamp. This allows us to get time-ordered list of programmes with just the `TVKV.list()` function. The value is left blank because we're able to fit a summary in the `metadata` object which has to be < 1kB, but does come back from the `KV.list` function.

The main `value` is everything we know about the programme:

```js
{
  "title": "Line of Duty",
  "description": "The sixth series of Line of Duty, consisting of seven episodes, began broadcasting on BBC One on 21 March 2021. The story follows the actions of AC-12, led by Superintendent Ted Hastings and DI Steve Arnott, as they investigate DCI Joanne Davidson and her team, including former AC-12 officer DI Kate Fleming.",
  "stars": ["Vicky McClure", "Martin Compston", "Kelly McDonald"],
  "on": "BBC",
  "date": "2023-05-01",
  "season": "6",
  "pic": "https://ichef.bbci.co.uk/images/ic/784x441/p09b2v32.jpg",
  "watching": false
}
```

We also add some additional fields for indexing purposes:

```
_ts : "2023-05-01T19:52:24.000Z",
_freetext: [] // list of words to be indexed for freetext search
_freetextIndex: [] // list of stemmed and processed words that are actually indexed
_index: {} // a map of key/value pairs to be indexed for this document


## API

All methods that change data or pass parameters use the `POST` method and expect an `application/json` content type. All API endpoints require a valid `apikey` header or you will get a 401 response.

## Add a todo - POST /api/add

Parameters:

- `title` - the title of the todo (required)
- `description` - additional description
- more!!

e.g.

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' -d'{"title":"Milk","description":"semi-skimmed"}' "https://$URL/api/add" 
{"ok":true,"id":"1681482390981:Milk"}
```

## Get a single todo - POST /api/get

Parameters:

- `id` - the id of the todo (required)

e.g.

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' -d'{"id":"1681482390981:Milk"}' "https://$URL/api/get"
{"ok":true,"todo":{"id":"1681482390981:Milk","time":"2023-04-14T14:26:30.981Z","description":"semi-skimmed"}}
```

## List multiple todos - POST /api/list

Parameters

- n/a

e.g.

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' "https://$URL/api/list"
{"ok":true,"list":[{"id":"doc:1695397113199","date":"2023-09-22","title":"Wilderness","watching":false},{"id":"doc:1695397182714","date":"2023-09-22","title":"Wednesday","watching":false},{"id":"doc:1695397233088","date":"2023-09-22","title":"Stranger Things","watching":true}]}
```

## Delete a todo - POST /api/delete

Parameters:

- `id` - the id of the todo to delete (required)

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' -d'{"id":"1681482390981"}' "https://$URL/api/delete"
{"ok":true}
```

## Query - POST /api/query

Parameters:

- `key` - the name of the key to query on (required)
- `value` - the value needed (required)

```sh
curl -X POST -H'Content-type:application/json' -H'apikey: abc123' -d'{"key":"on","value":"Netflix"}' "https://$URL/api/query"
{"ok":true,"list":[{"id":"index:on:Netflix:1695397182714","date":"2023-09-22","title":"Wednesday","watching":false},{"id":"index:on:Netflix:1695397233088","date":"2023-09-22","title":"Stranger Things","watching":true}]}
```

## Build

The Cloudflare Worker platform will only accept a single JavaScript file per worker. When you have multiple workers, there is a tendency for them to share data: constants, library functions etc. It is anathema to developers to repeat code across files so what is the solution?

 - write code in the normal way, with centralised "lib" files containing code or data that is shared.
 - use `import` statements in each worker file to import data from the files
 - use the [rollup](https://rollupjs.org/) utility to pre-process each worker JS file prior to uploading.

 This produces files in the `/functions/api` folder which are those picked up by Cloudflare and turned into Workers.

 e.g. in `lib/somefile.js`

```js
export const someFunction = () => {
  return true  
}
```

And in your worker JS file:

```js
import { someFunction } from './lib/somefile.js'
someFunction()
```

And roll up with:

```sh
# create a distributable file in the 'dist' folder based on the source file
npx rollup --format=es --file=dist/add.js -- add.js
```

We can also "minify" the rolled up files to make them smaller, but this does change variable names to single-letter names which makes debugging tricky:

```sh
# create a minified distributable file in the 'dist' folder based on the source file
npx rollup -p @rollup/plugin-terser --format=es --file=../functions/api/add.js -- add.js
```

