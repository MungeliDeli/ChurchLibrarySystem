function responseOk(data) {
  return { ok: true, data };
}
function responseErr(message) {
  return { ok: false, message };
}

export async function register({ name, email, password }) {
  try {
    await new Promise((r) => setTimeout(r, 500));
    if (!name || !email || !password) return responseErr("Missing fields");
    return responseOk({ user: { name, email } });
  } catch (e) {
    return responseErr("Registration failed");
  }
}

export async function login({ email, password }) {
  try {
    await new Promise((r) => setTimeout(r, 500));
    if (!email || !password) return responseErr("Missing credentials");
    return responseOk({ user: { email } });
  } catch (e) {
    return responseErr("Login failed");
  }
}

export async function googleSignIn() {
  try {
    await new Promise((r) => setTimeout(r, 500));
    return responseOk({ user: { provider: "google" } });
  } catch (e) {
    return responseErr("Google sign-in failed");
  }
}
