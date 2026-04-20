export interface Task {
  id: string;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
  userId: string;
}

export interface User {
  id: string;
  email: string;
  displayName: string;
  avatar: string;
  createdAt: string;
}
