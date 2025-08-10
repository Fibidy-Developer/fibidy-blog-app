// ========== CommentCard  ==========
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CommentEntity } from "@/lib/types/modelTypes";
import { SessionUser } from "@/lib/session";
import { User, Trash2, Edit, Save, X } from "lucide-react";
import { useState } from "react";
import { deleteComment, updateComment } from "@/lib/actions/commentActions";
import { useToast } from "@/hooks/use-toast";

type Props = {
  comment: CommentEntity;
  currentUser?: SessionUser;
  onDelete?: () => void;
  onUpdate?: () => void;
};

const SafeCommentCard = ({ comment, currentUser, onDelete, onUpdate }: Props) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);
  const [isUpdating, setIsUpdating] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const { toast } = useToast();
  
  // Check if user can edit this comment
  const canEdit = Boolean(
    currentUser && 
    comment.author && 
    String(currentUser.id) === String(comment.author.id)
  );

  // Check if comment has been edited
  const isEdited = comment.updatedAt && 
    new Date(comment.updatedAt).getTime() !== new Date(comment.createdAt).getTime();

  const handleDelete = async () => {
    if (!canEdit) return;
    
    setIsDeleting(true);
    try {
      const result = await deleteComment(comment.id);
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Comment deleted successfully",
        });
        onDelete?.();
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to delete comment",
          variant: "destructive",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error", 
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEditSave = async () => {
    if (!editContent.trim() || editContent.length < 5) {
      toast({
        title: "Error",
        description: "Comment must be at least 5 characters long",
        variant: "destructive",
      });
      return;
    }

    // Don't update if content hasn't changed
    if (editContent.trim() === comment.content) {
      setEditDialogOpen(false);
      return;
    }

    setIsUpdating(true);
    try {
      const result = await updateComment({
        id: comment.id,
        content: editContent.trim(),
      });
      
      if (result.success) {
        toast({
          title: "Success",
          description: "Comment updated successfully",
        });
        setEditDialogOpen(false);
        onUpdate?.();
      } else {
        toast({
          title: "Error",
          description: "Failed to update comment",
          variant: "destructive",
        });
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleEditCancel = () => {
    setEditContent(comment.content);
    setEditDialogOpen(false);
  };

  // Format date helper
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-4 bg-white shadow rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex gap-3 text-slate-500 items-center">
          <Avatar className="border-2 w-8 h-8">
            <AvatarImage src={comment.author?.avatar} alt={comment.author?.name || 'User'} />
            <AvatarFallback>
              <User className="w-4 h-4" />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <p className="text-sm font-medium text-slate-700">
              {comment.author?.name || 'Unknown User'}
            </p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>{formatDate(comment.createdAt)}</span>
              {isEdited && (
                <span className="flex items-center gap-1 text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full">
                  <Edit className="w-3 h-3" />
                  edited
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Action buttons for comment owner */}
        {canEdit && (onUpdate || onDelete) && (
          <div className="flex gap-1">
            {/* Edit Button */}
            {onUpdate && (
              <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                    disabled={isDeleting}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>Edit Comment</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      placeholder="Edit your comment..."
                      className="min-h-[100px]"
                      disabled={isUpdating}
                    />
                    <p className="text-xs text-slate-500">
                      {editContent.length} characters (minimum 5)
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        onClick={handleEditCancel}
                        disabled={isUpdating}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        onClick={handleEditSave}
                        disabled={isUpdating || editContent.length < 5}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        {isUpdating ? "Saving..." : "Save"}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}

            {/* Delete Button */}
            {onDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Comment</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this comment? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-3">
        <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
          {comment.content}
        </p>
      </div>
    </div>
  );
};

export default SafeCommentCard;