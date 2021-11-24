import {
  ipfs,
  json,
  JSONValue,
  JSONValueKind,
  TypedMap,
} from "@graphprotocol/graph-ts";
import { parseUrl, CustomURL } from "./utils/urlParse";

const handleTokenURL = (url: CustomURL): TypedMap<string, JSONValue> | null => {
  if (url.protocol === "ipfs:") {
    const ipfsHash = url.pathname.slice(2);
    // @todo Figure out if path should be included?
    const bytes = ipfs.cat(ipfsHash);
    if (!bytes) {
      return null;
    }
    const potentialResult = json.try_fromBytes(bytes);
    return potentialResult.isOk ? potentialResult.value.toObject() : null;
  }

  // @todo Handle HTTP(s)
  return null;
};

export const parseTokenURI = (
  uri: string
): TypedMap<string, JSONValue> | null => {
  const url = parseUrl(uri);

  if (url) {
    return handleTokenURL(url);
  }
  // @todo Decode Base64
  return null;
};

export const jsonToString = (val: JSONValue | null): string | null => {
  if (val != null && val.kind === JSONValueKind.STRING) {
    return val.toString();
  }
  return null;
};
