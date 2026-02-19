import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _customFieldSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("host.plural.system.member#customField"),
  ),
  /**
   * @maxLength 100
   */
  name: /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
    /*#__PURE__*/ v.stringLength(0, 100),
  ]),
  /**
   * @maxLength 500
   */
  value: /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
    /*#__PURE__*/ v.stringLength(0, 500),
  ]),
});
const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.tidString(),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("host.plural.system.member"),
    /**
     * Avatar image blob (plaintext for public, encrypted for private).
     * @accept image/png, image/jpeg, image/webp, image/gif, application/octet-stream
     * @maxSize 1000000
     */
    avatar: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.blob()),
    /**
     * Member bio/description. Only present for public members.
     * @maxLength 2560
     */
    bio: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 2560),
      ]),
    ),
    /**
     * Encrypted member data (IV + AES-256-GCM ciphertext). Only present for private members.
     */
    ciphertext: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.bytes()),
    /**
     * Member colour (hex format). Only present for public members.
     * @maxLength 7
     */
    colour: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 7),
      ]),
    ),
    /**
     * When the member was created (ISO 8601).
     */
    createdAt: /*#__PURE__*/ v.datetimeString(),
    /**
     * Custom profile fields. Only present for public members.
     * @maxLength 25
     */
    get customFields() {
      return /*#__PURE__*/ v.optional(
        /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.array(customFieldSchema), [
          /*#__PURE__*/ v.arrayLength(0, 25),
        ]),
      );
    },
    /**
     * Optional DID associated with this member. Must match a host.plural.system.link record for the link to be valid. Only set on public members.
     * @maxLength 2048
     */
    did: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 2048),
      ]),
    ),
    /**
     * Display name. Only present for public members.
     * @maxLength 640
     */
    displayName: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 640),
      ]),
    ),
    /**
     * Member name/identifier. Only present for public members.
     * @maxLength 200
     */
    name: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 200),
      ]),
    ),
    /**
     * Member pronouns. Only present for public members.
     * @maxLength 100
     */
    pronouns: /*#__PURE__*/ v.optional(
      /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
        /*#__PURE__*/ v.stringLength(0, 100),
      ]),
    ),
    /**
     * Proxy tags for message proxying. Only present for public members.
     * @maxLength 10
     */
    get proxyTags() {
      return /*#__PURE__*/ v.optional(
        /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.array(proxyTagSchema), [
          /*#__PURE__*/ v.arrayLength(0, 10),
        ]),
      );
    },
    /**
     * When the member was last updated (ISO 8601).
     */
    updatedAt: /*#__PURE__*/ v.optional(/*#__PURE__*/ v.datetimeString()),
    /**
     * Visibility setting. Private members store data in ciphertext only.
     */
    visibility: /*#__PURE__*/ v.string<"private" | "public" | (string & {})>(),
  }),
);
const _proxyTagSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("host.plural.system.member#proxyTag"),
  ),
  /**
   * @maxLength 50
   */
  prefix: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
      /*#__PURE__*/ v.stringLength(0, 50),
    ]),
  ),
  /**
   * @maxLength 50
   */
  suffix: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.constrain(/*#__PURE__*/ v.string(), [
      /*#__PURE__*/ v.stringLength(0, 50),
    ]),
  ),
});

type customField$schematype = typeof _customFieldSchema;
type main$schematype = typeof _mainSchema;
type proxyTag$schematype = typeof _proxyTagSchema;

export interface customFieldSchema extends customField$schematype {}
export interface mainSchema extends main$schematype {}
export interface proxyTagSchema extends proxyTag$schematype {}

export const customFieldSchema = _customFieldSchema as customFieldSchema;
export const mainSchema = _mainSchema as mainSchema;
export const proxyTagSchema = _proxyTagSchema as proxyTagSchema;

export interface CustomField extends v.InferInput<typeof customFieldSchema> {}
export interface Main extends v.InferInput<typeof mainSchema> {}
export interface ProxyTag extends v.InferInput<typeof proxyTagSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "host.plural.system.member": mainSchema;
  }
}
