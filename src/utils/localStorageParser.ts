/**
 * Retreives the users data from localStorage and returns their user ID.
 * @returns Users database ID.
 */
export const getUserIdFromLocalStorage = () => {
  const userStr = localStorage.getItem('sb-user');
  if (!userStr) {
    return;
  }
  let id = JSON.parse(userStr)['id'] as string;
  if (id === undefined) {
    // when a user registers the ID is returned like this since
    // the user is being returned straight from the database
    id = JSON.parse(userStr)['_id'] as string;
  }
  return id;
};
