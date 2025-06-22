export const idlFactory = ({ IDL }) => {
  const TokenConfig = IDL.Record({
    'fee' : IDL.Nat,
    'decimals' : IDL.Nat8,
    'owner' : IDL.Principal,
    'name' : IDL.Text,
    'totalSupply' : IDL.Nat,
    'symbol' : IDL.Text,
    'feeTo' : IDL.Principal,
  });
  const AgentId = IDL.Text;
  const TokenDistribution = IDL.Record({
    'publicSale' : IDL.Float64,
    'marketing' : IDL.Float64,
    'team' : IDL.Float64,
    'ecosystem' : IDL.Float64,
    'liquidityPool' : IDL.Float64,
    'developer' : IDL.Float64,
  });
  const VestingSchedule = IDL.Record({
    'developerMonths' : IDL.Nat,
    'marketingMonths' : IDL.Nat,
    'teamMonths' : IDL.Nat,
    'publicSaleMonths' : IDL.Nat,
    'liquidityPoolMonths' : IDL.Nat,
    'ecosystemMonths' : IDL.Nat,
  });
  const TokenId = IDL.Text;
  const Result_3 = IDL.Variant({ 'ok' : TokenId, 'err' : IDL.Text });
  const Time = IDL.Int;
  const CanisterId = IDL.Text;
  const TokenInfo = IDL.Record({
    'id' : TokenId,
    'createdAt' : Time,
    'agentId' : IDL.Opt(AgentId),
    'vestingSchedule' : IDL.Opt(VestingSchedule),
    'config' : TokenConfig,
    'distribution' : IDL.Opt(TokenDistribution),
    'canisterId' : CanisterId,
  });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Principal, 'err' : IDL.Text });
  const CanisterSettings = IDL.Record({
    'freezing_threshold' : IDL.Opt(IDL.Nat),
    'controllers' : IDL.Opt(IDL.Vec(IDL.Principal)),
    'memory_allocation' : IDL.Opt(IDL.Nat),
    'compute_allocation' : IDL.Opt(IDL.Nat),
  });
  const CanisterStatusResult = IDL.Record({
    'status' : IDL.Variant({
      'stopped' : IDL.Null,
      'stopping' : IDL.Null,
      'running' : IDL.Null,
    }),
    'memory_size' : IDL.Nat,
    'cycles' : IDL.Nat,
    'settings' : CanisterSettings,
    'module_hash' : IDL.Opt(IDL.Vec(IDL.Nat8)),
  });
  const Result_1 = IDL.Variant({
    'ok' : CanisterStatusResult,
    'err' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'createToken' : IDL.Func(
        [
          TokenConfig,
          IDL.Opt(AgentId),
          IDL.Opt(TokenDistribution),
          IDL.Opt(VestingSchedule),
        ],
        [Result_3],
        [],
      ),
    'createTokensBatch' : IDL.Func(
        [
          IDL.Vec(TokenConfig),
          IDL.Opt(IDL.Vec(IDL.Opt(AgentId))),
          IDL.Opt(IDL.Vec(IDL.Opt(TokenDistribution))),
          IDL.Opt(IDL.Vec(IDL.Opt(VestingSchedule))),
        ],
        [IDL.Vec(Result_3)],
        [],
      ),
    'getAllTokens' : IDL.Func([], [IDL.Vec(TokenInfo)], ['query']),
    'getToken' : IDL.Func([TokenId], [IDL.Opt(TokenInfo)], ['query']),
    'getTokenByAgent' : IDL.Func([AgentId], [IDL.Opt(TokenInfo)], ['query']),
    'getTokenCanisterId' : IDL.Func([TokenId], [Result_2], []),
    'getTokenCanisterStatus' : IDL.Func([TokenId], [Result_1], []),
    'getTokensByOwner' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(TokenInfo)],
        ['query'],
      ),
    'init' : IDL.Func([], [], []),
    'startTokenCanister' : IDL.Func([TokenId], [Result], []),
    'stopTokenCanister' : IDL.Func([TokenId], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
