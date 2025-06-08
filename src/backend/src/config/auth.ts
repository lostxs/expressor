import { betterAuth } from "better-auth";
import { openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { accounts, sessions, users, verifications } from "../db/schema/auth";

export const auth = betterAuth({
  appName: "Hono Auth",
  secret: "rNjbqK1Yx36tBN5cwF27lBrTiIBskVbX",
  plugins: [
    openAPI({
      disableDefaultReference: true,
    }),
  ],
  logger: {
    disabled: false,
    level: "debug",
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    usePlural: true,
    schema: {
      users: users,
      sessions: sessions,
      accounts: accounts,
      verifications: verifications,
    },
  }),

  emailAndPassword: {
    enabled: false,
  },
});

let _schema: Awaited<ReturnType<typeof auth.api.generateOpenAPISchema>> | null =
  null;

const getSchema = async () => {
  if (!_schema) {
    _schema = await auth.api.generateOpenAPISchema();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    for (const [path, ops] of Object.entries(_schema.paths)) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      for (const [method, op] of Object.entries(ops)) {
        op.tags = ["Authentication"];
      }
    }
  }
  return _schema;
};

export const authAPISchema = {
  async getPaths(prefix = "/api/auth") {
    const { paths } = await getSchema();
    const prefixed: typeof paths = {};

    for (const [path, ops] of Object.entries(paths)) {
      prefixed[prefix + path] = ops;
    }

    return prefixed;
  },
  async getComponents() {
    const { components } = await getSchema();
    return components;
  },
  getTags(): Array<{ name: string; description: string }> {
    return [
      {
        name: "Authentication",
        description: "По всем вопросам к DEN4",
      },
    ];
  },
};
