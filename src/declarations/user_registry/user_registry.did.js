export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Principal;
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const UserProfile = IDL.Record({
    'id' : UserId,
    'username' : IDL.Opt(IDL.Text),
    'displayName' : IDL.Opt(IDL.Text),
    'verifiedTwitter' : IDL.Bool,
    'socialLinks' : IDL.Opt(
      IDL.Record({
        'twitter' : IDL.Opt(IDL.Text),
        'discord' : IDL.Opt(IDL.Text),
        'github' : IDL.Opt(IDL.Text),
      })
    ),
    'createdAt' : IDL.Int,
    'agents' : IDL.Vec(IDL.Text),
    'verifiedWebsite' : IDL.Bool,
    'avatarUrl' : IDL.Opt(IDL.Text),
  });
  const TokenHolding = IDL.Record({
    'staked' : IDL.Nat,
    'tokenId' : IDL.Text,
    'balance' : IDL.Nat,
  });
  return IDL.Service({
    'addUserAgent' : IDL.Func([UserId, IDL.Text], [Result], []),
    'getAllVerifiedTwitterHandles' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal))],
        ['query'],
      ),
    'getAllVerifiedWebsites' : IDL.Func(
        [],
        [IDL.Vec(IDL.Tuple(IDL.Text, IDL.Principal))],
        ['query'],
      ),
    'getProfile' : IDL.Func([UserId], [IDL.Opt(UserProfile)], ['query']),
    'getUserTokens' : IDL.Func([UserId], [IDL.Vec(TokenHolding)], []),
    'getUsersByAgent' : IDL.Func([IDL.Text], [IDL.Vec(UserProfile)], ['query']),
    'initialize' : IDL.Func([IDL.Principal], [], []),
    'removeUserAgent' : IDL.Func([UserId, IDL.Text], [Result], []),
    'setTokenFactoryCanisterId' : IDL.Func([IDL.Text], [], []),
    'updateProfile' : IDL.Func([UserProfile], [Result], []),
    'verifyTwitter' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
    'verifyWebsite' : IDL.Func([IDL.Text, IDL.Text], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
