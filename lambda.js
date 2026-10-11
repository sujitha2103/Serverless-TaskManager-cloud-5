const AWS = require("aws-sdk");

const dynamoDB = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = "ServerlessTasks";


exports.handler = async (event) => {

    try {

        const method =
            event.httpMethod ||
            event.requestContext?.http?.method;

        /* GET - Get all tasks */

        if (method === "GET") {

            const result =
                await dynamoDB.scan({
                    TableName: TABLE_NAME
                }).promise();

            return response(200, result.Items);
        }


        /* POST - Add task */

        if (method === "POST") {

            const body =
                typeof event.body === "string"
                    ? JSON.parse(event.body)
                    : event.body;

            if (!body || !body.name) {

                return response(400, {
                    message: "Task name is required"
                });
            }

            const task = {

                id: Date.now().toString(),

                name: body.name,

                completed: false,

                createdAt:
                    new Date().toISOString()
            };


            await dynamoDB.put({
                TableName: TABLE_NAME,
                Item: task
            }).promise();


            return response(201, task);
        }


        /* PUT - Update task */

        if (method === "PUT") {

            const body =
                typeof event.body === "string"
                    ? JSON.parse(event.body)
                    : event.body;

            await dynamoDB.update({

                TableName: TABLE_NAME,

                Key: {
                    id: body.id
                },

                UpdateExpression:
                    "SET #name = :name, completed = :completed",

                ExpressionAttributeNames: {
                    "#name": "name"
                },

                ExpressionAttributeValues: {
                    ":name": body.name,
                    ":completed": body.completed
                },

                ReturnValues: "ALL_NEW"

            }).promise();


            return response(200, {
                message: "Task updated successfully"
            });
        }


        /* DELETE - Delete task */

        if (method === "DELETE") {

            const body =
                typeof event.body === "string"
                    ? JSON.parse(event.body)
                    : event.body;

            await dynamoDB.delete({

                TableName: TABLE_NAME,

                Key: {
                    id: body.id
                }

            }).promise();


            return response(200, {
                message: "Task deleted successfully"
            });
        }


        return response(405, {
            message: "Method not allowed"
        });

    }

    catch (error) {

        console.error(error);

        return response(500, {
            message: "Internal server error",
            error: error.message
        });
    }
};


/* ---------------- RESPONSE ---------------- */

function response(statusCode, body) {

    return {

        statusCode: statusCode,

        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type",
            "Access-Control-Allow-Methods":
                "GET,POST,PUT,DELETE,OPTIONS"
        },

        body: JSON.stringify(body)
    };
}