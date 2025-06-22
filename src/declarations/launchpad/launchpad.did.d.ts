import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type AgentId = string;
export type CanisterId = string;
export type LaunchType = { 'genesis' : null } |
  { 'standard' : null };
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : SaleId } |
  { 'err' : string };
export type SaleId = string;
export type SaleStatus = { 'active' : null } |
  { 'upcoming' : null } |
  { 'ended' : null } |
  { 'successful' : null } |
  { 'failed' : null };
export type TokenId = string;
export interface TokenSale {
  'id' : SaleId,
  'startTime' : bigint,
  'status' : SaleStatus,
  'participants' : Array<[Principal, bigint]>,
  'softCap' : bigint,
  'tokenId' : TokenId,
  'minPurchase' : bigint,
  'endTime' : bigint,
  'owner' : Principal,
  'maxPurchase' : bigint,
  'agentId' : AgentId,
  'armyRequired' : bigint,
  'hardCap' : bigint,
  'raised' : bigint,
  'launchType' : LaunchType,
  'price' : bigint,
}
export interface _SERVICE {
  pledgePoints: ActorMethod<[SaleId, bigint], Result>,
  getUserPointPledges: ActorMethod<[SaleId, Principal], bigint>,
  claimTokens: ActorMethod<[SaleId], Result>,
  pledgePoints: ActorMethod<[SaleId, bigint], Result>,
  getUserPointPledges: ActorMethod<[SaleId, Principal], bigint>,
  claimTokens: ActorMethod<[SaleId], Result>,
  pledgePoints: ActorMethod<[SaleId, bigint], Result>,
  getUserPointPledges: ActorMethod<[SaleId, Principal], bigint>,
  claimTokens: ActorMethod<[SaleId], Result>,
  pledgePoints: ActorMethod<[SaleId, bigint], Result>,
  getUserPointPledges: ActorMethod<[SaleId, Principal], bigint>,
  claimTokens: ActorMethod<[SaleId], Result>,
  pledgePoints: ActorMethod<[SaleId, bigint], Result>,
  getUserPointPledges: ActorMethod<[SaleId, Principal], bigint>,
  claimTokens: ActorMethod<[SaleId], Result>,
  'buyTokens' : ActorMethod<[SaleId, bigint], Result>,
  'claimTokens' : ActorMethod<[SaleId], Result>,
  'commitToGenesisSale' : ActorMethod<[SaleId, bigint], Result>,
  'createSale' : ActorMethod<
    [
      TokenId,
      AgentId,
      LaunchType,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
      bigint,
    ],
    Result_1
  >,
  'finalizeSale' : ActorMethod<[SaleId], Result>,
  'getActiveSales' : ActorMethod<[], Array<TokenSale>>,
  'getSale' : ActorMethod<[SaleId], [] | [TokenSale]>,
  'getSalesByStatus' : ActorMethod<[SaleStatus], Array<TokenSale>>,
  'getTotalPointsPledged' : ActorMethod<[SaleId], bigint>,
  'getUserCommitments' : ActorMethod<[Principal], Array<[SaleId, bigint]>>,
  'getUserPointPledges' : ActorMethod<[SaleId, Principal], bigint>,
  'initialize' : ActorMethod<[Principal], undefined>,
  'pledgePoints' : ActorMethod<[SaleId, bigint], Result>,
  'setCanisterIds' : ActorMethod<
    [[] | [CanisterId], [] | [CanisterId], [] | [CanisterId]],
    undefined
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
