import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  //   log: ["query", "info", "warn", "error"],
  //   __internal: {
  //     engine: {
  //       interactiveTransactions: {
  //         maxWait: 10000, // max wait before timeout
  //         timeout: 15000, // max time allowed
  //       },
  //     },
  //   },
});

export default prisma;
