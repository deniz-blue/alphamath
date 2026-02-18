import type {} from "@atcute/lexicons";
import * as v from "@atcute/lexicons/validations";
import type {} from "@atcute/lexicons/ambient";

const _didLinkSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("blue.deniz.poly.relationship#didLink"),
  ),
  did: /*#__PURE__*/ v.didString(),
});
const _mainSchema = /*#__PURE__*/ v.record(
  /*#__PURE__*/ v.tidString(),
  /*#__PURE__*/ v.object({
    $type: /*#__PURE__*/ v.literal("blue.deniz.poly.relationship"),
    createdAt: /*#__PURE__*/ v.datetimeString(),
    get subject() {
      return /*#__PURE__*/ v.variant([didLinkSchema, recordLinkSchema]);
    },
  }),
);
const _recordLinkSchema = /*#__PURE__*/ v.object({
  $type: /*#__PURE__*/ v.optional(
    /*#__PURE__*/ v.literal("blue.deniz.poly.relationship#recordLink"),
  ),
  did: /*#__PURE__*/ v.resourceUriString(),
});

type didLink$schematype = typeof _didLinkSchema;
type main$schematype = typeof _mainSchema;
type recordLink$schematype = typeof _recordLinkSchema;

export interface didLinkSchema extends didLink$schematype {}
export interface mainSchema extends main$schematype {}
export interface recordLinkSchema extends recordLink$schematype {}

export const didLinkSchema = _didLinkSchema as didLinkSchema;
export const mainSchema = _mainSchema as mainSchema;
export const recordLinkSchema = _recordLinkSchema as recordLinkSchema;

export interface DidLink extends v.InferInput<typeof didLinkSchema> {}
export interface Main extends v.InferInput<typeof mainSchema> {}
export interface RecordLink extends v.InferInput<typeof recordLinkSchema> {}

declare module "@atcute/lexicons/ambient" {
  interface Records {
    "blue.deniz.poly.relationship": mainSchema;
  }
}
