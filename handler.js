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
        S: event.queryStringParameters.userId
      }
    },
    TableName: "weekly"
  };

  dynamodb.getItem(params, (err, data) => {
    if (err) callback(err);

    const response = {
      statusCode: 200,
      headers: defaultHeaders,
      // Return specific properties from data object
      body: JSON.stringify({
        userId: data.Item.userId.S,
        tasks: data.Item.tasks.L,
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