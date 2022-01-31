import { DocumentClient } from "aws-sdk/clients/dynamodb";

export type MetricsData = {
    "patient_id": string;
    "sensor_id": string;
    "timestamp": string;
    "ttl"?: number;
    "measure_type": string;
    "measure_value": string;
};

export class MetricsDataDao {
    db: DocumentClient

    constructor(db: DocumentClient) {
        this.db = db;
    }

    /**
     * Saves one or more metrics datapoints
     * 
     * @param datapoints The datapoints
     */
    async saveMetrics(datapoints: MetricsData[]): Promise<void> {
        const writeObjects: any[] = [];
        for (var datapoint of datapoints) {
            writeObjects.push({
                PutRequest: {
                    Item: datapoint,
                }
            })
        }

        await this.db
            .batchWrite({
                RequestItems: {
                    [process.env.DATA_TABLE_NAME!]: writeObjects,
                },
            })
            .promise();
    }
}
