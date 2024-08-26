export function storeToken(userId, token, role) {
  let tokens = JSON.parse(localStorage.getItem("tokens")) || {};
  tokens[userId] = { token, role };
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

export function removeToken(userId) {
  let tokens = JSON.parse(localStorage.getItem("tokens")) || {};
  delete tokens[userId];
  localStorage.setItem("tokens", JSON.stringify(tokens));
}

export function getTokens() {
  return JSON.parse(localStorage.getItem("tokens")) || {};
}

export function isCustomerLoggedIn() {
  const tokens = getTokens();
  return Object.values(tokens).some((t) => t.role === "customer");
}

export function isOwnerLoggedIn() {
  const tokens = getTokens();
  return Object.values(tokens).some((t) => t.role === "owner");
}

export function getCustomerToken() {
  const tokens = getTokens();
  const customerToken = Object.values(tokens).find(
    (t) => t.role === "customer"
  );
  return customerToken ? customerToken.token : null;
}

export function getOwnerToken() {
  const tokens = getTokens();
  const ownerToken = Object.values(tokens).find((t) => t.role === "owner");
  return ownerToken ? ownerToken.token : null;
}

export function isUserLoggedIn() {
  const tokens = getTokens();
  return Object.keys(tokens).length > 0;
}

export function getCurrentUserRole() {
  const tokens = getTokens();
  const currentUser = Object.values(tokens)[0];
  return currentUser ? currentUser.role : null;
}

export function getCurrentUserToken() {
  const tokens = getTokens();
  const currentUser = Object.values(tokens)[0];
  return currentUser ? currentUser.token : null;
}
