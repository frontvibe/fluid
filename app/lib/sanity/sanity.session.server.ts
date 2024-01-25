import type {Session, SessionStorage} from '@shopify/remix-oxygen';

import {createCookieSessionStorage} from '@shopify/remix-oxygen';

export class SanitySession {
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
        name: 'sanityPreview',
        // samesite must be none so Sanity Studio can access the cookie
        sameSite: 'none',
        secrets,
        secure: true,
      },
    });

    const session = await storage.getSession(request.headers.get('Cookie'));

    return new this(storage, session);
  }

  commit() {
    return this.#sessionStorage.commitSession(this.#session);
  }

  destroy() {
    return this.#sessionStorage.destroySession(this.#session);
  }

  get has() {
    return this.#session.has;
  }

  get set() {
    return this.#session.set;
  }
}
