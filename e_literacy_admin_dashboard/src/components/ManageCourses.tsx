import React, { useState } from 'react';

// TODO: Replace with API call to fetch approved courses from the database
// Dummy data for demonstration
const approvedCourses = [
  {
    id: 1,
    name: 'Digital Literacy Basics',
    cover: '/src/assets/1.jpg',
    details: 'Learn the basics of digital literacy.',
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
  { id: 6, name: 'Mobile Literacy', cover: '/src/assets/education-mobile-ezgif.com-gif-maker.gif', details: 'Mobile device basics.' },
  { id: 7, name: 'Cloud Computing', cover: '/src/assets/react.svg', details: 'Introduction to cloud computing.' },
];
// TODO: Replace with API call to fetch rejected courses from the database
const rejectedCourses = [
  { id: 8, name: 'Unverified Course', cover: '/src/assets/Logo.jpg', details: 'Course did not meet requirements.' },
];

function CourseGrid({ courses, status }: { courses: any[]; status: string }) {
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
                <div className="mt-auto flex justify-end">
                  <button className="px-4 py-2 text-xs rounded bg-blue-500 text-white hover:bg-blue-600 transition" onClick={() => course.onView(course)}>View</button>
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
  const CourseModal = ({ course, onClose }: { course: any, onClose: () => void }) => (
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
      <CourseGrid courses={courseGridProps(approvedCourses)} status="Approved Courses" />
      <CourseGrid courses={courseGridProps(pendingCourses)} status="Pending Approval" />
      <CourseGrid courses={courseGridProps(rejectedCourses)} status="Rejected" />
      {viewCourse && <CourseModal course={viewCourse} onClose={() => setViewCourse(null)} />}
    </div>
  );
}
