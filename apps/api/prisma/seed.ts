import { faker } from '@faker-js/faker';
import { PrismaClient } from '@prisma/client';
import { hash } from 'argon2';

const prisma = new PrismaClient();

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/ /g, '-') // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ''); // Remove all non-word characters
}

async function main() {
  const defaultPassword = await hash('123');

  const users = Array.from({ length: 10 }).map(() => ({
    name: faker.person.fullName(),
    email: faker.internet.email(),
    bio: faker.lorem.sentence(),
    avatar: faker.image.avatar(),
    password: defaultPassword,
  }));

  await prisma.user.createMany({ data: users });

  const posts = Array.from({ length: 400 }).map(() => {
    const title = faker.lorem.sentence();
    return {
      title,
      slug: generateSlug(title),
      content: faker.lorem.paragraphs(3),
      thumbnail: faker.image.urlLoremFlickr({ height: 240, width: 320 }),
      authorId: faker.number.int({ min: 1, max: 10 }),
      published: true,
    };
  });

  await Promise.all(
    posts.map((post) =>
      prisma.post.create({
        data: {
          ...post,
          comments: {
            createMany: {
              data: Array.from({ length: 20 }).map(() => ({
                content: faker.lorem.sentence(),
                authorId: faker.number.int({ min: 1, max: 10 }),
              })),
            },
          },
        },
      }),
    ),
  );

  console.log('Seeding Completed!');
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
