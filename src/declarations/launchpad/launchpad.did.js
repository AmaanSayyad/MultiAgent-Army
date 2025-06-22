export const idlFactory = ({ IDL }) => {
  const SaleId = IDL.Text;
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const TokenId = IDL.Text;
  const AgentId = IDL.Text;
  const LaunchType = IDL.Variant({
    'genesis' : IDL.Null,
    'standard' : IDL.Null,
  });
  const Result_1 = IDL.Variant({ 'ok' : SaleId, 'err' : IDL.Text });
  const SaleStatus = IDL.Variant({
    'active' : IDL.Null,
    'upcoming' : IDL.Null,
    'ended' : IDL.Null,
    'successful' : IDL.Null,
    'failed' : IDL.Null,
  });
  const TokenSale = IDL.Record({
    'id' : SaleId,
    'startTime' : IDL.Int,
    'status' : SaleStatus,
    'participants' : IDL.Vec(IDL.Tuple(IDL.Principal, IDL.Nat)),
    'softCap' : IDL.Nat,
    'tokenId' : TokenId,
    'minPurchase' : IDL.Nat,
    'endTime' : IDL.Int,
    'owner' : IDL.Principal,
    'maxPurchase' : IDL.Nat,
    'agentId' : AgentId,
    'armyRequired' : IDL.Nat,
    'hardCap' : IDL.Nat,
    'raised' : IDL.Nat,
    'launchType' : LaunchType,
    'price' : IDL.Nat,
  });
  const CanisterId = IDL.Text;
  return IDL.Service({
    'buyTokens' : IDL.Func([SaleId, IDL.Nat], [Result], []),
    'claimTokens' : IDL.Func([SaleId], [Result], []),
    'commitToGenesisSale' : IDL.Func([SaleId, IDL.Nat], [Result], []),
    'createSale' : IDL.Func(
        [
          TokenId,
          AgentId,
          LaunchType,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
          IDL.Int,
          IDL.Int,
          IDL.Nat,
          IDL.Nat,
          IDL.Nat,
        ],
        [Result_1],
        [],
      ),
    'finalizeSale' : IDL.Func([SaleId], [Result], []),
    'getActiveSales' : IDL.Func([], [IDL.Vec(TokenSale)], ['query']),
    'getSale' : IDL.Func([SaleId], [IDL.Opt(TokenSale)], ['query']),
    'getSalesByStatus' : IDL.Func(
        [SaleStatus],
        [IDL.Vec(TokenSale)],
        ['query'],
      ),
    'getTotalPointsPledged' : IDL.Func([SaleId], [IDL.Nat], ['query']),
    'getUserCommitments' : IDL.Func(
        [IDL.Principal],
        [IDL.Vec(IDL.Tuple(SaleId, IDL.Nat))],
        ['query'],
      ),
    'getUserPointPledges' : IDL.Func(
        [SaleId, IDL.Principal],
        [IDL.Nat],
        ['query'],
      ),
    'initialize' : IDL.Func([IDL.Principal], [], []),
    'pledgePoints' : IDL.Func([SaleId, IDL.Nat], [Result], []),
    'setCanisterIds' : IDL.Func(
        [IDL.Opt(CanisterId), IDL.Opt(CanisterId), IDL.Opt(CanisterId)],
        [],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
