import { PrismaClient } from "../lib/generated/prisma";
import sampleData from "./sample-data";

async function main() {
    const prisma = new PrismaClient();
    
    try {
        // Clear existing data
        await prisma.product.deleteMany();
        await prisma.account.deleteMany();
        await prisma.session.deleteMany();
        await prisma.verificationToken.deleteMany();
        await prisma.user.deleteMany();

        
        // Create products one by one to avoid array issues
        for (const product of sampleData.products) {
            await prisma.product.create({
                data: {
                    name: product.name,
                    slug: product.slug,
                    category: product.category,
                    images: product.images, // This should be a proper string array
                    brand: product.brand,
                    description: product.description,
                    stock: product.stock,
                    price: product.price,
                    rating: product.rating,
                    numReviews: product.numReviews,
                    isFeatured: product.isFeatured,
                    banner: product.banner,
                }
            });
            console.log(`Created product: ${product.name}`);
        }

        await prisma.user.createMany({ data: sampleData.users })

        console.log("Database seeded successfully");
    } catch (error) {
        console.error("Error seeding database:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

main();