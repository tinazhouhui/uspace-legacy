import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import Spaces from './components/Spaces/Spaces';

import {useState} from 'react';
import Welcome from './components/Welcome/Welcome';
import {useUser} from '../../App';


function Home() {
    const [opened, setOpened] = useState<boolean>(false);

    const user = useUser()

    if (user.isLoading) {
        return (
            <div className="main-loading">
                <Loading/>
            </div>
        );
    }

    return (
        <>
            <Header setOpened={setOpened}/>
            {user.isAuthenticated ? (
                <Spaces opened={opened} setOpened={setOpened}/>
            ) : (
                <Welcome/>
            )}

        </>
    );
}

export default Home;
