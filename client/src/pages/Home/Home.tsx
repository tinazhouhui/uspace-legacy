import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import {useAuth0} from '@auth0/auth0-react';
import Spaces from './components/Spaces/Spaces';
import {CreateUserType, UserType} from '../../interfaces/Interfaces';
import {createContext, useContext, useEffect, useState} from 'react';
import Welcome from './components/Welcome/Welcome';
import API_USER_SERVICE from '../../services/apiUserService';


function userExists(id: string) {
    return API_USER_SERVICE.getUserById(id)
        .then((response) => {
            return !!response;
        })
}

export const UserContext = createContext<UserType | {}>({})
export function useUser() {
    const context = useContext(UserContext);
    if (Object.keys(context).length === 0) {
        throw new Error('useUser must be used within a UserContext provider')
    }

    return context as UserType
}

function Home() {
    const {isLoading, isAuthenticated, user} = useAuth0();
    const [opened, setOpened] = useState<boolean>(false);
    const [userData, setUser] = useState<UserType | {}>({})

    useEffect(() => {
        if (user) {
            if (!userExists(user.sub!)) {
                const userData: CreateUserType = {
                    email: user!.email!,
                    email_verified: user!.email_verified!,
                    username: user!.nickname!,
                    picture_url: user!.picture!,
                    sub: user!.sub!,
                };

                API_USER_SERVICE.createUser(userData)
            }
            setUser(user);
        }
    }, [user])


    if (isLoading) {
        return (
            <div className="main-loading">
                <Loading/>
            </div>
        );
    }

    return (
        <>
            <Header setOpened={setOpened}/>
            <UserContext.Provider value={userData}>
                {isAuthenticated ? (
                    <Spaces opened={opened} setOpened={setOpened}/>
                ) : (
                    <Welcome/>
                )}
            </UserContext.Provider>
        </>
    );
}

export default Home;
