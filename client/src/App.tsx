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

export const UserContext = createContext<any>({})

export function useUser() {
    const context = useContext(UserContext);
    if (Object.keys(context).length === 0) {
    }
    return context;
}

function App() {
    const {isLoading, isAuthenticated, user} = useAuth0();
    const [userData, setUser] = useState<any>({})

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
            setUser({user, isLoading, isAuthenticated});
        }
    }, [user])
    return (
        <QueryClientProvider client={queryClient}>
            <Routes>
                <Route path="/" element={
                    <UserContext.Provider value={userData}>
                        <Home/>
                    </UserContext.Provider>
                }/>
                <Route path="/spaces" element={
                    <UserContext.Provider value={userData}>
                        <Home/>
                    </UserContext.Provider>
                }/>
                <Route path="/spaces/:id" element={
                    <UserContext.Provider value={userData}>
                        <Space/>
                    </UserContext.Provider>
                }/>
                <Route path="/profile/" element={
                    <UserContext.Provider value={userData}>
                        <Profile/>
                    </UserContext.Provider>
                }/>
            </Routes>

        </QueryClientProvider>
    );
}

export default App;
