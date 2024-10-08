const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

async function loadData() {
    const client = new Client({ node: 'http://localhost:9200'  });

    // Read data from JSON file
    let recipes;
    try {
        const jsonString = fs.readFileSync('recipes.json', 'utf8');
        recipes = JSON.parse(jsonString);
    } catch (error) {
        console.error('Error reading or parsing JSON file:', error);
        return;
    }

    // Delete the index if it already exists
    try {
        await client.indices.delete({ index: 'recipes' });
        console.log('Index deleted successfully');
    } catch (error) {
        if (error.meta.statusCode === 404) {
            console.log('Index not found. Proceeding with index creation.');
        } else {
            console.error('Error deleting index:', error);
            return;
        }
    }

    // Create a new index
    try {
        await client.indices.create({
            index: 'recipes',
            body: { 
                mappings: {
                    properties: {
                        name: { type: 'text' },
                        ingredients: { type: 'text'
                            //type: 'nested',
                            //properties: {
                             //   type: { type: 'text' },
                             //   quantity: { type: 'text' }
                            },
                        
                        instructions: { type: 'text' },
                        image: { type: 'text' }
                    }
                }
            }
        });
        console.log('Index created successfully');
    } catch (error) {
        console.error('Error creating index:', error);
        return;
    }

    // Bulk insert data
    const body = recipes.flatMap(recipe => [
        { index: { _index: 'recipes' } },
        {
            name: recipe.name,
            ingredients: recipe.ingredients,
            instructions: recipe.instructions,
            image : recipe.image

        }
    ]);

    // Log the body being sent to Elasticsearch
    console.log('Bulk insert body:', body);

 
    try {
        const  bulkResponse  = await client.bulk({ refresh: true, body });

        
         console.log('Bulk response:', bulkResponse);

        if (bulkResponse.errors) {
            const erroredDocuments = [];
            bulkResponse.items.forEach((action, i) => {
                const operation = Object.keys(action)[0];
                if (action[operation].error) {
                    erroredDocuments.push({
                        status: action[operation].status,
                        error: action[operation].error,
                        operation: body[i * 2],
                        document: body[i * 2 + 1]
                    });
                }
            });
            console.error('Failed to load data:', erroredDocuments);
        } else {
            console.log('Data loaded successfully');
        }
    } catch (error) {
        console.error('Error bulk inserting data:', error);
    }
}

loadData().catch(console.error);
