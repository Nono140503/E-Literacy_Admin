import React, { useState } from 'react';

// TODO: Replace with API call to fetch approved courses from the database
// Dummy data for demonstration
const approvedCourses = [
  {
    id: 1,
    name: 'Digital Literacy Basics',
    cover: '/src/assets/1.jpg',
    details: 'Learn the basics of digital literacy.',
    practitioner: 'Dr. Jane Smith', // TODO: Replace with practitioner data from database
    category: 'digital-literacy',
    difficulty: 'beginner',
    duration: 6,
    maxStudents: 50,
    tier: 'free',
    tags: ['digital', 'literacy', 'basics'],
    weeks: [
      {
        id: 'w1',
        title: 'Introduction',
        description: 'Overview of digital literacy.',
        lessons: [
          {
            id: 'l1',
            type: 'video',
            title: 'Welcome Video',
            content: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            duration: 5,
            description: 'Watch this intro to get started.'
          },
          {
            id: 'l2',
            type: 'document',
            title: 'Course PDF',
            content: '/src/assets/sample.pdf',
            description: 'Download the course outline.'
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Advanced Internet Skills',
    cover: '/src/assets/3.jpg',
    details: 'Master advanced internet usage.',
    practitioner: 'Dr. John Doe', // TODO: Replace with practitioner data from database
    category: 'computer-skills',
    difficulty: 'advanced',
    duration: 8,
    maxStudents: 30,
    tier: 'premium',
    tags: ['internet', 'advanced'],
    weeks: []
  },
  {
    id: 3,
    name: 'Safe Online Practices',
    cover: '/src/assets/2.jpg',
    details: 'Stay safe online with best practices.',
    practitioner: 'Prof. Mary Johnson', // TODO: Replace with practitioner data from database
    category: 'internet-safety',
    difficulty: 'intermediate',
    duration: 4,
    maxStudents: 40,
    tier: 'free',
    tags: ['safety', 'online'],
    weeks: []
  },
  {
    id: 4,
    name: 'Social Media Essentials',
    cover: '/src/assets/4.jpg',
    details: 'Navigate social media platforms.',
    practitioner: 'Dr. David Wilson', // TODO: Replace with practitioner data from database
    category: 'mobile-tech',
    difficulty: 'beginner',
    duration: 3,
    maxStudents: 60,
    tier: 'free',
    tags: ['social', 'media'],
    weeks: []
  },
  {
    id: 5,
    name: 'Remote Work Tools',
    cover: '/src/assets/edu.gif',
    details: 'Get familiar with remote work tools.',
    practitioner: 'Dr. Alice Brown', // TODO: Replace with practitioner data from database
    category: 'software',
    difficulty: 'intermediate',
    duration: 5,
    maxStudents: 25,
    tier: 'premium',
    tags: ['remote', 'tools'],
    weeks: []
  }
];
// TODO: Replace with API call to fetch pending courses from the database
const pendingCourses = [
  { id: 6, name: 'Mobile Literacy', cover: '/src/assets/education-mobile-ezgif.com-gif-maker.gif', details: 'Mobile device basics.', practitioner: 'Sarah Martinez' }, // TODO: Replace with practitioner data from database
  { id: 7, name: 'Cloud Computing', cover: '/src/assets/react.svg', details: 'Introduction to cloud computing.', practitioner: 'Mike Chen' }, // TODO: Replace with practitioner data from database
];
// TODO: Replace with API call to fetch rejected courses from the database
const rejectedCourses = [
  { id: 8, name: 'Unverified Course', cover: '/src/assets/Logo.jpg', details: 'Course did not meet requirements.', practitioner: 'John Smith' }, // TODO: Replace with practitioner data from database
];

function CourseGrid({ courses, status, onApprove, onReject, onDelete }: { 
  courses: any[]; 
  status: string; 
  onApprove?: (id: number) => void;
  onReject?: (id: number) => void;
  onDelete?: (id: number) => void;
}) {
  return (
    <div className="mb-8">
      <h2 className="text-lg font-bold mb-4" style={{ color: 'inherit' }}>{status}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12">
        {courses.length === 0 ? (
          <div className="col-span-3 text-gray-400 italic">No courses found.</div>
        ) : (
          courses.map(course => (
            <div key={course.id} className="bg-white rounded-md shadow-md dark:border-gray-700 flex flex-col mx-auto" style={{ minWidth: 320, maxWidth: 420 }}>
              {/* TODO: Replace course.cover with the correct asset URL from the database */}
              <img src={course.cover} alt={course.name} className="h-32 w-full object-cover rounded-t-md mb-3" />
              <div className="p-4 flex flex-col">
                {/* TODO: Replace course.name and course.details with values from the database */}
                <h3 className="font-semibold text-white text-base mb-1 dark:text-black">{course.name}</h3>
                <p className="text-sm text-gray-500 mb-2">{course.details}</p>
                <div className="mt-auto flex justify-end gap-2">
                  <button className="px-4 py-2 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition" onClick={() => course.onView(course)}>View</button>
                  {onApprove && onReject && (
                    <>
                      <button className="px-3 py-2 text-xs rounded bg-green-500 text-white hover:bg-green-600 transition" onClick={() => onApprove(course.id)}>Approve</button>
                      <button className="px-3 py-2 text-xs rounded bg-red-500 text-white hover:bg-red-600 transition" onClick={() => onReject(course.id)}>Reject</button>
                    </>
                  )}
                  {onDelete && (
                    <button className="px-3 py-2 text-xs rounded bg-gray-500 text-white hover:bg-gray-600 transition" onClick={() => onDelete(course.id)}>Delete</button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function ManageCourses({ isDarkMode }: { isDarkMode: boolean }) {
  const [viewCourse, setViewCourse] = useState<any | null>(null);
  const [approved, setApproved] = useState(approvedCourses);
  const [pending, setPending] = useState(pendingCourses);
  const [rejected, setRejected] = useState(rejectedCourses);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState<'success' | 'error'>('success');
  const [modalAction, setModalAction] = useState<'approve' | 'reject' | 'delete'>('approve');
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<any | null>(null);

  // TODO: Replace these handlers with API calls to update course status in database
  const handleApproveCourse = (courseId: number) => {
    const course = pending.find(c => c.id === courseId);
    if (course) {
      setApproved([...approved, { ...course, status: 'approved' }]);
      setPending(pending.filter(c => c.id !== courseId));
      setModalMessage(`Course "${course.name}" has been approved.`);
      setModalType('success');
      setModalAction('approve');
      setShowModal(true);
    }
  };

  const handleRejectCourse = (courseId: number) => {
    const course = pending.find(c => c.id === courseId);
    if (course) {
      setRejected([...rejected, { ...course, status: 'rejected' }]);
      setPending(pending.filter(c => c.id !== courseId));
      setModalMessage(`Course "${course.name}" has been rejected.`);
      setModalType('error');
      setModalAction('reject');
      setShowModal(true);
    }
  };

  const handleDeleteCourse = (courseId: number) => {
    const course = approved.find(c => c.id === courseId);
    if (course) {
      setCourseToDelete(course);
      setShowConfirmDelete(true);
    }
  };

  const confirmDelete = () => {
    if (courseToDelete) {
      setApproved(approved.filter(c => c.id !== courseToDelete.id));
      setModalMessage(`Course "${courseToDelete.name}" has been deleted.`);
      setModalType('success');
      setModalAction('delete');
      setShowModal(true);
      setShowConfirmDelete(false);
      setCourseToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowConfirmDelete(false);
    setCourseToDelete(null);
  };

  // Helper to render tags
  // TODO: Replace tags with values from the database
  const renderTags = (tags: string[] | undefined) => (
    <div className="flex flex-wrap gap-2 mt-2">
      {(tags && tags.length > 0) ? tags.map(tag => (
        <span key={tag} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-xs">{tag}</span>
      )) : <span className="text-gray-400 italic">Not provided</span>}
    </div>
  );

  // Helper to render lessons
  // TODO: Replace lesson data with values from the database
  const renderLessonContent = (lesson: any) => {
    switch (lesson.type) {
      case 'video':
            if (lesson.content && /^https?:\/\/(www\.)?(youtube\.com|youtu\.be|vimeo\.com)/.test(lesson.content)) {
              return (
                <div className="mt-2  rounded-lg border p-4">
                  <iframe
                    src={lesson.content}
                    title={lesson.title}
                    className="w-full h-48 rounded"
                    allowFullScreen
                  />
                  <div className="mt-2 flex gap-2">
                    <a href={lesson.content} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Open in YouTube</a>
                    <button className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded" onClick={() => navigator.clipboard.writeText(lesson.content)}>Copy link</button>
                  </div>
                </div>
              );
            } else if (lesson.content) {
              return (
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-blue-600 underline break-all">{lesson.content}</span>
                  <a href={lesson.content} target="_blank" rel="noopener noreferrer" className="px-2 py-1 text-xs bg-blue-500 text-white rounded">Open</a>
                </div>
              );
            }
            return <span className="text-gray-400 italic">Not provided</span>;
      case 'document':
      case 'assignment':
  // TODO: Replace lesson.content with the correct file URL from the database
  if (lesson.content && /\.(pdf)$/i.test(lesson.content)) {
          const fileName = lesson.content.split('/').pop();
          return (
            <div className="mt-2 p-4 rounded-lg border flex items-center justify-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-3" viewBox="0 0 24 24" fill="none">
                <path fill="#E34F26" d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z"/>
              </svg>
              <span className="font-semibold text-black mr-4">{fileName}</span>
              <a href={lesson.content} download className="px-3 py-1 text-xs rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition">Download</a>
            </div>
          );
        } else if (lesson.content) {
          return <div className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-line">{lesson.content}</div>;
        }
        return <span className="text-gray-400 italic">Not provided</span>;
      case 'link':
      case 'quiz':
        if (lesson.content) {
          return (
            <div className="mt-2 flex items-center gap-2">
              <a href={lesson.content} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">{lesson.content}</a>
              <button className="px-2 py-1 text-xs bg-gray-200 text-gray-800 rounded" onClick={() => navigator.clipboard.writeText(lesson.content)}>Copy link</button>
            </div>
          );
        }
        return <span className="text-gray-400 italic">Not provided</span>;
      case 'text':
        return lesson.content ? <div className="mt-2 text-gray-700 dark:text-gray-200 whitespace-pre-line">{lesson.content}</div> : <span className="text-gray-400 italic">Not provided</span>;
      default:
        return <span className="text-gray-400 italic">Not provided</span>;
    }
  };

  // Modal backdrop and content
  const CourseModal = ({ course, onClose, onDelete }: { 
    course: any, 
    onClose: () => void,
    onDelete?: (id: number) => void
  }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="relative bg-[#f7f7fa] rounded-md shadow-lg max-w-2xl w-full mx-4 max-h-[100vh] overflow-y-auto  z-10">
        <button className="absolute top-4 right-4 px-3 py-1 bg-orange-500 text-gray-800 dark:text-gray-100 text-sm font-semibold hover:bg-gray-300 dark:hover:bg-orange-800" onClick={onClose}>Close</button>
        <div className="flex flex-col items-center mb-6">
          {course.cover ? (
            <img src={course.cover} alt={course.name} className="h-40 w-full object-cover rounded-lg mb-4" />
          ) : (
            <div className="h-40 w-full flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg mb-4 text-gray-400">No cover image</div>
          )}
          <div></div>
          <h2 className="text-2xl font-bold mb-2 text-center text-gray-900 ">{course.name || 'Not provided'}</h2>
          <p className="text-base text-gray-600  mb-2 text-center">{course.details || 'Not provided'}</p>
          {/* TODO: Replace with practitioner data from database */}
          <p className="text-sm text-blue-600 font-medium text-center mb-4">Created by: {course.practitioner || 'Unknown Practitioner'}</p>
        </div>
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 gap-4 px-5">
          <div><span className="font-semibold">Category:</span> {course.category || <span className="text-gray-400 italic">Not provided</span>}</div>
          <div><span className="font-semibold">Difficulty:</span> {course.difficulty || <span className="text-gray-400 italic">Not provided</span>}</div>
          <div><span className="font-semibold">Duration:</span> {course.duration ? `${course.duration} weeks` : <span className="text-gray-400 italic">Not provided</span>}</div>
          <div><span className="font-semibold">Max Students:</span> {course.maxStudents || <span className="text-gray-400 italic">Not provided</span>}</div>
          <div><span className="font-semibold">Tier:</span> {course.tier || <span className="text-gray-400 italic">Not provided</span>}</div>
        </div>
        <div className="mb-6 px-5">
          <span className="font-semibold">Tags:</span>
          {renderTags(course.tags)}
        </div>
        <div className="px-5 mb-6">
          <h3 className="text-lg font-bold mb-2">Course Structure</h3>
          {course.weeks && course.weeks.length > 0 ? course.weeks.map((week: any, wIdx: number) => (
            <div key={week.id || wIdx} className="mb-6">
              <div className="mb-2">
                <span className="font-semibold">Week {wIdx + 1}:</span> {week.title || <span className="text-gray-400 italic">Not provided</span>}
              </div>
              <div className="mb-2 text-gray-500">{week.description || <span className="text-gray-400 italic">Not provided</span>}</div>
              <div className="space-y-4">
                {week.lessons && week.lessons.length > 0 ? week.lessons.map((lesson: any, lIdx: number) => (
                  <div key={lesson.id || lIdx} className="border rounded-lg p-3">
                    <div className="flex flex-wrap gap-2 items-center mb-2">
                      <span className="px-2 py-1 rounded bg-gray-200 dark:bg-gray-700 text-xs font-semibold text-gray-800 dark:text-gray-100">{lesson.type || 'Not provided'}</span>
                      <span className="font-semibold">{lesson.title || <span className="text-gray-400 italic">Not provided</span>}</span>
                      {lesson.duration && <span className="ml-2 text-xs text-gray-500">{lesson.duration} min</span>}
                    </div>
                    {lesson.description && <div className="mb-2 text-sm text-gray-500">{lesson.description}</div>}
                    {renderLessonContent(lesson)}
                  </div>
                )) : <div className="text-gray-400 italic">No lessons</div>}
              </div>
            </div>
          )) : <div className="text-gray-400 italic">No weeks added</div>}
        </div>
        
        {/* TODO: Replace with API call to delete course from database */}
        {onDelete && (
          <div className="px-5 pb-5">
            <button
              onClick={() => {
                onDelete(course.id);
                onClose();
              }}
              className="w-full py-2 px-4 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Delete Course
            </button>
          </div>
        )}
      </div>
    </div>
  );

  // Pass onView to CourseGrid so each course can trigger modal
  const courseGridProps = (courses: any[]) => courses.map(course => ({ ...course, onView: setViewCourse }));

  return (
    <div
      className={
        `max-w-10xl mx-auto py-8` +
        (isDarkMode ? ' text-white' : ' text-black')
      }
    >
      <CourseGrid 
        courses={courseGridProps(approved)} 
        status="Approved Courses" 
        onDelete={handleDeleteCourse}
      />
      <CourseGrid 
        courses={courseGridProps(pending)} 
        status="Pending Approval" 
        onApprove={handleApproveCourse}
        onReject={handleRejectCourse}
      />
      <CourseGrid 
        courses={courseGridProps(rejected)} 
        status="Rejected" 
      />
      {viewCourse && (
        <CourseModal 
          course={viewCourse} 
          onClose={() => setViewCourse(null)} 
          onDelete={approved.some(c => c.id === viewCourse.id) ? handleDeleteCourse : undefined}
        />
      )}

      {/* Approval/Rejection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setShowModal(false)} />
          <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 z-10">
            <div className="flex items-center justify-center mb-4">
              {modalType === 'success' ? (
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                </div>
              )}
            </div>
            <h3 className={`text-lg font-semibold text-center mb-2 ${modalType === 'success' ? 'text-green-800' : 'text-red-800'}`}>
              {modalAction === 'approve' ? 'Course Approved' : modalAction === 'reject' ? 'Course Rejected' : 'Course Deleted'}
            </h3>
            <p className="text-gray-600 text-center mb-6">{modalMessage}</p>
            <button
              onClick={() => setShowModal(false)}
              className={`w-full py-2 px-4 rounded-lg font-semibold text-white ${
                modalType === 'success' ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && courseToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={cancelDelete} />
          <div className="relative bg-white rounded-xl shadow-lg max-w-md w-full mx-4 p-6 z-10">
            <div className="flex items-center justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-center mb-2 text-yellow-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete the course "{courseToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 px-4 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 px-4 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
