import prisma from "../src/lib/prisma";

export async function resetDB() {
    await prisma.generation.deleteMany({});
    await prisma.user.deleteMany({});
}

export async function closeDB() {
    await prisma.$disconnect();
}
