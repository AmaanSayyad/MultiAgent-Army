import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export type Result = { 'ok' : null } |
  { 'err' : string };
export interface TokenHolding {
  'staked' : bigint,
  'tokenId' : string,
  'balance' : bigint,
}
export type UserId = Principal;
export interface UserProfile {
  'id' : UserId,
  'username' : [] | [string],
  'displayName' : [] | [string],
  'verifiedTwitter' : boolean,
  'socialLinks' : [] | [
    {
      'twitter' : [] | [string],
      'discord' : [] | [string],
      'github' : [] | [string],
    }
  ],
  'createdAt' : bigint,
  'agents' : Array<string>,
  'verifiedWebsite' : boolean,
  'avatarUrl' : [] | [string],
}
export interface _SERVICE {
  'addUserAgent' : ActorMethod<[UserId, string], Result>,
  'getAllVerifiedTwitterHandles' : ActorMethod<[], Array<[string, Principal]>>,
  'getAllVerifiedWebsites' : ActorMethod<[], Array<[string, Principal]>>,
  'getProfile' : ActorMethod<[UserId], [] | [UserProfile]>,
  'getUserTokens' : ActorMethod<[UserId], Array<TokenHolding>>,
  'getUsersByAgent' : ActorMethod<[string], Array<UserProfile>>,
  'initialize' : ActorMethod<[Principal], undefined>,
  'removeUserAgent' : ActorMethod<[UserId, string], Result>,
  'setTokenFactoryCanisterId' : ActorMethod<[string], undefined>,
  'updateProfile' : ActorMethod<[UserProfile], Result>,
  'verifyTwitter' : ActorMethod<[string, string], Result>,
  'verifyWebsite' : ActorMethod<[string, string], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
