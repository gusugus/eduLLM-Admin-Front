import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardCards from '../components/layout/DashboardCards';
import ProfessorList from '../features/professors/ProfessorList';
import ProfessorForm from '../features/professors/ProfessorForm';
import StudentList from '../features/students/StudentList';
import StudentForm from '../features/students/StudentForm';
import SubjectList from '../features/subjects/SubjectList';
import SubjectForm from '../features/subjects/SubjectForm';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardCards />} />
      <Route path="/professors" element={<ProfessorList />} />
      <Route path="/professors/new" element={<ProfessorForm />} />
      <Route path="/professors/:id" element={<ProfessorForm />} />
      <Route path="/students" element={<StudentList />} />
      <Route path="/students/new" element={<StudentForm />} />
      <Route path="/students/:id" element={<StudentForm />} />
      <Route path="/subjects" element={<SubjectList />} />
      <Route path="/subjects/new" element={<SubjectForm />} />
      <Route path="/subjects/:id" element={<SubjectForm />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;