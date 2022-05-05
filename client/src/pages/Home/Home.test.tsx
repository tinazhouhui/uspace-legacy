import React from 'react';
import {render, screen} from '@testing-library/react';
import Home from './Home';
import {BrowserRouter} from 'react-router-dom';
import {UserContext} from '../../App';


const loggedInUser = {
    user: {
        given_name: "Fluffy",
        family_name: "Otterson",
        nickname: "fluffyOtter",
        name: "Fluffy Otterson",
        picture: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.pinterest.com%2Fpin%2F493988652877131644%2F&psig=AOvVaw34k2qwJDVc0j9V2Ph_XgYc&ust=1651824814352000&source=images&cd=vfe&ved=0CAwQjRxqFwoTCLCm5Yz1x_cCFQAAAAAdAAAAABAD",
        locale: "en",
        updated_at: "2022-05-05T08:06:17.203Z",
        email: "iamawesome@gmail.com",
        email_verified: true,
        sub: "google-oauth2|112871388917455861681"
    },
    isLoading: false,
    isAuthenticated: true
}

const loadingUser = {
    user: {},
    isLoading: true,
    isAuthenticated: false

}

test('renders loading', () => {
    render(
        <BrowserRouter>
            <UserContext.Provider value={loadingUser}>
                <Home/>
            </UserContext.Provider>
        </BrowserRouter>
    );
    const loadingElement = screen.getByRole('presentation');
    expect(loadingElement).toBeInTheDocument();
});

test('renders welcome page', () => {
    render(
        <BrowserRouter>
            <Home/>
        </BrowserRouter>
    );
    const loginButtons = screen.getAllByText('Log In');
    expect(loginButtons).toHaveLength(2);

    const signUpButtons = screen.getAllByText('Sign Up');
    expect(signUpButtons).toHaveLength(2);
});

test('renders homepage', () => {

    render(
        <BrowserRouter>
            <UserContext.Provider value={loggedInUser}>
                <Home/>
            </UserContext.Provider>
        </BrowserRouter>
    );
    const createSpaceButton = screen.getByText('Create a Space');
    expect(createSpaceButton).toBeInTheDocument();

});
