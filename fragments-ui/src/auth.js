// src/auth.js

// Load OIDC library from global window
const { UserManager } = window.oidcClient;

// ==== Your AWS Cognito Details ==== //
const poolId   = "us-east-1_0y76HCUmy";
const clientId = "723epp6f2na7ggpvgd0r1s0l55";
const domain   = "https://us-east-10y76hcumy.auth.us-east-1.amazoncognito.com";

// UI URL (EC2)
const redirect = "http://18.207.128.92";

// ================================== //

const region = poolId.split('_')[0];
const issuer = `https://cognito-idp.${region}.amazonaws.com/${poolId}`;

const metadataSeed = {
  issuer,
  authorization_endpoint: `${domain}/oauth2/authorize`,
  token_endpoint:         `${domain}/oauth2/token`,
  userinfo_endpoint:      `${domain}/oauth2/userInfo`,
  revocation_endpoint:    `${domain}/oauth2/revoke`,
  end_session_endpoint:   `${domain}/logout`,
  jwks_uri:               `${issuer}/.well-known/jwks.json`
};

export const userManager = new UserManager({
  authority: issuer,
  metadataSeed,
  client_id: clientId,
  redirect_uri: redirect,
  response_type: "code",
  scope: "openid email profile",
  automaticSilentRenew: false,
});

// Format the user object
function formatUser(user) {
  return {
    username: user?.profile?.["cognito:username"],
    email: user?.profile?.email,
    idToken: user?.id_token,
    accessToken: user?.access_token,
  };
}

export function signIn() {
  return userManager.signinRedirect();
}

export function signOut() {
  return userManager.signoutRedirect();
}

export async function getUser() {
  if (window.location.search.includes("code=")) {
    const user = await userManager.signinCallback();
    window.history.replaceState({}, document.title, window.location.pathname);
    return formatUser(user);
  }
  const user = await userManager.getUser();
  return user ? formatUser(user) : null;
}

// Return access token
export async function getAccessToken() {
  const user = await userManager.getUser();
  return user ? user.access_token : null;
}
