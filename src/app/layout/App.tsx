import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import { observer } from 'mobx-react-lite';
import { Route, Routes, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import Layout from './Layout';

function App() {

  const location = useLocation();

  return (
    <>
      <Routes>
        <Route index path='/' element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path='/activities' element={<ActivityDashboard />} />
          <Route path='/activities/:id' element={<ActivityDetails />} />
          <Route path='/createActivity' element={<ActivityForm key={location.key} />} />
          <Route path='/manage/:id' element={<ActivityForm key={location.key} />} />
        </Route>
      </Routes>
    </>
  );
}

export default observer(App);
