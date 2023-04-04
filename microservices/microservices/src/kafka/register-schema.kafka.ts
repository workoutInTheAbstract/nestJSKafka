import {
  COMPATIBILITY,
  readAVSCAsync,
  SchemaType,
} from "@kafkajs/confluent-schema-registry";

import { registry } from "./schema-registry.kafka";
import { KafkaTopics } from "./topics.kafka";
/**
 * This will create an AVRO schema from an .avsc file.
 * To evolve the schema you need only edit this file but to make sure to follow
 * the rules for the compatibility setting defined. E.G. removal of fields is acceptable and addition of new fields requires a default value.
 * https://docs.confluent.io/platform/current/schema-registry/avro.html#schema-evolution
 */
export const registerSchema = async (
  schemaPath: string
): Promise<number | undefined> => {
  // The subject name corresponds to the 'value' schema. Both the value and key of a message can have a schema.
  try {
    const schema = await readAVSCAsync(schemaPath);
    const stringifiedSchema = JSON.stringify(schema);
    const registeredSchema = await registry.register(
      { type: SchemaType.AVRO, schema: stringifiedSchema },
      { compatibility: COMPATIBILITY.BACKWARD, subject: KafkaTopics.ORDERED_HOTDOGS_SUBJECT }
    );
    const id = registeredSchema.id;
    return id;
  } catch (e) {
    console.log(`reached error`);
    console.log(e);
  }
};
