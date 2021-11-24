import { ERC721 } from "../generated/schema";
import { Transfer, ERC721 as ERC721Contract } from "../generated/ERC721/ERC721";
import { jsonToString, parseTokenURI } from "./parsing";

// @todo Add collection schema and create a collection for each contract

export function handleTransfer(event: Transfer): void {
  const tokenId = event.params.tokenId;
  const tokenAddress = event.address;
  const contract = ERC721Contract.bind(tokenAddress);
  let id = `${tokenAddress.toHex()}_${tokenId}`;
  let token = ERC721.load(id);
  if (token == null) {
    token = new ERC721(id);
    token.tokenId = tokenId;
    token.address = tokenAddress;
    const name = contract.try_name();
    token.name = !name.reverted ? name.value : null;
    const symbol = contract.try_symbol();
    token.symbol = !symbol.reverted ? symbol.value : null;
  }
  token.owner = event.params.to;
  const result = contract.try_tokenURI(tokenId);
  const uri = !result.reverted ? result.value : null;
  token.uri = uri;
  // @todo Can this be cleaned up more?
  if (uri) {
    const parsedUri = parseTokenURI(uri);
    if (parsedUri) {
      token.image = jsonToString(parsedUri.get("image"));
      token.name = jsonToString(parsedUri.get("name"));
      token.description = jsonToString(parsedUri.get("description"));
    }
  }
  token.save();
}
