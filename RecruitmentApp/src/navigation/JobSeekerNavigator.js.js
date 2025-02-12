import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import RecruiterDashboard from '../screens/Recruiter/RecruiterDashboard';
import JobPostingScreen from '../screens/Recruiter/JobPostingScreen';
import ResumeReviewScreen from '../screens/Recruiter/ResumeReviewScreen';

const Stack = createStackNavigator();

const RecruiterNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="RecruiterDashboard" component={RecruiterDashboard} />
      <Stack.Screen name="JobPosting" component={JobPostingScreen} />
      <Stack.Screen name="ResumeReview" component={ResumeReviewScreen} />
    </Stack.Navigator>
  );
};

export default RecruiterNavigator;
