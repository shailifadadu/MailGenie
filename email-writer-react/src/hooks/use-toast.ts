import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "destructive" | "default";
}

export const useToast = () => {
  return {
    toast: ({ title, description, variant }: ToastOptions) => {
      sonnerToast(title, {
        description,
        style:
          variant === "destructive"
            ? { backgroundColor: "red", color: "white" }
            : {},
      });
    },
  };
};
