import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { ApiError } from 'next/dist/server/api-utils';
import { ZodError } from 'zod';

type Middleware = (req: NextApiRequest, res: NextApiResponse) => unknown;

function getZodErrorResponse(error: ZodError) {
  const fields = error.issues.reduce((acc, issue) => {
    const { path, message } = issue;
    acc[path.join('.')] = message;
    return acc;
  }, {});
  return {
    message: 'Invalid fields',
    fields,
  };
}

function getErrorStatus(error: unknown) {
  if (error instanceof ApiError) return error.statusCode;
  return 500;
}

function getErrorResponse(error: unknown) {
  if (error instanceof ApiError) return { message: error.message };
  if (error instanceof ZodError) return getZodErrorResponse(error);
  return { message: 'Internal Server Error' };
}

export function withMiddleware(...middlewares: NextApiHandler[]) {
  return async function withMiddlewareHandler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    async function evaluateHandler(middleware: Middleware) {
      if (res.headersSent) return;

      try {
        await middleware(req, res);
      } catch (error) {
        console.error(error);
        res.status(getErrorStatus(error)).json(getErrorResponse(error));
      }
    }

    for await (const middleware of middlewares) {
      await evaluateHandler(middleware);
    }
  };
}
