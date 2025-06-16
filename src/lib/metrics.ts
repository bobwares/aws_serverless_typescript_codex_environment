import { CloudWatchClient, PutMetricDataCommand } from '@aws-sdk/client-cloudwatch';
import { captureAWSv3Client } from 'aws-xray-sdk-core';

const cw = captureAWSv3Client(new CloudWatchClient({ region: process.env.AWS_REGION || 'us-east-1' }));

export async function recordDuration(start: number): Promise<void> {
  if (process.env.JEST_WORKER_ID) return;
  const duration = Date.now() - start;
  await cw.send(
    new PutMetricDataCommand({
      Namespace: 'CustomerAPI',
      MetricData: [
        { MetricName: 'CustomerOpsDuration', Value: duration, Unit: 'Milliseconds' },
      ],
    }),
  );
}
