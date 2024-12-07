import type {HydrogenSession} from '@shopify/hydrogen';
import type {Session, SessionStorage} from '@shopify/remix-oxygen';

import {createCookieSessionStorage} from '@shopify/remix-oxygen';

/**
 * This is a custom session implementation for your Hydrogen shop.
 * Feel free to customize it to your needs, add helper methods, or
 * swap out the cookie-based implementation with something else!
 */
export class AppSession implements HydrogenSession {
  public isPending = false;
  get flash() {
    return this.#session.flash;
  }
  get get() {
    return this.#session.get;
  }

  get has() {
    return this.#session.has;
  }

  get set() {
    this.isPending = true;
    return this.#session.set;
  }

  get unset() {
    this.isPending = true;
    return this.#session.unset;
  }

  #session;

  #sessionStorage;

  constructor(sessionStorage: SessionStorage, session: Session) {
    this.#sessionStorage = sessionStorage;
    this.#session = session;
  }

  static async init(request: Request, secrets: string[]) {
    const storage = createCookieSessionStorage({
      cookie: {
        httpOnly: true,
        name: 'session',
        path: '/',
        sameSite: 'lax',
        secrets,
      },
    });

    const session = await storage
      .getSession(request.headers.get('Cookie'))
      .catch(() => storage.getSession());

    return new this(storage, session);
  }

  commit() {
    this.isPending = false;
    return this.#sessionStorage.commitSession(this.#session);
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }
}
