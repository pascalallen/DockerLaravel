import classnames from 'classnames';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { ThunkAction } from 'redux-thunk';
import Path from '@/router/Path';
import { logout } from '@/redux/userSlice';
import { RootState } from '@/types/redux';

const Navbar = (): React.ReactElement => {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();
  const user = useSelector((state: RootState) => state.user);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-gray-100 shadow">
      <a
        className="navbar-brand"
        href={Path.HOME}
        onClick={(event): void => {
          event.preventDefault();
          history.push(Path.HOME);
        }}>
        Logo img here
      </a>
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span className="navbar-toggler-icon" />
      </button>
      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mx-auto">
          <li className="nav-item">
            <a
              id="nav-link-1"
              className={classnames('nav-link', location.pathname === Path.HOME && 'active')}
              href={Path.HOME}
              onClick={(event): void => {
                event.preventDefault();
                history.push(Path.HOME);
              }}>
              Home
            </a>
          </li>
          <li className="nav-item">
            <a
              id="nav-link-2"
              className={classnames('nav-link', location.pathname === Path.ACCOUNT && 'active')}
              href={Path.ACCOUNT}
              onClick={(event): void => {
                event.preventDefault();
                history.push(Path.ACCOUNT);
              }}>
              Account
            </a>
          </li>
        </ul>
        <ul className="navbar-nav">
          <li className="nav-item">
            Hi {user.name}
            <button
              className="btn border-0 p-0"
              type="button"
              onClick={(): ThunkAction<any, any, any, any> => dispatch(logout())}>
              <i className="fas fa-sign-out-alt ml-2" />
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
