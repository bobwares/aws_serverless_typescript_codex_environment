import {
  CloudWatchClient,
  PutMetricDataCommand,
} from '@aws-sdk/client-cloudwatch';

const region = process.env.AWS_REGION;
const cw = region ? new CloudWatchClient({ region }) : null;

export async function recordDuration(metricName, ms) {
  if (!cw) return;
  await cw.send(
    new PutMetricDataCommand({
      Namespace: 'Custom',
      MetricData: [
        {
          MetricName: metricName,
          Value: ms,
          Unit: 'Milliseconds',
        },
      ],
    }),
  );
}
