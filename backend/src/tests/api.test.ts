import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

// Base URL for API
const API_URL = 'http://localhost:3000/api';

// Test data
const testSubject = {
  name: 'Cloud Computing',
  description: 'All about cloud technologies and services'
};

const testCompetency = {
  name: 'AWS',
  marks: 8,
  description: 'Amazon Web Services knowledge'
};

// Helper function to log test results
const logTest = (name: string, success: boolean, error?: any) => {
  if (success) {
    console.log(`✅ ${name}: PASSED`);
  } else {
    console.log(`❌ ${name}: FAILED`);
    if (error) {
      console.error(error.response?.data || error.message);
    }
  }
};

// Main test function
async function runTests() {
  console.log('Starting API tests...');
  let subjectId: string | null = null;
  let competencyId: string | null = null;

  try {
    // Test 1: Create a subject
    try {
      const response = await axios.post(`${API_URL}/subjects`, testSubject);
      subjectId = response.data.id;
      logTest('Create Subject', true);
    } catch (error) {
      logTest('Create Subject', false, error);
      return;
    }

    // Test 2: Get all subjects
    try {
      const response = await axios.get(`${API_URL}/subjects`);
      logTest('Get All Subjects', Array.isArray(response.data));
    } catch (error) {
      logTest('Get All Subjects', false, error);
    }

    // Test 3: Get subject by ID
    try {
      const response = await axios.get(`${API_URL}/subjects/${subjectId}`);
      logTest('Get Subject by ID', response.data.id === subjectId);
    } catch (error) {
      logTest('Get Subject by ID', false, error);
    }

    // Test 4: Update subject
    try {
      const updatedSubject = { name: 'Advanced Cloud Computing' };
      const response = await axios.put(`${API_URL}/subjects/${subjectId}`, updatedSubject);
      logTest('Update Subject', response.data.name === updatedSubject.name);
    } catch (error) {
      logTest('Update Subject', false, error);
    }

    // Test 5: Create a competency
    try {
      const competency = { ...testCompetency, subjectId };
      const response = await axios.post(`${API_URL}/competencies`, competency);
      competencyId = response.data.id;
      logTest('Create Competency', true);
    } catch (error) {
      logTest('Create Competency', false, error);
    }

    // Test 6: Get all competencies
    try {
      const response = await axios.get(`${API_URL}/competencies`);
      logTest('Get All Competencies', Array.isArray(response.data));
    } catch (error) {
      logTest('Get All Competencies', false, error);
    }

    // Test 7: Get competencies by subject ID
    try {
      const response = await axios.get(`${API_URL}/competencies?subjectId=${subjectId}`);
      logTest('Get Competencies by Subject ID', 
        Array.isArray(response.data) && 
        response.data.some((c: any) => c.subjectId === subjectId)
      );
    } catch (error) {
      logTest('Get Competencies by Subject ID', false, error);
    }

    // Test 8: Get competency by ID
    try {
      const response = await axios.get(`${API_URL}/competencies/${competencyId}`);
      logTest('Get Competency by ID', response.data.id === competencyId);
    } catch (error) {
      logTest('Get Competency by ID', false, error);
    }

    // Test 9: Update competency
    try {
      const updatedCompetency = { marks: 9 };
      const response = await axios.put(`${API_URL}/competencies/${competencyId}`, updatedCompetency);
      logTest('Update Competency', response.data.marks === updatedCompetency.marks);
    } catch (error) {
      logTest('Update Competency', false, error);
    }

    // Test 10: Delete competency
    try {
      await axios.delete(`${API_URL}/competencies/${competencyId}`);
      try {
        await axios.get(`${API_URL}/competencies/${competencyId}`);
        logTest('Delete Competency', false);
      } catch (error: any) {
        logTest('Delete Competency', error.response?.status === 404);
      }
    } catch (error) {
      logTest('Delete Competency', false, error);
    }

    // Test 11: Delete subject (should cascade delete competencies)
    try {
      // Create a new competency for this subject first
      const newCompetency = { ...testCompetency, subjectId };
      const compResponse = await axios.post(`${API_URL}/competencies`, newCompetency);
      const newCompetencyId = compResponse.data.id;
      
      // Now delete the subject
      await axios.delete(`${API_URL}/subjects/${subjectId}`);
      
      // Try to get the subject - should fail
      try {
        await axios.get(`${API_URL}/subjects/${subjectId}`);
        logTest('Delete Subject', false);
      } catch (subjectError: any) {
        // Try to get the competency - should also fail if cascade delete worked
        try {
          await axios.get(`${API_URL}/competencies/${newCompetencyId}`);
          logTest('Cascade Delete Competencies', false);
        } catch (compError: any) {
          logTest('Cascade Delete Competencies', compError.response?.status === 404);
        }
        
        logTest('Delete Subject', subjectError.response?.status === 404);
      }
    } catch (error) {
      logTest('Delete Subject', false, error);
    }

    // Test 12: Validation test - create subject without name
    try {
      await axios.post(`${API_URL}/subjects`, { description: 'No name provided' });
      logTest('Validation - Subject without name', false);
    } catch (error: any) {
      logTest('Validation - Subject without name', error.response?.status === 400);
    }

    // Test 13: Validation test - create competency with invalid marks
    try {
      const invalidCompetency = {
        name: 'Invalid Marks',
        subjectId: uuidv4(), // Random ID
        marks: 15 // Invalid: should be 0-10
      };
      await axios.post(`${API_URL}/competencies`, invalidCompetency);
      logTest('Validation - Competency with invalid marks', false);
    } catch (error: any) {
      logTest('Validation - Competency with invalid marks', error.response?.status === 400);
    }

    console.log('API tests completed!');
  } catch (error) {
    console.error('Test execution failed:', error);
  }
}

// Run the tests
runTests();
