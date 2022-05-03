import Header from '../../components/Header/Header';
import Loading from '../../components/Loading/Loading';
import Spaces from './components/Spaces/Spaces';

import {useState} from 'react';
import Welcome from './components/Welcome/Welcome';


interface IProps {
    isLoading: boolean,
    isAuthenticated: boolean
}

function Home({isLoading, isAuthenticated} : IProps) {
    const [opened, setOpened] = useState<boolean>(false);

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

            {isAuthenticated ? (
                <Spaces opened={opened} setOpened={setOpened}/>
            ) : (
                <Welcome/>
            )}

        </>
    );
}

export default Home;
