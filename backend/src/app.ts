import Fastify from "fastify";
import cors from '@fastify/cors'
import {AuthPlugin} from "./plugins/auth.js";
import { FastifySearchHttpMethodPlugin } from "./plugins/http_search.js";
import { FastifyMikroOrmPlugin } from "./plugins/mikro.js";
import QuizRoutes from "./routes/routes.js";
import config from "./db/mikro-orm.config.js";

const envToLogger = {
	development: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
		level: "debug",
	},
	production: {
		level: "error"
	},
	test: {
		transport: {
			target: 'pino-pretty',
			options: {
				translateTime: 'HH:MM:ss Z',
				ignore: 'pid,hostname',
			},
		},
		level: "warn"
	},
};

const app = Fastify({
	logger: envToLogger[process.env.NODE_ENV]
});

await app.register(cors, {
	origin: (origin, cb) => {
		cb(null, true);
	},
	methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'SEARCH']
});

await app.register(FastifyMikroOrmPlugin, config);
await app.register(FastifySearchHttpMethodPlugin, {});
await app.register(AuthPlugin);
await app.register(QuizRoutes, {});

export default app;
