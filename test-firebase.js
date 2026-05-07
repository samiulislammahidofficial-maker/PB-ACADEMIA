import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import fs from 'fs';

const rawConfig = fs.readFileSync('./firebase-applet-config.json', 'utf8');
const config = JSON.parse(rawConfig);
const app = initializeApp(config);
const db = getFirestore(app);

async function createExam() {
  try {
    const docRef = await addDoc(collection(db, 'exams'), {
      title: 'Test Exam',
      type: 'CQ',
      startTime: new Date().toISOString(),
      duration: 60,
      googleFormLink: 'https://form.com',
      pdfUrl: '',
      courseId: 'test-course',
      teacherId: 'test-teacher',
      teacherName: 'Mr. Test',
      createdAt: serverTimestamp(),
      status: 'scheduled'
    });
    console.log("Exam created with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
createExam();
