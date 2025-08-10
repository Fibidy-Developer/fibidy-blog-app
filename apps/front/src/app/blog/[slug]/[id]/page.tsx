import { fetchPostById } from "@/lib/actions/postActions";
import Image from "next/image";
import SanitizedContent from "./_components/SanitizedContent/index";
import Comments from "./_components/comments";
import { getSession } from "@/lib/session";
import Like from "./_components/like/index";

// Updated Props type for Next.js 15
type Props = {
  params: Promise<{
    id: string;
    slug: string; // Don't forget the slug if it's in your route
  }>;
};

const PostPage = async ({ params }: Props) => {
  // Await params in Next.js 15
  const { id } = await params;
  const post = await fetchPostById(+id);
  const session = await getSession();

  return (
    <main className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-4xl font-bold mb-4 text-slate-700">{post.title}</h1>
      <p className="text-slate-500 text-sm mb-4">
        By {post.author.name} | {new Date(post.createdAt).toLocaleDateString()}
      </p>

      <div className="relative w-80 h-60">
        <Image
          src={post.thumbnail ?? "/no-image.png"}
          alt={post.title}
          fill
          className="rounded-md object-cover"
        />
      </div>

      <SanitizedContent content={post.content} />

      <Like postId={post.id} user={session?.user} />
      {/* Todo: Put the Post Comments Here */}
      <Comments user={session?.user} postId={post.id} />
    </main>
  );
};

export default PostPage;