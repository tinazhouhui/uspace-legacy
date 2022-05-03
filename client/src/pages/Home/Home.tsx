import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import {useAuth0} from '@auth0/auth0-react';
import Spaces from './components/Spaces/Spaces';
import {CreateUserType, UserType} from '../../interfaces/Interfaces';
import {createContext, useEffect, useState} from 'react';
import Welcome from './components/Welcome/Welcome';
import API_USER_SERVICE from '../../services/apiUserService';


function userExists(id: string) {
    console.log('CHECK IF EXISTS')
    return API_USER_SERVICE.getUserById(id)
        .then((response) => {
            return !!response;
        })
}

const UserContext = createContext<UserType | {}>({})

function Home() {
    const {isLoading, isAuthenticated, user} = useAuth0();
    const [opened, setOpened] = useState<boolean>(false);
    const [userData, setUser] = useState<UserType | {}>({})

    useEffect(() => {
        console.log('_________________')
        console.log('loading', isLoading);
        console.log('user', user);
        console.log('authenticated', isAuthenticated);
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
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((err) => {
                        console.error(err)
                    })
            }
            setUser(user);
        }
    }, [user])


    //todo can be done using ? with one return
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
