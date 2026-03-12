import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import { Snackbar, type SnackbarVariant } from "../components/Snackbar";

interface SnackbarOptions {
  variant?: SnackbarVariant;
  autoHideDuration?: number;
}

interface SnackbarContextValue {
  showSnackbar: (message: string, options?: SnackbarOptions) => void;
}

const SnackbarContext = createContext<SnackbarContextValue | null>(null);

export function SnackbarProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [variant, setVariant] = useState<SnackbarVariant>("default");
  const [autoHideDuration, setAutoHideDuration] = useState(4000);

  const showSnackbar = useCallback((msg: string, options?: SnackbarOptions) => {
    setMessage(msg);
    setVariant(options?.variant ?? "default");
    setAutoHideDuration(options?.autoHideDuration ?? 4000);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => setOpen(false), []);

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        message={message}
        variant={variant}
        open={open}
        onClose={handleClose}
        autoHideDuration={autoHideDuration}
      />
    </SnackbarContext.Provider>
  );
}

export function useSnackbar(): SnackbarContextValue {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error("useSnackbar must be used within SnackbarProvider");
  return ctx;
}
