"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { serviceDelete } from "@/allapi";

interface Props {
  id: string;
}

const DeleteServiceButton = ({ id }: Props) => {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setDeleting(true);

const result = await serviceDelete({ id });

      if (result.deletedCount > 0) {
        toast.success("Service deleted successfully!");
        router.refresh();
      } else {
        toast.error("Service not found!");
      }
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete service!");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-xs font-bold text-red-600 transition-all duration-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Trash2 size={14} />
      {deleting ? "Deleting..." : "Delete Service"}
    </button>
  );
};

export default DeleteServiceButton;