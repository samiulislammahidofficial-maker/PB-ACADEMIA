import { useAuth } from '../../lib/AuthContext';
import { db, collection, query, getDocs, where } from '../../lib/firebase';
import { useEffect, useState } from 'react';
import { Course } from '../../types';
import { BookOpen, Award, Clock, ChevronRight, Play } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';

export default function StudentDashboard() {
  const { profile } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrolled = async () => {
      // For demo, we just fetch all courses. In real app, we'd filter by enrollment
      const q = collection(db, 'courses');
      const querySnapshot = await getDocs(q);
      const courses: Course[] = [];
      querySnapshot.forEach((doc) => {
        courses.push({ id: doc.id, ...doc.data() } as Course);
      });
      setEnrolledCourses(courses.slice(0, 3)); // Just show first 3 for demo
      setLoading(false);
    };

    fetchEnrolled();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900">Welcome, {profile?.name}! 👋</h1>
        <p className="text-neutral-500 mt-1">Class {profile?.className} • {profile?.schoolName}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 text-blue-600">
            <div className="p-2 bg-blue-50 rounded-lg"><BookOpen className="h-6 w-6" /></div>
            <span className="text-lg font-bold">12</span>
          </div>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Lessons Completed</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 text-green-600">
            <div className="p-2 bg-green-50 rounded-lg"><Award className="h-6 w-6" /></div>
            <span className="text-lg font-bold">85%</span>
          </div>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Average Score</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
          <div className="flex items-center justify-between mb-4 text-purple-600">
            <div className="p-2 bg-purple-50 rounded-lg"><Clock className="h-6 w-6" /></div>
            <span className="text-lg font-bold">4</span>
          </div>
          <p className="text-sm font-medium text-neutral-500 uppercase tracking-wider">Upcoming Exams</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-neutral-900">Your Enrolled Courses</h2>
            <Link to="/" className="text-blue-600 text-sm font-bold hover:underline">View All</Link>
          </div>

          <div className="space-y-4">
            {loading ? (
              <p>Loading courses...</p>
            ) : enrolledCourses.length > 0 ? (
              enrolledCourses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`} className="block group">
                  <motion.div 
                    whileHover={{ x: 4 }}
                    className="bg-white p-5 rounded-2xl border border-neutral-100 shadow-sm hover:shadow-md transition-all flex items-center"
                  >
                    <div className="h-16 w-16 bg-blue-100 rounded-xl mr-5 flex items-center justify-center flex-shrink-0 text-blue-600">
                      <BookOpen />
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-neutral-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{course.title}</h3>
                      <p className="text-sm text-neutral-500 line-clamp-1">{course.description}</p>
                    </div>
                    <div className="ml-4 p-2 rounded-full bg-neutral-50 text-neutral-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <ChevronRight className="h-5 w-5" />
                    </div>
                  </motion.div>
                </Link>
              ))
            ) : (
              <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-neutral-200">
                <p className="text-neutral-500">You are not enrolled in any courses yet.</p>
                <Link to="/" className="inline-block mt-4 text-blue-600 font-bold hover:underline">Browse Courses</Link>
              </div>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Action Items</h2>
          <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 rounded-full bg-red-500"></div>
              </div>
              <div>
                <p className="font-bold text-neutral-900 text-sm uppercase tracking-tight">Biology Test Due</p>
                <p className="text-xs text-neutral-500 mt-1">Starts at 4:30 PM today</p>
                <Link to="/exams/demo" className="inline-block mt-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-wider">Start Exam</Link>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 mt-1">
                <div className="h-2 w-2 rounded-full bg-yellow-500"></div>
              </div>
              <div>
                <p className="font-bold text-neutral-900 text-sm uppercase tracking-tight">Subscription Renewal</p>
                <p className="text-xs text-neutral-500 mt-1">Renews on August 15</p>
                <button className="inline-block mt-2 text-xs font-bold text-neutral-600 bg-neutral-100 px-3 py-1 rounded-full uppercase tracking-wider">Manage Billing</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
