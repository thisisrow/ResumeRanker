import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JobSeekerDashboard from '../screens/JobSeeker/JobSeekerDashboard';
import JobListingsScreen from '../screens/JobSeeker/JobListingsScreen';
import ApplicationScreen from '../screens/JobSeeker/ApplicationScreen';

const Stack = createStackNavigator();

const JobSeekerNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="JobSeekerDashboard" component={JobSeekerDashboard} />
      <Stack.Screen name="JobListings" component={JobListingsScreen} />
      <Stack.Screen name="Application" component={ApplicationScreen} />
    </Stack.Navigator>
  );
};

export default JobSeekerNavigator;
