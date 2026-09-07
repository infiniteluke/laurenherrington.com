declare global {
  interface Env {
    IP_HASH_SALT?: string;
    /** Signs contact-form render timestamps; unset disables the timing check. */
    FORM_SECRET?: string;
    TURNSTILE_SITE_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
  }
}

export {};
