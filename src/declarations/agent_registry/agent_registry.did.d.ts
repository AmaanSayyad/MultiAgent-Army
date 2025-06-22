import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Agent {
  'revenueSplit' : [] | [RevenueSplit],
  'metrics' : [] | [Metrics],
  'saleCanisterId' : [] | [CanisterId],
  'totalSupply' : [] | [bigint],
  'tokenDistribution' : [] | [TokenDistribution],
  'teamMembers' : Array<TeamMember>,
  'vestingSchedule' : [] | [VestingSchedule],
  'details' : AgentDetails,
  'launchDate' : [] | [bigint],
}
export interface AgentDetails {
  'id' : AgentId,
  'agentOverview' : string,
  'ticker' : string,
  'tokenId' : [] | [TokenId],
  'shortPitch' : string,
  'websiteUrl' : [] | [string],
  'owner' : Principal,
  'name' : string,
  'createdAt' : bigint,
  'tags' : Array<string>,
  'framework' : string,
  'twitterUrl' : [] | [string],
  'agentType' : string,
  'imageUrl' : [] | [string],
  'category' : string,
  'launchType' : LaunchType,
  'canisterId' : [] | [CanisterId],
}
export type AgentId = string;
export type CanisterId = string;
export type LaunchType = { 'existing' : null } |
  { 'genesis' : null } |
  { 'standard' : null };
export interface Metrics {
  'stakingApr' : number,
  'totalUsage' : bigint,
  'totalUsers' : bigint,
  'totalRevenue' : number,
}
export type Result = { 'ok' : null } |
  { 'err' : string };
export type Result_1 = { 'ok' : AgentId } |
  { 'err' : string };
export interface RevenueSplit {
  'stakers' : number,
  'builder' : number,
  'treasury' : number,
}
export interface TeamMember {
  'id' : string,
  'bio' : [] | [string],
  'socialLinks' : [] | [
    {
      'linkedin' : [] | [string],
      'twitter' : [] | [string],
      'github' : [] | [string],
    }
  ],
  'name' : string,
  'role' : string,
  'expertise' : Array<string>,
  'avatarUrl' : [] | [string],
  'wallet' : [] | [string],
}
export interface TokenDistribution {
  'publicSale' : number,
  'liquidityPool' : number,
  'developer' : number,
}
export type TokenId = string;
export interface VestingSchedule {
  'developerMonths' : bigint,
  'publicSaleMonths' : bigint,
  'liquidityPoolMonths' : bigint,
}
export interface _SERVICE {
  'createAgent' : ActorMethod<
    [
      AgentDetails,
      Array<TeamMember>,
      [] | [TokenDistribution],
      [] | [VestingSchedule],
      [] | [bigint],
      [] | [bigint],
    ],
    Result_1
  >,
  'deleteAgent' : ActorMethod<[AgentId], Result>,
  'getAgent' : ActorMethod<[AgentId], [] | [Agent]>,
  'getAgentsByOwner' : ActorMethod<[Principal], Array<Agent>>,
  'getAllAgents' : ActorMethod<[], Array<Agent>>,
  'initialize' : ActorMethod<[Principal], undefined>,
  'setAgentToken' : ActorMethod<[AgentId, TokenId, CanisterId], Result>,
  'setSaleCanister' : ActorMethod<[AgentId, CanisterId], Result>,
  'updateAgent' : ActorMethod<[AgentId, Agent], Result>,
  'updateAgentMetrics' : ActorMethod<[AgentId, Metrics], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
