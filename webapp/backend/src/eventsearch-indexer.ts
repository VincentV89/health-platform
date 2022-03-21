import { EventDetail } from "./common/types/API";
import { HealthPlatformEventOpenSearchClient } from "./opensearch/search-client";


export const handler = (event: any = {}, context: any, callback: any) => {
    console.log('Event: ', JSON.stringify(event, null));
    const endpoint = process.env['OPENSEARCH_ENDPOINT'];

    const osClient = new HealthPlatformEventOpenSearchClient(endpoint);
    var promises: Promise<any>[] = [];

    event.Records.forEach(function (record: { eventID: any; eventName: any; dynamodb: any; }) {
        console.log(record.eventID);
        console.log(record.eventName);
        console.log('DynamoDB Record: %j', record.dynamodb);

        // var index = record.dynamodb.NewImage["user_id"]["S"];
        // var id = record.dynamodb.NewImage["event_id"]["S"];
        // var mood = record.dynamodb.NewImage["mood"]["S"];
        // var med = record.dynamodb.NewImage["medication"]["S"];
        // var food = record.dynamodb.NewImage["food"]["S"];
        // var start = record.dynamodb.NewImage["start_date_time"]["S"];
        // var end = record.dynamodb.NewImage["end_date_time"]["S"];

        //TODO - implement index deletion
        if (record.eventName == 'REMOVE') return;

        if (record.eventName == 'INSERT') {
            const image = record.dynamodb.NewImage;
            const doc: EventDetail = {
                user_id: image["user_id"]["S"],
                event_id: image["event_id"]["S"],
                mood: image["mood"]["S"],
                medication: image["medication"]["S"],
                food: image["food"]["S"],
                start_date_time: image["start_date_time"]["S"],
                end_date_time: image["end_date_time"]["S"],
                __typename: "EventDetail"
            }

            promises.push(osClient.indexDocument(doc));
        }


        Promise.all(promises).then((res) => {
            console.log(JSON.stringify(res, null));
        }).catch(error => {
            console.error(error.message)
        });;

        return { status: 200, res: "successful" }

    });
};