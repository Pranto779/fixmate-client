import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGODB_URI as string);
const db = client.db("FIXMATE");

export const auth = betterAuth({
  database: mongodbAdapter(db),

  emailAndPassword: {
    enabled: true,
  },

  plugins: [
    admin({
      defaultRole: "customer",
    }),
  ],

  user: {
    additionalFields: {
      signupRole: {
        type: "string",
        input: true,
        required: false,
        returned: false,
      },
         phone: {
        type: "string",
        required: false,
        input: true,
      },

      area: {
        type: "string",
        required: false,
        input: true,
      },

      bio: {
        type: "string",
        required: false,
        input: true,
      },

    },
  },

  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const requestedRole = (user as { signupRole?: string }).signupRole;

          const role = ["customer", "technician"].includes(
            requestedRole ?? ""
          )
            ? requestedRole
            : "customer";

          return {
            data: {
              ...user,
              role,
            },
          };
        },
      },
    },
  },
});