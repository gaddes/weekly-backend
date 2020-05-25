'use strict';
const AWS = require('aws-sdk');
const dynamodb = new AWS.DynamoDB({ apiVersion: '2012-08-10' }); // Default if we dont specify region = N. Virginia

module.exports.endpoint = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, the current time is ${new Date().toTimeString()}.`,
    }),
  };

  callback(null, response);
};

module.exports.getUser = (event, context, callback) => {
  // TODO: for dev only, remove this console.log for prod
  console.log({
    event,
    context,
    callback,
  });

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Success! Check console logs for event params...`,
    }),
  };

  callback(null, response);

  // const params = {
  //   Key: {
  //     "UserID": {
  //       S: 'm'
  //     }
  //   },
  //   TableName: "weekly"
  // };

  // dynamodb.getItem(params, function(err, data) {
  //   if (err) {
  //     console.log(err, err.stack);
  //     callback(err);
  //     // TODO: hide DB error from client
  //   } else {
  //     console.log(data);
  //
  //     // User doesn't exist in DB
  //     if (data.Item === undefined) {
  //       callback("[NotFound] ID not recognised. Please try again.");
  //     }
  //
  //     // Success - Primary user has secondary IDs
  //     if (data.Item.secondaryIds) {
  //       // Store primary user in const
  //       const primaryUser = createUserObject(data.Item);
  //
  //       // Create map of Keys to request
  //       const requestKeys = data.Item.secondaryIds.L.map(id => {
  //         return {
  //           "UserID": {
  //             S: id.S
  //           }
  //         };
  //       });
  //
  //       // Construct params for second GET request (for secondary users)
  //       const batchParams = {
  //         RequestItems: {
  //           "wedding": {
  //             Keys: requestKeys
  //           }
  //         }
  //       };
  //
  //       // Get secondary users
  //       dynamodb.batchGetItem(batchParams, function(err, data) {
  //         if (err) {
  //           callback(err);
  //         } else {
  //           // User doesn't exist in DB
  //           if (data.Responses === undefined) {
  //             callback("[NotFound] ID not recognised. Please try again.");
  //           }
  //
  //           // Success case
  //           // For each returned user, create user object
  //           const secondaryUsers = data.Responses.wedding.map(item => createUserObject(item));
  //
  //           const allUsers = [
  //             primaryUser,
  //             ...secondaryUsers
  //           ];
  //
  //           callback(null, allUsers);
  //         }
  //       });
  //     } else {
  //       // TODO: return this as an array AFTER the work on secondardIDs is complete
  //
  //       // Success - Primary user only
  //       const user = [createUserObject(data.Item)];
  //
  //       callback(null, user);
  //       // TODO: provide success response e.g. 200 code
  //     }
  //   }
  // });
};

module.exports.createUser = async (event, context, callback) => {
  const { id } = JSON.parse(event.body);
  const params = {
    Item: {
      "userId": {
        S: id
      },
    },
    TableName: "weekly",
  };

  await dynamodb.putItem(params, (err, data) => {
    if (err) callback(err);
    callback(null, data);
  });

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: `New user created successfully`,
    }),
  };

  callback(null, response);
};