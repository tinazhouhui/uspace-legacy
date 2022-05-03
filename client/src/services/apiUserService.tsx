import {CreateUserType,} from '../interfaces/Interfaces';

const URL = process.env.REACT_APP_API;

const getUserById = async (id: number) => {
    const res = await fetch(URL + `/users/${id}`);
    return await res.json();
}
// creates a single user
const createUser = async (data: CreateUserType) => {
    await fetch(URL + '/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

const API_USER_SERVICE = {getUserById, createUser}

export default API_USER_SERVICE;
