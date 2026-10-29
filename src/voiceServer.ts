import z from "zod";

const voiceObjectId = z.string().min(1).max(128);

// mediasoup validates these itself
const mediasoupObject = z.record(z.string(), z.unknown());

export const voiceEnvelope = z.object({
  id: z.string().max(128),
  op: z.number().int(),
  data: z.unknown().optional(),
});

export const voiceCreateTransportData = z.object({
  direction: z.enum(["send", "receive"]),
});

export const voiceConnectTransportData = z.object({
  transportId: voiceObjectId,
  dtlsParameters: mediasoupObject,
});

export const voiceSetRtpCapabilitiesData = z.object({
  rtpCapabilities: mediasoupObject,
});

export const voiceProduceData = z.object({
  transportId: voiceObjectId,
  kind: z.enum(["audio", "video"]),
  rtpParameters: mediasoupObject,
  appData: z
    .object({
      mediaKind: z
        .enum(["audio", "camera", "screen", "screen-audio"])
        .optional()
        .catch(undefined),
      videoOrientation: z
        .union([z.literal(0), z.literal(90), z.literal(180), z.literal(270)])
        .optional()
        .catch(undefined),
    })
    .optional()
    .catch(undefined),
});

export const voiceProducerData = z.object({
  producerId: voiceObjectId,
});

export const voiceConsumerData = z.object({
  consumerId: voiceObjectId,
});
