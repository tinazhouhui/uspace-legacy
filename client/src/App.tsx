import './App.scss';
import {Route, Routes} from 'react-router-dom';
import Space from './pages/Space/Space';
import Home from './pages/Home/Home';
import Profile from './pages/Profile/Profile';
import {
    QueryClient,
    QueryClientProvider,
} from 'react-query'
import API_USER_SERVICE from './services/apiUserService';
import {createContext, useContext, useEffect, useState} from 'react';
import {CreateUserType, UserType} from './interfaces/Interfaces';
import {useAuth0} from '@auth0/auth0-react';

const queryClient = new QueryClient()

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


function App() {
    const {isLoading, isAuthenticated, user} = useAuth0();
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
    return (
        <QueryClientProvider client={queryClient}>
            <UserContext.Provider value={userData}>
                <Routes>
                    <Route path="/" element={<Home isAuthenticated={isAuthenticated} isLoading={isLoading}/>}/>
                    <Route path="/spaces" element={<Home isAuthenticated={isAuthenticated} isLoading={isLoading}/>}/>
                    <Route path="/spaces/:id" element={<Space/>}/>
                    <Route path="/profile/" element={<Profile/>}/>
                </Routes>
            </UserContext.Provider>
        </QueryClientProvider>
    );
}

export default App;
