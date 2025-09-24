import Cookies from "js-cookie";

const CSRF_TOKEN_NAME = "csrftoken";
const CSRF_TOKEN_HEADER = "X-CSRFToken";

function getCSRFToken(): string {
    const csrfToken = Cookies.get(CSRF_TOKEN_NAME);
    return csrfToken ?? "";
}

class CSRFHeaders extends Headers {
    constructor(init?: HeadersInit) {
        super(init);
        super.append(CSRF_TOKEN_HEADER, getCSRFToken());
    }
}

export {
    CSRF_TOKEN_HEADER, CSRF_TOKEN_NAME, CSRFHeaders, getCSRFToken
};
