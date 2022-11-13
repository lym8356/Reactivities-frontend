import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityForm from '../../features/activities/form/ActivityForm';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
// import Layout from './Layout';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import NavBar from './NavBar';
import { Container } from 'semantic-ui-react';
import ServerError from '../../features/errors/ServerError';
import { useStore } from '../stores/store';
import { useEffect } from 'react';
import LoadingComponent from './LoadingComponent';
import ModalContainer from '../common/modals/ModalContainer';
import ProfilePage from '../../features/profiles/ProfilePage';
import PrivateRoute from './PrivateRoute';



function App() {

  const location = useLocation();
    const {commonStore, userStore} = useStore();

    useEffect(() => {
      if (commonStore.token) {
        userStore.getUser().finally(() => commonStore.setAppLoaded());
      } else {
        commonStore.setAppLoaded();
      }
    }, [commonStore, userStore])

    if (!commonStore.appLoaded) return <LoadingComponent content='Loading app...' />

  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar />
      <ModalContainer />
      {/* <Routes>
        <Route index path='/' element={<HomePage />} />
        <Route element={<Layout />}>
          <Route path='/activities' element={<ActivityDashboard />} />
          <Route path='/activities/:id' element={<ActivityDetails />} />
          <Route path='/createActivity' element={<ActivityForm key={location.key} />} />
          <Route path='/manage/:id' element={<ActivityForm key={location.key} />} />
          <Route path='/errors' element={<TestErrors />} />
          <Route path='*' element={<NotFound />} />
        </Route>
      </Routes> */}
      <Route exact path='/' component={HomePage} />
      <Route
        path={'/(.+)'}
        render={() => (
          <>
            <NavBar />
            <Container style={{ marginTop: '7em' }}>
              <Switch>
                <PrivateRoute exact path='/activities' component={ActivityDashboard} />
                <PrivateRoute path='/activities/:id' component={ActivityDetails} />
                <PrivateRoute key={location.key} 
                  path={['/createActivity', '/manage/:id']} component={ActivityForm} />
                <PrivateRoute path='/profiles/:username' component={ProfilePage} />
                <PrivateRoute path='/errors' component={TestErrors} />
                <Route path='/server-error' component={ServerError} />
                <Route path='*' component={NotFound} />
              </Switch>
            </Container>
          </>
        )}
      />
    </>
  );
}

export default observer(App);
