import { Inbox } from "lucide-react";

interface EmptyStateProps {
  message?: string;
}

const EmptyState = ({ message = "No records found" }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
    <Inbox className="h-12 w-12 mb-3" />
    <p className="text-sm">{message}</p>
  </div>
);

export default EmptyState;
