# Web4 Tools for Atomic Assets 🛠
NFT tools to empower WAX Metadata Standards using spacetime data (web4) on Atomic Assets in node.js


## Overview 

This NPM package provides a set of functions to interact with the AtomicAssets API, particularly focusing on retrieving NFT (Non-Fungible Token) data based on various filters and criteria. The package utilizes the `ExplorerApi` and `RpcApi` from the `atomicassets` module to fetch data from the WAX blockchain. 

## Functions

### `getSchemasWithFields(collectionName, fieldsToCheck)`

- **Purpose:** Retrieves schemas from a specified collection that contain specific fields, aggregated across templates.
- **Parameters:**
  - `collectionName`: String. The name of the collection to check.
  - `fieldsToCheck`: Array of strings (optional). Fields to check for in the schemas. Defaults to a predefined set.
- **Returns:** A Promise that resolves to an object. This object contains schema names and an array of fields present in each schema.

### `getTemplatesWithFields(collectionName, fieldsToCheck)`

- **Purpose:** Fetches template data from a collection that matches the specified fields.
- **Parameters:**
  - `collectionName`: String. The name of the collection.
  - `fieldsToCheck`: Array of strings (optional). Fields to check within the templates.
- **Returns:** A Promise that resolves to an object. This object maps schema names to their respective fields found in the templates.

### `getNFTsWithFields(collectionName, fieldsToCheck)`

- **Purpose:** Retrieves NFTs from a collection that contain specific data fields.
- **Parameters:**
  - `collectionName`: String. The name of the collection.
  - `fieldsToCheck`: Array of strings (optional). Fields to check for in the NFT data.
- **Returns:** A Promise that resolves to an array of NFTs that match the specified fields.

### `getNFTsByField(collectionName, fieldFilters)`

- **Purpose:** Fetches NFTs from a collection filtered by specific data fields.
- **Parameters:**
  - `collectionName`: String. The name of the collection.
  - `fieldFilters`: Object. An object where keys are field names and values are the field values to filter by.
- **Returns:** A Promise that resolves to an array of NFTs filtered by the specified fields.

### `getNFTsByNation(collectionName, nation, fieldFilters)`

- **Purpose:** Retrieves NFTs from a collection filtered by a specific nation and other data fields.
- **Parameters:**
  - `collectionName`: String. The name of the collection.
  - `nation`: String (optional). The Alpha-3 version of ISO 3166 nation name.
  - `fieldFilters`: Object. An object where keys are field names and values are the field values to filter by.
- **Returns:** A Promise that resolves to an array of NFTs filtered by the specified nation and other fields.

## Installation ⚡️

To use this package, you need to install it via NPM:

```bash
npm install @cxc.world/web4-atomicassets
```

## Usage

Import the desired functions from the package in your JavaScript file:

```javascript
import { getSchemasWithFields, getTemplatesWithFields, getNFTsWithFields, getNFTsByField, getNFTsByNation } from '@cxc.world/web4-atomicassets';
```

You can then call these functions with the appropriate parameters to interact with the AtomicAssets API and retrieve NFT data based on your criteria. The endpoint https://wax.api.atomicassets.io and atomicassets contract are used by default.

## Dependencies

- `atomicassets`: This package relies on the `atomicassets` module for interacting with the AtomicAssets API.


Make sure these dependencies are installed in your environment to ensure proper functioning.

Created with 💜 by [cXc](https://linktr.ee/cXc.world)