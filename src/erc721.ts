import { ERC721 } from "../generated/schema";
import { Transfer, ERC721 as ERC721Contract } from "../generated/ERC721/ERC721";
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
    const name = contract.try_name()
    token.name = !name.reverted ? name.value : null;
    const symbol = contract.try_symbol();
    token.symbol = !symbol.reverted ? symbol.value : null;
  }
  token.owner = event.params.to;
  const uri = contract.try_tokenURI(tokenId);
  token.uri = !uri.reverted ? uri.value : null;
  token.save();
}
