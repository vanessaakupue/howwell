export const getErrorMessage = (errorCode) => {
  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Invalid email address. Please check your email and try again.';
    case 'auth/user-not-found':
      return 'No account found with this email. Please sign up.';
    case 'auth/email-already-in-use':
      return 'This email is already in use. Please use a different email.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    default:
      return 'An error occurred. Please try again later.';
  }
};