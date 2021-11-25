import {
  Bytes,
  ipfs,
  json,
  JSONValue,
  JSONValueKind,
  TypedMap,
} from "@graphprotocol/graph-ts";
import { decode } from "as-base64";
import { parseUrl, CustomURL } from "./utils/urlParse";

const handleTokenURL = (url: CustomURL): TypedMap<string, JSONValue> | null => {
  if (url.protocol === "ipfs:") {
    const ipfsHash = url.pathname.slice(2);
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
  
  if (uri.startsWith("data:application/json;base64,")) {
    const decoded = decode(uri.replace("data:application/json;base64,", ""));
    const potentialResult = json.try_fromBytes(Bytes.fromUint8Array(decoded));
    return potentialResult.isOk ? potentialResult.value.toObject() : null;
  }
  return null;
};

export const jsonToString = (val: JSONValue | null): string | null => {
  if (val != null && val.kind === JSONValueKind.STRING) {
    return val.toString();
  }
  return null;
};
