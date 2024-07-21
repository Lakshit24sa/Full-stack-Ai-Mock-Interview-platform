/** @type { import("drizzle-kit").Config } */
export default {
    schema: "./utils/schema.js",
    dialect: 'postgresql',
    dbCredentials: {
      url: 'postgresql://neondb_owner:v7Qx3BJGSETh@ep-yellow-scene-a5h9xdth.us-east-2.aws.neon.tech/neondb?sslmode=require',
    }
  }; 