const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '..', '.env') });

const User = require('../models/User');
const Internship = require('../models/Internship');
const Application = require('../models/Application');
const Task = require('../models/Task');
const Submission = require('../models/Submission');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Internship.deleteMany({});
    await Application.deleteMany({});
    await Task.deleteMany({});
    await Submission.deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Create Admin
    const admin = await User.create({
      name: 'Dr. Sharma',
      email: 'admin@interntrack.com',
      password: 'admin123',
      role: 'admin',
      college: 'IIT Delhi',
      branch: 'Computer Science',
      semester: 'Faculty'
    });
    console.log('👑 Admin created');

    // Create Students
    const students = await User.create([
      {
        name: 'Rahul Verma',
        email: 'rahul@test.com',
        password: 'password123',
        role: 'student',
        college: 'IIT Delhi',
        branch: 'Computer Science',
        semester: '7th'
      },
      {
        name: 'Priya Patel',
        email: 'priya@test.com',
        password: 'password123',
        role: 'student',
        college: 'IIT Delhi',
        branch: 'Information Technology',
        semester: '7th'
      },
      {
        name: 'Amit Kumar',
        email: 'amit@test.com',
        password: 'password123',
        role: 'student',
        college: 'IIT Delhi',
        branch: 'Electronics',
        semester: '8th'
      },
      {
        name: 'Sneha Gupta',
        email: 'sneha@test.com',
        password: 'password123',
        role: 'student',
        college: 'IIT Delhi',
        branch: 'Computer Science',
        semester: '6th'
      },
      {
        name: 'Vikram Singh',
        email: 'vikram@test.com',
        password: 'password123',
        role: 'student',
        college: 'IIT Delhi',
        branch: 'Mechanical',
        semester: '8th'
      }
    ]);
    console.log('👨‍🎓 5 Students created');

    // Create Internships
    const internships = await Internship.create([
      {
        title: 'Frontend Developer Intern',
        company: 'Google',
        location: 'Bangalore, India',
        stipend: '₹80,000/month',
        deadline: new Date('2026-05-15'),
        description: 'Work on Google\'s next-generation web applications using React, TypeScript, and modern web technologies. You\'ll collaborate with experienced engineers and contribute to products used by billions.',
        postedBy: admin._id
      },
      {
        title: 'Backend Engineer Intern',
        company: 'Microsoft',
        location: 'Hyderabad, India',
        stipend: '₹75,000/month',
        deadline: new Date('2026-05-20'),
        description: 'Join Microsoft\'s Azure team to build scalable cloud services. Experience with Node.js, Python, or Java required. Learn distributed systems and cloud architecture.',
        postedBy: admin._id
      },
      {
        title: 'Data Science Intern',
        company: 'Amazon',
        location: 'Remote',
        stipend: '₹70,000/month',
        deadline: new Date('2026-06-01'),
        description: 'Apply machine learning and statistical analysis to solve real-world business problems at Amazon. Work with large-scale datasets and cutting-edge ML tools.',
        postedBy: admin._id
      },
      {
        title: 'Full Stack Developer Intern',
        company: 'Flipkart',
        location: 'Bangalore, India',
        stipend: '₹60,000/month',
        deadline: new Date('2026-04-30'),
        description: 'Build end-to-end features for India\'s largest e-commerce platform. Work with React, Node.js, and microservices architecture.',
        postedBy: admin._id
      },
      {
        title: 'Mobile App Developer Intern',
        company: 'Swiggy',
        location: 'Bangalore, India',
        stipend: '₹50,000/month',
        deadline: new Date('2026-05-10'),
        description: 'Develop features for Swiggy\'s mobile apps using React Native. Optimize performance and user experience for millions of daily users.',
        postedBy: admin._id
      },
      {
        title: 'DevOps Engineer Intern',
        company: 'Razorpay',
        location: 'Bangalore, India',
        stipend: '₹55,000/month',
        deadline: new Date('2026-06-15'),
        description: 'Work on CI/CD pipelines, containerization with Docker/Kubernetes, and infrastructure automation. Help scale payment processing infrastructure.',
        postedBy: admin._id
      }
    ]);
    console.log('🏢 6 Internships created');

    // Create Applications
    const applications = await Application.create([
      // Rahul's applications
      { student: students[0]._id, internship: internships[0]._id, company: 'Google', role: 'Frontend Developer Intern', status: 'Interview', dateApplied: new Date('2026-01-15') },
      { student: students[0]._id, internship: internships[1]._id, company: 'Microsoft', role: 'Backend Engineer Intern', status: 'Under Review', dateApplied: new Date('2026-02-10') },
      { student: students[0]._id, company: 'Tesla', role: 'Software Engineer Intern', status: 'Applied', dateApplied: new Date('2026-03-05'), isCustom: true, link: 'https://tesla.com/careers' },
      // Priya's applications
      { student: students[1]._id, internship: internships[2]._id, company: 'Amazon', role: 'Data Science Intern', status: 'Accepted', dateApplied: new Date('2026-01-20') },
      { student: students[1]._id, internship: internships[3]._id, company: 'Flipkart', role: 'Full Stack Developer Intern', status: 'Interview', dateApplied: new Date('2026-02-15') },
      { student: students[1]._id, company: 'Netflix', role: 'UI Engineer Intern', status: 'Rejected', dateApplied: new Date('2026-01-10'), isCustom: true },
      // Amit's applications
      { student: students[2]._id, internship: internships[0]._id, company: 'Google', role: 'Frontend Developer Intern', status: 'Under Review', dateApplied: new Date('2026-02-20') },
      { student: students[2]._id, company: 'Apple', role: 'Hardware Intern', status: 'Applied', dateApplied: new Date('2026-03-01'), isCustom: true },
      // Sneha's applications
      { student: students[3]._id, internship: internships[4]._id, company: 'Swiggy', role: 'Mobile App Developer Intern', status: 'Interview', dateApplied: new Date('2026-02-25') },
      { student: students[3]._id, internship: internships[5]._id, company: 'Razorpay', role: 'DevOps Engineer Intern', status: 'Applied', dateApplied: new Date('2026-03-10') },
      { student: students[3]._id, company: 'Spotify', role: 'Backend Developer Intern', status: 'Under Review', dateApplied: new Date('2026-03-15'), isCustom: true },
      // Vikram's applications
      { student: students[4]._id, company: 'Tata Motors', role: 'Mechanical Design Intern', status: 'Accepted', dateApplied: new Date('2026-01-25'), isCustom: true },
      { student: students[4]._id, company: 'Mahindra', role: 'Production Intern', status: 'Applied', dateApplied: new Date('2026-03-20'), isCustom: true }
    ]);
    console.log('📝 13 Applications created');

    // Create Tasks
    const tasks = await Task.create([
      {
        title: 'Build a REST API with Express.js',
        description: 'Create a complete RESTful API for a Todo application with CRUD operations, authentication, and input validation. Use Express.js and MongoDB.',
        deadline: new Date('2026-04-10'),
        priority: 'High',
        assignedTo: [students[0]._id, students[1]._id, students[2]._id, students[3]._id, students[4]._id],
        createdBy: admin._id,
        status: 'Pending'
      },
      {
        title: 'React Dashboard Component',
        description: 'Design and implement a responsive dashboard component using React and Tailwind CSS. Include charts, stats cards, and a data table.',
        deadline: new Date('2026-04-15'),
        priority: 'High',
        assignedTo: [students[0]._id, students[1]._id, students[3]._id],
        createdBy: admin._id,
        status: 'In Progress'
      },
      {
        title: 'Database Schema Design',
        description: 'Design a normalized database schema for an e-commerce application. Include ER diagram and Mongoose models for at least 5 collections.',
        deadline: new Date('2026-04-05'),
        priority: 'Medium',
        assignedTo: [students[0]._id, students[2]._id, students[4]._id],
        createdBy: admin._id,
        status: 'Pending'
      },
      {
        title: 'Unit Testing Assignment',
        description: 'Write comprehensive unit tests for the provided Node.js application using Jest. Achieve at least 80% code coverage.',
        deadline: new Date('2026-04-20'),
        priority: 'Medium',
        assignedTo: [students[1]._id, students[3]._id],
        createdBy: admin._id,
        status: 'Pending'
      },
      {
        title: 'DevOps Pipeline Setup',
        description: 'Set up a CI/CD pipeline using GitHub Actions for a Node.js application. Include build, test, and deployment stages.',
        deadline: new Date('2026-04-25'),
        priority: 'Low',
        assignedTo: [students[0]._id, students[4]._id],
        createdBy: admin._id,
        status: 'Pending'
      }
    ]);
    console.log('📋 5 Tasks created');

    // Create Submissions
    await Submission.create([
      {
        task: tasks[1]._id,
        student: students[0]._id,
        content: 'Completed the React dashboard component with responsive design. Used Recharts for data visualization and implemented dark mode support. GitHub repo: https://github.com/rahul/dashboard-demo',
        status: 'Graded',
        feedback: 'Excellent work! Clean code structure and great UI design. The dark mode implementation is impressive.',
        grade: 'A',
        submittedAt: new Date('2026-03-28')
      },
      {
        task: tasks[1]._id,
        student: students[1]._id,
        content: 'Dashboard component completed with all required features. Added extra animations using Framer Motion.',
        status: 'Submitted',
        submittedAt: new Date('2026-03-29')
      },
      {
        task: tasks[2]._id,
        student: students[2]._id,
        content: 'Designed the ER diagram and created Mongoose models for Users, Products, Orders, Reviews, and Categories collections. Included indexing for performance.',
        status: 'Graded',
        feedback: 'Good schema design. Consider adding more indexes for frequently queried fields.',
        grade: 'B+',
        submittedAt: new Date('2026-03-25')
      }
    ]);
    console.log('📤 3 Submissions created');

    console.log('\n🎉 Database seeded successfully!');
    console.log('\n📌 Demo Credentials:');
    console.log('   Admin:   admin@interntrack.com / admin123');
    console.log('   Student: rahul@test.com / password123');
    console.log('   Student: priya@test.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
