const commandLineUsage = require('command-line-usage');
const CopilotApiClient = require('@condenast/copilot-api-client').default;
const winston = require('winston');

// Read input params
let args = process.argv.slice(2);
let brand = args[0];
let method = args[1];
let collection = args[2];
let payload = args[3];
let data1 = args[4];
let data2 = args[5];

// Output params
if (method !== undefined) {
  console.log("PARAMETERS");
  console.log("*****************************");
  console.log("brand: " + brand);
  console.log("method: " + method);
  console.log("collection: " + collection);
  console.log("payload: " + payload);
  console.log("data 1: " + data1);
  console.log("data 2: " + data2);
  console.log("*****************************");
}

// Read env variables
if (brand !== undefined) {
    copilotApiBaseUrl = (process.env.COPILOT_API_BASEURL !== undefined) ? process.env.COPILOT_API_BASEURL : 'https://' + brand + '-api.aws.conde.io';
    copilotAuthId = (process.env.COPILOT_AUTH_ID !== undefined) ? process.env.COPILOT_AUTH_ID : 'foo';
    copilotAuthKey = (process.env.COPILOT_AUTH_KEY !== undefined) ? process.env.COPILOT_AUTH_KEY : 'bar';

    // Prepare copilot client
    const client = new CopilotApiClient(copilotApiBaseUrl, copilotAuthId, copilotAuthKey, winston);

    // Manage methods
    switch (method) {
        case 'create':
            // Create entity
            const createResult = client.create(collection, JSON.parse(payload));
            createResult.then((createdEntity) => {console.log("created entity id: " + createdEntity.id)});
            break;
        case 'update':
            // Update entity
            const updateResult = client.update(collection, value, JSON.parse(payload));
            updateResult.then((updatedEntity) => {console.log("updated entity id: " + updatedEntity.id)});
            break;
        case 'publish':
            // Publish entity
            const publishResult = client.publish(collection, data1, {
                uri: payload,
                pubDate: new Date(),
                revisionAuthor: data2,
                revision: 0
            });
            publishResult.then((publishedEntity) => {console.log("publish entity id: " + publishedEntity.id)});
            break;
        case 'search':
            // Search data
            const searchResult = client.search(payload);
            searchResult.then((searchEntity) => {
                if (searchEntity.hits.hits) {
                searchEntity.hits.hits.forEach((item) => {                
                    console.log("copilot id: " + item._id + ((data1 !== undefined) ? " - extra field: " + item._source[data1] : ""));
                });
                }
            });
            break;
        case 'get':
            // Get entity
            if (collection == 'taxonomy') {
                const getResult = client.getCategory(payload);
                getResult.then((getEntity) => {
                    if (getEntity !== null) {
                        console.log("taxonomy id: " + getEntity.id);
                    } else {
                        console.log("no data found");
                    }   
                });
            } else {
                const getResult = client.lookup(payload);
                getResult.then((getEntity) => {
                    if (getEntity !== null) {
                        console.log(getEntity);
                    } else {
                        console.log("no data found");
                    }   
                });
            }        
            break;   
        case 'create-child-taxonomy':
            // Create child taxonomy
            const createChildTaxonomyResult = client.create(collection, JSON.parse(payload));
            createChildTaxonomyResult.then((createChildTaxonomyEntity) => {
                console.log("new taxonomy id: " + createChildTaxonomyEntity.id);
        
                // Retrieve parent taxonomy
                const parentTaxonomy = client.getCategory(data1);
                parentTaxonomy.then((parentTaxonomyEntity) => {
                    console.log("parent taxonomy id: " + parentTaxonomyEntity.id);
            
                    // Relate new taxonomy to the parent one
                    client.relate(collection, createChildTaxonomyEntity.id, {
                        parent: [ parentTaxonomyEntity ]
                    });
                });
            });
            break;                       
        default:
            // Show usage
            console.log(commandLineUsage(usage()));
            break;
    }
}
else {
    // Show usage
    console.log(commandLineUsage(usage()));
}

/**
 * Show usage
 * 
 * @returns 
 */
function usage() {
    return [
        {
            header: 'Copilot API utils',
            content: [
                'An utility app for working with Copilot API.',
                'Using env variables you can change COPILOT_API_BASEURL, COPILOT_AUTH_ID and COPILOT_AUTH_KEY.'
            ]
        },
        {
            header: 'Parameters',
            optionList: [
                {
                    name: 'brand',
                    description: 'The brand to use (for example stg-lacucinaitaliana, lacucinaitaliana)'
                },
                {
                    name: 'method',
                    description: 'The method to use'
                },    
                {
                    name: 'collection',
                    description: 'The collection to manage (for example articles, galleries)'
                },
                {
                    name: 'payload',
                    description: 'The method payload or a message or a generic data (id, uuid, slug, text, etc)'
                },
                {
                    name: 'data1',
                    description: 'A generic data (id, uuid, slug, text, etc)'
                },
                {
                    name: 'data2',
                    description: 'A generic data (id, uuid, slug, text, etc)'
                }
            ]
        },
        {
            header: 'Methods',
            optionList: [
                {
                    name: 'create',
                    description: 'Create a new entity on Copilot'
                },
                {
                    name: 'update',
                    description: 'Update an entity on Copilot'
                },
                {
                    name: 'publish',
                    description: 'Publish an entity on Copilot'
                },
                {
                    name: 'search',
                    description: 'Search something on Copilot'
                },
                {
                    name: 'get',
                    description: 'Get entity from Copilot'
                },
                {
                    name: 'create-child-taxonomy',
                    description: 'Create a new child taxonomy on Copilot'
                },                
            ]
        },
    ];
}
