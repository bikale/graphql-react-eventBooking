const inititalState = {
  token: null,
  userId: null,
  tokenExpiration: 0,
};

const reducer = (state = inititalState, action) => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        token: action.token,
        userId: action.userId,
        tokenExpiration: action.tokenExpiration,
      };
    case 'logout':
      return { ...state, token: null, userId: null, tokenExpiration: 0 };
    default:
      return { ...state };
  }
};

export default reducer;
