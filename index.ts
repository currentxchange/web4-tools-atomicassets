import { ExplorerApi, RpcApi } from "atomicassets";



const defaultFields = ["timestamp", "date", "year", "month", "day", "location", "nation", "state", "city", "geotag"];

interface SchemaFieldData {
  [key: string]: {
      [templateId: string]: string[];
  };
}

interface TemplateData {
  [key: string]: string[][];
}

interface FieldFilterParams {
  [key: string]: string | number | boolean;
}

/**
 * Retrieves schemas from a collection that contain specific fields, aggregated across templates.
 * @param collectionName The name of the collection to check.
 * @param fieldsToCheck Array of fields to check for in the schemas. Defaults to a predefined set.
 * @returns Promise<object> Object with schema names and an array of fields present in that schema.
 */
export async function getSchemasWithFields(collectionName: string, fieldsToCheck: string[] = defaultFields) {
    console.log(`Getting schemas with fields for collection '${collectionName}'`);

    try {
        const templatesData = await getTemplatesWithFields(collectionName, fieldsToCheck);
        if (!templatesData) {
          throw new Error('templatesData could not be parsed');
        }
  let schemaFieldAggregation: { [key: string]: string[] } = {};

  for (const schemaName in templatesData) {
    let aggregatedFields = new Set<string>();
    for (const templateId in templatesData[schemaName]) {
      templatesData[schemaName][templateId].forEach((field: string) => aggregatedFields.add(field));
    }
    schemaFieldAggregation[schemaName] = Array.from(aggregatedFields);
  }

        console.log('Aggregated schema fields:', schemaFieldAggregation);
        return schemaFieldAggregation;
    } catch (error) {
        console.error('Error retrieving schemas with aggregated fields:', error);
        return undefined;
    }
}



export async function getTemplatesWithFields(collectionName: string, fieldsToCheck: string[] = defaultFields): Promise<SchemaFieldData> {    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
        const schemas = await explorerApi.getSchemas({ collection_name: collectionName });
        
        if (!schemas || schemas.length === 0) {
            throw new Error('Schemas not found for collection');
        }
        let schemaFieldData: SchemaFieldData = {};
        for (const schema of schemas) {
            const templates = await explorerApi.getTemplates({ schema_name: schema.schema_name });
            for (const template of templates) {
                let foundFields = fieldsToCheck.filter(field => Object.keys(template.immutable_data).includes(field));
                if (foundFields.length > 0) {
                    console.log("foundFields");
                    
                    if (!schemaFieldData[schema.schema_name]) {
                        schemaFieldData[schema.schema_name] = {};
                    }
                    schemaFieldData[schema.schema_name][template.template_id] = foundFields;
                }
            }
        }

        return schemaFieldData;
    } catch (error) {
        console.log('Error checking collection schemas:', error);
        return undefined;
    }
}

export async function getNFTsWithFields(collectionName: string, fieldsToCheck: string[] = defaultFields) {
    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
        // Fetch templates containing the specified fields
        const filteredTemplates = await getTemplatesWithFields(collectionName, fieldsToCheck);
        const templateIds = Object.keys(filteredTemplates); // Get only the template IDs

        if (templateIds.length === 0) {
            console.log('No templates found with the specified fields');
            return [];
        }

        // Fetch NFTs for all the filtered template IDs in one call
        const nfts = await explorerApi.getAssets({
            collection_name: collectionName,
            template_ids: templateIds.join(',')
        });

        console.log('Retrieved NFTs with specified fields:', nfts);
        //return nfts.map(nft => nft.asset_id); // Returning only the asset IDs for simplicity
        return nfts;
    } catch (error) {
        console.error('Error retrieving NFTs with fields:', error);
        return undefined;
    }
}

/**
 * Retrieves NFTs from a collection filtered by specific data fields.
 * @param collectionName The name of the collection to check.
 * @param fieldFilters An object where keys are field names and values are the field values to filter by.
 * @returns Promise<Array> Array of filtered NFTs.
 */
export async function getNFTsByField(collectionName: string, fieldFilters: FieldFilterParams = {}) {
    console.log('Fetching NFTs for collection:', collectionName);
    console.log('Using field filters:', fieldFilters);

    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});
      
        // Construct filter query parameters
        let filterParams: FieldFilterParams = {};
        for (const [field, value] of Object.entries(fieldFilters)) {
            if (typeof value === 'boolean') {
                filterParams[`data:bool.${field}`] = value ? 'true' : 'false';
            } else if (typeof value === 'number') {
                filterParams[`data:number.${field}`] = value;
            } else {
                // Defaults to text type
                filterParams[`data:text.${field}`] = value;
            }
        }

        console.log('Constructed filter parameters:', filterParams);

        // Fetch NFTs with the constructed filters
        const nfts = await explorerApi.getAssets({
            collection_name: collectionName,
            ...filterParams
        });

        if (!nfts) {
          throw new Error('NFT data could not be parsed');
        }

        console.log('Retrieved NFTs with specified field filters:', nfts);
        return nfts;
        //return nfts.map(nft => nft.asset_id); // Returning only the asset IDs for simplicity
    } catch (error) {
        console.error('Error retrieving NFTs by field:', error);
    }
}



/**
 * Retrieves NFTs from a collection filtered by specific data fields.
 * @param collectionName The name of the collection to check.
 * @param nation The Alpha-3 version of ISO 3166 nation name.
 * @param fieldFilters An object where keys are field names and values are the field values to filter by.
 * @returns Promise<Array> Array of filtered NFTs.
 */
export async function getNFTsByNation(collectionName: string, nation: string = "", fieldFilters: FieldFilterParams = {}) {    console.log('Fetching NFTs for collection:', collectionName);
    console.log('Using field filters:', fieldFilters);

    try {
        const explorerApi = new ExplorerApi("https://wax.api.atomicassets.io", "atomicassets", {fetch});

        // Construct filter query parameters
        let filterParams: FieldFilterParams = nation !== "" ? { [`data:text.nation`]: nation.toUpperCase() } : {};
        nation != "" ? filterParams[`data:text.nation`] = nation.toUpperCase() : null;
        for (const [field, value] of Object.entries(fieldFilters)) {
            if (typeof value === 'boolean') {
                filterParams[`data:bool.${field}`] = value ? 'true' : 'false';
            } else if (typeof value === 'number') {
                filterParams[`data:number.${field}`] = value;
            } else {
                // Defaults to text type
                filterParams[`data:text.${field}`] = value;
            }
        }

        console.log('Constructed filter parameters:', filterParams);

        // Fetch NFTs with the constructed filters
        const nfts = await explorerApi.getAssets({
            collection_name: collectionName,
            ...filterParams
        });

        
        if (!nfts) {
          throw new Error('NFT data could not be parsed');
        }

        console.log('Retrieved NFTs with specified field filters:', nfts);
        //return nfts.map(nft => nft.asset_id); // Returning only the asset IDs for simplicity
        return nfts;
    } catch (error) {
        console.error('Error retrieving NFTs by field:', error);
    }
}
