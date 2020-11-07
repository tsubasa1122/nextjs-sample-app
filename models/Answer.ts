import { firestore } from 'firebase/app';

export interface Answer {
  id: string;
  uid: string;
  questionId: string;
  body: string;
  createdAt: firestore.Timestamp;
}
