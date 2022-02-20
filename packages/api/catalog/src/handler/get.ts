'use strict';

import { creator, Handler, ok } from 'lambda-mdl';
import { Category, hello, Hello } from '../srv/categories';

type API = {
  categories: Category[],
};

const handle: Handler<Hello, API, never> = async (request) => {
  return ok({
    categories: request.service.getCategories(),
  });
};

export const handler = creator(hello).ok(handle).req();
