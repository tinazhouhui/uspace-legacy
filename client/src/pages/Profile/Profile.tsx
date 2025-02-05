import { useAuth0, withAuthenticationRequired } from '@auth0/auth0-react';
import { useState } from 'react';
import { UserType } from '../../interfaces/Interfaces';
import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import './Profile.scss';

const Profile = () => {
  const { user, isLoading } = useAuth0();
  const [userEmail, setUserEmail] = useState<string>('');
  const [userPicture, setUserPicture] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const fetchUser = async (user: UserType) => {
    // todo once logged in should be fetching user over and over again? or check state?
    setUserEmail(user.email);
    setUserPicture(user.picture_url);
    setUserName(user.username);
  };

  if (!isLoading && user) fetchUser(user as UserType);

  if (isLoading) {
    return (
      <div className="main-loading">
        <Loading />
      </div>
    );
  }

  // TODO: Send put requests to db
  return (
    <>
      <Header />
      <div className="profile">
        <div className="container">
          <h1>Profile</h1>
          <p>
            Here you can see and change your profile data like your profile picture, username and more.
          </p>
          <div className="profile-data">
            <form>
              <label>E-Mail:</label>
              <input type="text" defaultValue={userEmail} />
              <label>Profile Picture URL:</label>
              <input type="text" defaultValue={userPicture} />
              <label>Username:</label>
              <input type="text" defaultValue={userName} />
              <button type="submit">Update</button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default withAuthenticationRequired(Profile, {
  onRedirecting: () => <Loading />,
});
