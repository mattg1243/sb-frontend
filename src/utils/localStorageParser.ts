export const getUserIdFromLocalStorage = () => {
  const userStr = localStorage.getItem('sb-user');
  if (!userStr) {
    return;
  }
  const id = JSON.parse(userStr)['id'] as string;
  return id;
}