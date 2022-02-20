import { addService, MiddlewareCreator } from "lambda-mdl";

export type Category = { name: string }

export type Hello = {
  getCategories: () => Category[];
}

export const hello: MiddlewareCreator<{ }, Hello, never> = () => {
  return async (request) => {
    return addService(request, {
      getCategories: () => ([
        { name: 'Black' },
        { name: 'Sweet' },
        { name: 'Cool' }
      ])
    })
  }
}