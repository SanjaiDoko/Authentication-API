//Mongodb Imports
const mongoose = require('mongoose')

//Schema Imports
const user = require('../schema/user')
const { ObjectId } = require('bson')

//DB Collection Schema
const db = {
  user
}

/**All mongoose queryfunction and normal functions */
/**findOneAndUpdate
 * findOneandUpdate
 * find
 * find and select
 * findOne
 * insertMany
 * insertOne
 * updateOne
 * findByIdAndUpdate
 * distinct
 * deleteOne
 * deleteMany
 * 
 */

const updateDocument = async (collection, filter, update, options) => {
  try {
    let result = await db[collection].findOneAndUpdate(filter, update, options);

    return result;
  } catch (error) {
    console.error("Error findOneAndUpdate documents: ", error)

    throw error;
  }
}

const updateManyDocuments = async (collection, filter, update, options) => {
  try {
    let result = await db[collection].updateMany(filter, update, options);

    return result;
  } catch (error) {
    console.error("Error findOneAndUpdate documents: ", error)

    throw error;
  }
}

const findDocuments = async (collection, filter, options) => {
  try {
    let result = await db[collection].find(filter, options);

    return result;
  } catch (error) {
    console.error("Error find documents: ", error)

    throw error;
  }
}

const findAndSelect = async (collection, filter, projection, options) => {
  try {
    let result = await db[collection].find(filter, options).select(projection);

    return result;
  } catch (error) {
    console.error("Error find and Select documents: ", error)

    throw error;
  }
}

const findSingleDocument = async (collection, filter, projection) => {
  try {
    let result = await db[collection].findOne(filter, projection);

    return result;
  } catch (error) {
    console.error("Error findOne documents: ", error)

    throw error;
  }
}

const findOneDocumentExists = async (collection, filter, projection) => {
  try {
    let result = await db[collection].findOne(filter, projection);
    if (result && Object.keys(result).length !== 0) {

      return true
    }

    return false
  } catch (error) {
    console.error("Error findExist documents: ", error)

    throw error;
  }
}

const findDocumentExist = async (collection, filter, options) => {
  try {
    let result = await db[collection].find(filter, options);
    if (result.length !== 0) {

      return true
    }

    return false
  } catch (error) {
    console.error("Error find documents: ", error)

    throw error;
  }
}

const insertManyDocuments = async (collection, documents) => {
  try {
    let result = await db[collection].insertMany(documents)

    return result;
  } catch (error) {
    console.error("Error inserting documents: ", error)

    throw error;
  }
}

const insertSingleDocument = async (collection, document) => {
  try {
    let result = await db[collection].create(document)

    return result;
  } catch (error) {
    console.error("Error inserting document: ", error)

    throw error;
  }
}

const updateOneDocument = async (collection, filter, update) => {
  try {
    let result = await db[collection].updateOne(filter, update)

    return result;5
  } catch (error) {
    console.error("Error updating document: ", error)

    throw error;
  }
}

const findByIdAndUpdate = async (collection, id, update) => {
  try {
    let filter = { _id: new ObjectId(id) };
    let result = await db[collection].updateOne(filter, update)

    return result;
  } catch (error) {
    console.error("Error finding and updating document by ID: ", error)

    throw error;
  }
}

const findOneAndUpdate = async (collection, filter, update) => {
  try {
    let options = {
      new: true, // return the updated document instead of the original      
      useFindAndModify: false, // use the MongoDB driver's findOneAndUpdate method instead of Mongoose's deprecated method    
    }
    let updatedDoc = await db[collection].findOneAndUpdate(filter, update, options).exec()

    return updatedDoc;
  }
  catch (error) {
    console.error("Error finding one and updating document: ", error.message)

    throw error;
  }
}

const getDistinctValues = async (collection, field, query, options) => {
  try {
    let result = await db[collection].distinct(field, query, options)

    return result;
  } catch (error) {
    console.error("Error : in get distinct data", error)

    throw error;
  }
}

const deleteOneDocument = async (collection, filter, options) => {
  try {
    let result = await db[collection].deleteOne(filter, options)

    return result;   //return true/false
  } catch (error) {
    console.error("Error : in deleteOne doc", error);

    throw error;
  }
}

const deleteManyDocument = async (collection, filter, options) => {
  try {
    let result = await db[collection].deleteMany(filter, options)

    return result;   //return true/false
  } catch (error) {
    console.error("Error : in deletemany doc", error)

    throw error
  }
}

const getAggregation = async (collection, filter) => {
  try {
    let result = await db[collection].aggregate(filter)

    return result
  } catch (error) {
    console.error("Error : in getAggregation", error)

    throw error
  }
}

module.exports = {
  updateDocument,
  updateManyDocuments,
  findDocuments,
  findAndSelect,
  findSingleDocument,
  findOneDocumentExists,
  findDocumentExist,
  insertManyDocuments,
  insertSingleDocument,
  updateOneDocument,
  findByIdAndUpdate,
  findOneAndUpdate,
  getDistinctValues,
  deleteOneDocument,
  deleteManyDocument,
  getAggregation
}