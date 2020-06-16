'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' }); // Default if we dont specify region = N. Virginia

const defaultHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Credentials': true,
};

module.exports.getUser = (event, context, callback) => {
  const params = {
    Key: {
      "userId": {
        S: event.queryStringParameters.id
      }
    },
    TableName: "weekly"
  };

  dynamodb.getItem(params, (err, data) => {
    if (err) callback(err);

    // Convert tasks from DynamoDB structured format to standard Javascript array
    const tasks = data.Item.tasks.L.map(taskObj => {
      return taskObj.S ? taskObj.S : undefined;
    });

    const response = {
      statusCode: 200,
      headers: defaultHeaders,
      // Return specific properties from data object
      body: JSON.stringify({
        id: data.Item.userId.S,
        tasks: tasks,
      }),
    };

    callback(null, response);
  });
};

module.exports.createUser = async (event, context, callback) => {
  const { id } = JSON.parse(event.body);
  const params = {
    Item: {
      "userId": {
        S: id
      },
      "tasks": {
        L: [] // Create empty list of 'tasks' in DB
      }
    },
    TableName: "weekly",
  };

  await dynamodb.putItem(params, (err, data) => {
    if (err) callback(err);
    callback(null, data);
  });

  const response = {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify({
      message: `New user created successfully`,
    }),
  };

  callback(null, response);
};

module.exports.updateUser = async (event, context, callback) => {
  /*
   * id: String
   * tasks: Array<String>
   */
  const { id, tasks } = JSON.parse(event.body);

  // Convert tasks into the data structure that DynamoDB expects
  //  e.g. [{ S: 'task 1' }, { S: 'task 2' }]
  const structuredTasks = tasks.map(task => ({ S: task }));

  const params = {
    Item: {
      "userId": {
        S: id
      },
      "tasks": {
        L: structuredTasks
      }
    },
    TableName: "weekly",
  };

  console.log({
    event,
    eventBody: event.body,
    id,
    tasks,
    structuredTasks,
  });

  // TODO: convert this to updateItem
  await dynamodb.putItem(params, (err, data) => {
    if (err) callback(err);
    callback(null, data);
  });

  const response = {
    statusCode: 200,
    headers: defaultHeaders,
    body: JSON.stringify({
      message: `Tasks updated successfully`,
    }),
  };

  callback(null, response);
};