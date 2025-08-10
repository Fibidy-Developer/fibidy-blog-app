import { fetchPostById } from "@/lib/actions/postActions";
import UpdatePostContainer from "./_components/UpdatePostContainer";

// Updated Props type for Next.js 15
type Props = {
  params: Promise<{
    id: string;
  }>;
};

const UpdatePostPage = async (props: Props) => {
  // Await params in Next.js 15
  const params = await props.params;
  const post = await fetchPostById(parseInt(params.id));
  
  return (
    <div className="bg-white shadow-md rounded-md p-6 max-w-2xl w-full">
      <h2 className="text-lg text-center font-bold text-slate-700">
        Update Your Post
      </h2>
      <UpdatePostContainer post={post} />
    </div>
  );
};

export default UpdatePostPage;