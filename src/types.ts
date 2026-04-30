export type UserRole = 'student' | 'teacher' | 'admin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  schoolName?: string;
  mobileNumber?: string;
  className?: string; // 'class' in prompt, mapping to className
  createdAt?: any;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  price: number;
  monthlyFee: number;
  teacherId: string;
  teacherName?: string;
  thumbnail?: string;
}

export interface Exam {
  id: string;
  title: string;
  courseId: string;
  teacherId: string;
  questions: Question[];
  durationMinutes: number;
  startTime?: any;
}

export type QuestionType = 'mcq' | 'short_answer' | 'creative';

export interface Question {
  id: string;
  type: QuestionType;
  text: string;
  options?: string[]; // Only for MCQ
  correctOption?: number; // Only for MCQ
  correctAnswer?: string; // For Short Answer
  points: number;
}

export interface Submission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: (number | string)[]; // Can be option index or text
  score: number;
  totalQuestions: number;
  submittedAt: any;
  status: 'pending' | 'graded';
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  courseId: string;
  teacherId: string;
  dueDate: any;
  fileUrl?: string;
  fileType?: string;
  createdAt: any;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  fileUrl: string;
  fileType: string;
  submittedAt: any;
  grade?: number;
  feedback?: string;
}

export interface Material {
  id: string;
  title: string;
  courseId: string;
  fileUrl: string;
  fileType: string;
  uploadedBy: string;
  uploadedAt: any;
}
