import { writable } from 'svelte/store';

const initialUserData = {
    name: '',
    email: '',
    profilePicture: '',
    about: '',
  };

export const isLoggedIn = writable(false);
export const email = writable(''); 
export const user = writable(initialUserData);

export function updateUserProfile(userData) {
    return user.update((user) => {
      return { ...user, ...userData };
    });
  }
