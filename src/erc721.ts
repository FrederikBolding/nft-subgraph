import { ERC721 } from "../generated/schema";
import { Transfer } from "../generated/templates/ERC721/ERC721";

export function handleTransfer(event: Transfer): void {
  const tokenId = event.params.tokenId;
  const tokenAddress = event.address;
  let id = `${tokenAddress.toHex()}_${tokenId}`;
  let token = ERC721.load(id);
  if (token == null) {
    token = new ERC721(id);
    token.tokenId = tokenId;
    token.address = tokenAddress;
  }
  token.owner = event.params.to;
  token.save();
}
