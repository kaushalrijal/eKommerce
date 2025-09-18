import { PrismaClient } from "@/lib/generated/prisma";

// For now, use the standard PrismaClient without adapter
// TODO: Fix PrismaNeon adapter configuration
export const prisma = new PrismaClient().$extends({
  result: {
    product: {
      price: {
        compute(product) {
          return product.price.toString();
        },
      },
      rating: {
        compute(product) {
          return product.rating.toString();
        },
      },
    },
  },
});
