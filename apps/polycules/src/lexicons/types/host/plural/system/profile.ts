import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.literal("self"),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("host.plural.system.profile"),
    /**
     * Avatar image blob.
     * @accept image/png, image/jpeg, image/webp, image/gif
     * @maxSize 1000000
     */
    avatar: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.blob()),
    /**
     * System colour (hex format, e.g. '#ff6b6b').
     * @maxLength 7
     */
    colour: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 7),
      ]),
    ),
    /**
     * When the record was created (ISO 8601).
     */
    createdAt: /*#__PURE__*/ v.datetimeString(),
    /**
     * System description/bio.
     * @maxLength 2560
     */
    description: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 2560),
      ]),
    ),
    /**
     * Display name for the system.
     * @maxLength 640
     */
    displayName: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 640),
      ]),
    ),
    /**
     * System pronouns.
     * @maxLength 100
     */
    pronouns: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 100),
      ]),
    ),
  }),
);

type main$schematype = typeof _mainSchema;

export interface mainSchema extends main$schematype {}

export const mainSchema = _mainSchema as mainSchema;

export interface Main extends v.InferInput<typeof mainSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "host.plural.system.profile": mainSchema;
  }
}
