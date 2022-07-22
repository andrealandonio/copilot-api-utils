# Copilot API utils

An utility app for working with Copilot API.

## Prerequisites

First of all you have to install the software used by the project. Here the list of the mandatory dependencies:

* *node*
* *npm*

## Installing

When prerequisites are covered you have to install project dependencies before you can start using the utility.


``` bash
# install dependencies
npm install
```

Now you should be able to run the script commands using `node index`.

## Usage

You need to be connected to Pulse VPN for reaching the Copilot API endpoints.

### Create

Create a new entity on Copilot using method:

`create(collectionName: string, payload: any) => Promise<CopilotEntity>`

_Structure:_

node index `brand` create `collection` `entity data object to be created`

_Examples:_

node index stg-lacucinaitaliana create articles '{"hed": "Hello World"}'
node index stg-lacucinaitaliana create categories '{"name": "Hello World", "slug": "hello-world"}'

### Update

Update an entity on Copilot using method:

`update(collectionName: string, id: string, payload: any) => Promise<CopilotEntity>`

_Structure:_

node index `brand` update `collection` `entity data object to be updated` `entity id to be updated`

_Examples:_

node index stg-lacucinaitaliana update articles '{"hed": "Hello New World"}' 62bed14f58bae5d12ace860c

### Publish

Publish an entity on Copilot using method:

`publish(collectionName: string, uuid: string, publishOptions: {uri: string, pubDate: Date, revision: number, revisionAuthor: string}) => Promise<CopilotEntity>`

_Structure:_

node index `brand` publish `collection` `entity slug` `entity id to be published` `revision author name`

_Examples:_

node index stg-lacucinaitaliana publish articles 'articles/hello-world' 5cfa38bb113f2630011edea6 'Andrea Landonio'

### Search

Search something on Copilot using method:

`search(query: any): Promise<any>`

_Structure:_

node index `brand` search all `search data object` `extra field to be displayed`

_Examples:_

node index stg-lacucinaitaliana search all '{view: 'live', types: 'articles', limit: 10}' hed

### Get

Get entity data from Copilot using methods:

`getCategory(slug: string, options: any = {}) => Promise<MaybeNull<CopilotEntity>>`
`lookup(slug: string, bustCache?: boolean) => Promise<CopilotEntity>`

For retrieve data related to categories you have to use `taxonomy` as collection.

_Structure:_

node index `brand` get `entity type to be retrieve` `entity slug to be retrieve`

_Examples:_

node index stg-lacucinaitaliana get taxonomy 'vegan'

### Create child taxonomy

Create a new child taxonomy on Copilot using methods:

`create(collectionName: string, payload: any) => Promise<CopilotEntity>`
`relate(collectionName: string, id: string, relMap: RelMap, options: RelateOptions) => Promise<RelMap>`

_Structure:_

node index `brand` create-child-taxonomy categories `object with th new taxonomy name and slug` `parent taxonomy slug`

_Examples:_

node index stg-lacucinaitaliana create-child-taxonomy categories '{"name": "New child", "slug": "new-child"}' 'tags'

## Authors

* **Andrea Landonio** - [github](https://github.com/andrealandonio)
