export const idlFactory = ({ IDL }) => {
  const AgentId = IDL.Text;
  const TokenId = IDL.Text;
  const LaunchType = IDL.Variant({
    'existing' : IDL.Null,
    'genesis' : IDL.Null,
    'standard' : IDL.Null,
  });
  const CanisterId = IDL.Text;
  const AgentDetails = IDL.Record({
    'id' : AgentId,
    'agentOverview' : IDL.Text,
    'ticker' : IDL.Text,
    'tokenId' : IDL.Opt(TokenId),
    'shortPitch' : IDL.Text,
    'websiteUrl' : IDL.Opt(IDL.Text),
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'createdAt' : IDL.Int,
    'tags' : IDL.Vec(IDL.Text),
    'framework' : IDL.Text,
    'twitterUrl' : IDL.Opt(IDL.Text),
    'agentType' : IDL.Text,
    'imageUrl' : IDL.Opt(IDL.Text),
    'category' : IDL.Text,
    'launchType' : LaunchType,
    'canisterId' : IDL.Opt(CanisterId),
  });
  const TeamMember = IDL.Record({
    'id' : IDL.Text,
    'bio' : IDL.Opt(IDL.Text),
    'socialLinks' : IDL.Opt(
      IDL.Record({
        'linkedin' : IDL.Opt(IDL.Text),
        'twitter' : IDL.Opt(IDL.Text),
        'github' : IDL.Opt(IDL.Text),
      })
    ),
    'name' : IDL.Text,
    'role' : IDL.Text,
    'expertise' : IDL.Vec(IDL.Text),
    'avatarUrl' : IDL.Opt(IDL.Text),
    'wallet' : IDL.Opt(IDL.Text),
  });
  const TokenDistribution = IDL.Record({
    'publicSale' : IDL.Float64,
    'liquidityPool' : IDL.Float64,
    'developer' : IDL.Float64,
  });
  const VestingSchedule = IDL.Record({
    'developerMonths' : IDL.Nat,
    'publicSaleMonths' : IDL.Nat,
    'liquidityPoolMonths' : IDL.Nat,
  });
  const Result_1 = IDL.Variant({ 'ok' : AgentId, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const RevenueSplit = IDL.Record({
    'stakers' : IDL.Float64,
    'builder' : IDL.Float64,
    'treasury' : IDL.Float64,
  });
  const Metrics = IDL.Record({
    'stakingApr' : IDL.Float64,
    'totalUsage' : IDL.Nat,
    'totalUsers' : IDL.Nat,
    'totalRevenue' : IDL.Float64,
  });
  const Agent = IDL.Record({
    'revenueSplit' : IDL.Opt(RevenueSplit),
    'metrics' : IDL.Opt(Metrics),
    'saleCanisterId' : IDL.Opt(CanisterId),
    'totalSupply' : IDL.Opt(IDL.Nat),
    'tokenDistribution' : IDL.Opt(TokenDistribution),
    'teamMembers' : IDL.Vec(TeamMember),
    'vestingSchedule' : IDL.Opt(VestingSchedule),
    'details' : AgentDetails,
    'launchDate' : IDL.Opt(IDL.Int),
  });
  return IDL.Service({
    'createAgent' : IDL.Func(
        [
          AgentDetails,
          IDL.Vec(TeamMember),
          IDL.Opt(TokenDistribution),
          IDL.Opt(VestingSchedule),
          IDL.Opt(IDL.Nat),
          IDL.Opt(IDL.Int),
        ],
        [Result_1],
        [],
      ),
    'deleteAgent' : IDL.Func([AgentId], [Result], []),
    'getAgent' : IDL.Func([AgentId], [IDL.Opt(Agent)], ['query']),
    'getAgentsByOwner' : IDL.Func([IDL.Principal], [IDL.Vec(Agent)], ['query']),
    'getAllAgents' : IDL.Func([], [IDL.Vec(Agent)], ['query']),
    'initialize' : IDL.Func([IDL.Principal], [], []),
    'setAgentToken' : IDL.Func([AgentId, TokenId, CanisterId], [Result], []),
    'setSaleCanister' : IDL.Func([AgentId, CanisterId], [Result], []),
    'updateAgent' : IDL.Func([AgentId, Agent], [Result], []),
    'updateAgentMetrics' : IDL.Func([AgentId, Metrics], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
