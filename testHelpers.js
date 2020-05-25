// This file contains command line snippets for testing serverless functions locally

// Send user ID in request body
//  Function: POST createUser
//  Params: { "id": "matt" }
export const createUser = `serverless invoke local -f createUser -d '{"body": "{\"id\": \"matt\"}"}' -l`;