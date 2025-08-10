// ========== AddComment.tsx (Updated) ==========
import SubmitButton from "@/components/SubmitButton";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { saveComment } from "@/lib/actions/commentActions";
import { SessionUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { Dialog } from "@radix-ui/react-dialog";
import { useActionState, useEffect, useState } from "react";

type Props = {
  postId: number;
  user: SessionUser;
  className?: string;
  onSuccess?: () => void; // Simplified callback
};

const AddComment = (props: Props) => {
  const [state, action] = useActionState(saveComment, undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (state?.message) {
      toast({
        title: state?.ok ? "Success" : "Oops!",
        description: state?.message,
        variant: state?.ok ? "default" : "destructive",
      });
    }
    
    // Jika berhasil, tutup dialog dan refresh comments
    if (state?.ok) {
      setDialogOpen(false);
      props.onSuccess?.();
    }
  }, [state, props, toast]);

  // Sync dialog state with server state
  useEffect(() => {
    if (state?.open !== undefined) {
      setDialogOpen(state.open);
    }
  }, [state?.open]);

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="mb-4">Leave Your Comment</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Write Your Comment</DialogTitle>
        <form action={action} className={cn(props.className)}>
          <input hidden name="postId" defaultValue={props.postId} />
          <Label htmlFor="comment">Your Comment</Label>
          <div className="border-t border-x rounded-t-md">
            <Textarea
              className="border-none active:outline-none focus-visible:ring-0 shadow-none"
              name="content"
              placeholder="Write your thoughts here..."
              key={state?.ok ? 'reset' : 'default'} // Reset textarea after success
            />
            {!!state?.errors?.content && (
              <p className="text-red-500 animate-shake text-sm mt-1">
                {state.errors.content}
              </p>
            )}
          </div>
          <p className="border rounded-b-md p-2">
            <span className="text-slate-400">Write as </span>
            <span className="text-slate-700">{props.user.name}</span>
          </p>
          <SubmitButton className="mt-2">Submit</SubmitButton>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddComment;