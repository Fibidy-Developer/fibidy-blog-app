import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { PencilIcon, TrashIcon } from "@heroicons/react/20/solid";
import Link from "next/link";

type Props = {
  postId: number;
};

const PostActions = ({ postId }: Props) => {
  return (
    <TooltipProvider>
      <div className="flex justify-center items-center gap-2">
        {/* Edit */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/user/posts/${postId}/update`}
              className="border p-2 border-yellow-500 rounded-md text-yellow-500 hover:border-yellow-700 hover:text-yellow-700 transition-colors"
            >
              <PencilIcon className="w-4 h-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-yellow-700 text-white">
            <p>Edit This Post</p>
          </TooltipContent>
        </Tooltip>

        {/* Delete */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href={`/user/posts/${postId}/delete`}
              className="border p-2 border-red-500 rounded-md text-red-500 hover:border-red-700 hover:text-red-700 transition-colors"
            >
              <TrashIcon className="w-4 h-4" />
            </Link>
          </TooltipTrigger>
          <TooltipContent className="bg-red-500 text-white">
            <p>Delete This Post</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
};

export default PostActions;
