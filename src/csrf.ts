import { reduxStore } from "./reduxStore";
import SITE_URL from "./site";
import { setCSRFToken } from "./slices/csrfTokenReducer";

const CSRF_TOKEN_NAME = "csrftoken";
const CSRF_TOKEN_HEADER = "X-CSRFToken";

function getCSRFToken(): string {
    const state = reduxStore.getState().csrfToken;
    return state.value;
}

async function refreshCSRFToken(): Promise<string> {
    const res = await fetch(`${SITE_URL}/api/auth/token/csrf`, {
        method: 'GET',
        credentials: "include"
    });
    const data = await res.json();
    const csrfToken = data.csrftoken;
    reduxStore.dispatch(setCSRFToken(csrfToken));
    return csrfToken;
}

class CSRFHeaders extends Headers {
    constructor(init?: HeadersInit) {
        super(init);
        super.append(CSRF_TOKEN_HEADER, getCSRFToken());
    }
}

export {
    CSRF_TOKEN_HEADER, CSRF_TOKEN_NAME, CSRFHeaders, getCSRFToken, refreshCSRFToken
};
