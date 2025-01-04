type Priority = "low" | "medium" | "high";
export interface Tasks {
  id: number;
  title: string;
  status: string;
  deadline: string;
  priority?: Priority;
  description: string;
  [key: string]: any;
}
