import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function PrivateRoute({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  /*
    User is not logged in.
    Save the current URL so Login can return
    the user to the page they originally wanted.
  */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname + location.search,
        }}
      />
    );
  }

  /*
    User is authenticated.
    Render the protected page.
  */

  return children;
}


export function AdminRoute({ children }) {
  const { user, isAdmin } = useAuth();

  /*
    User is not logged in.
  */

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  /*
    User is logged in but is not an ADMIN.
  */

  if (!isAdmin) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  /*
    User is authenticated and is ADMIN.
  */

  return children;
}