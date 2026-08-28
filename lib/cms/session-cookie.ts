/**
 * Cookie that proves the website editor is signed in.
 *
 * Kept in its own file so the Worker cache layer can read the name without
 * pulling Web Crypto or the rest of the CMS auth code into the startup path.
 */
export const CMS_SESSION_COOKIE = "nhy_cms_session";
