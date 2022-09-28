import { defineHook } from '@directus/extensions-sdk';
import * as Sentry from "@sentry/node";
import * as Tracing from "@sentry/tracing";

export default defineHook(({ init},{env}) => {

	init('routes.before', ({app}) => {
		Sentry.init({
			dsn: env.SENTRY_DNS,
			integrations: [
			  // enable HTTP calls tracing
			  new Sentry.Integrations.Http({ tracing: true }),
			  // enable Express.js middleware tracing
			  new Tracing.Integrations.Express({ app }),
			],
		  
			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0,
		  });
		  
		  // RequestHandler creates a separate execution context using domains, so that every
		  // transaction/span/breadcrumb is attached to its own Hub instance
		  app.use(Sentry.Handlers.requestHandler());
		  // TracingHandler creates a trace for every incoming request
		  app.use(Sentry.Handlers.tracingHandler());
		
	});
	init('routes.custom.after',({app}) => {\
		app.use(Sentry.Handlers.errorHandler());
		
	});
});
